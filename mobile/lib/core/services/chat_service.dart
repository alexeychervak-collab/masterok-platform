import 'dart:async';
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:masterok/core/network/api_client.dart';

final chatServiceProvider = Provider<ChatService>((ref) {
  return ChatService(ref.read(dioProvider));
});

class ChatMessageDto {
  final String id;
  final String chatId;
  final String senderId;
  final String receiverId;
  final String text;
  final String messageType;
  final bool isRead;
  final DateTime createdAt;

  ChatMessageDto({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.receiverId,
    required this.text,
    this.messageType = 'text',
    this.isRead = false,
    required this.createdAt,
  });

  factory ChatMessageDto.fromJson(Map<String, dynamic> json) => ChatMessageDto(
    id: json['id'] as String,
    chatId: json['chat_id'] as String,
    senderId: json['sender_id'] as String,
    receiverId: json['receiver_id'] as String,
    text: json['text'] as String,
    messageType: json['message_type'] as String? ?? 'text',
    isRead: json['is_read'] as bool? ?? false,
    createdAt: DateTime.parse(json['created_at'] as String),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'chat_id': chatId,
    'sender_id': senderId,
    'receiver_id': receiverId,
    'text': text,
    'message_type': messageType,
    'is_read': isRead,
    'created_at': createdAt.toIso8601String(),
  };
}

class Conversation {
  final String chatId;
  final String otherUserId;
  final String otherUserName;
  final String? otherUserAvatar;
  final String? lastMessage;
  final DateTime? lastMessageTime;
  final int unreadCount;

  Conversation({
    required this.chatId,
    required this.otherUserId,
    required this.otherUserName,
    this.otherUserAvatar,
    this.lastMessage,
    this.lastMessageTime,
    this.unreadCount = 0,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) => Conversation(
    chatId: json['chat_id'] as String? ?? '',
    otherUserId: json['other_user_id'] as String,
    otherUserName: json['other_user_name'] as String,
    otherUserAvatar: json['other_user_avatar'] as String?,
    lastMessage: json['last_message'] as String?,
    lastMessageTime: json['last_message_time'] != null
        ? DateTime.parse(json['last_message_time'] as String)
        : null,
    unreadCount: json['unread_count'] as int? ?? 0,
  );
}

class ChatService {
  final Dio _dio;

  ChatService(this._dio);

  /// Generate a stable chat ID from two user IDs (sorted).
  static String getChatId(String userId1, String userId2) {
    final ids = [userId1, userId2]..sort();
    return '${ids[0]}_${ids[1]}';
  }

  Future<List<Conversation>> getConversations() async {
    try {
      final response = await _dio.get('/chat/conversations');
      final List<dynamic> data = response.data as List<dynamic>;
      return data.map((json) => Conversation.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      return _getMockConversations();
    }
  }

  Future<List<ChatMessageDto>> getHistory(String chatId, {int skip = 0, int limit = 50}) async {
    try {
      final response = await _dio.get(
        '/chat/history/$chatId',
        queryParameters: {'skip': skip, 'limit': limit},
      );
      final List<dynamic> data = response.data as List<dynamic>;
      return data.map((json) => ChatMessageDto.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      return [];
    }
  }

  Future<ChatMessageDto> sendMessage({
    required String receiverId,
    required String text,
    String? orderId,
  }) async {
    try {
      final response = await _dio.post('/chat/messages', data: {
        'receiver_id': receiverId,
        'text': text,
        'order_id': orderId,
        'message_type': 'text',
      });
      return ChatMessageDto.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      // Create local message on failure
      return ChatMessageDto(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        chatId: '',
        senderId: 'me',
        receiverId: receiverId,
        text: text,
        createdAt: DateTime.now(),
      );
    }
  }

  Future<void> markAsRead(String chatId) async {
    try {
      await _dio.post('/chat/$chatId/read');
    } catch (_) {
      // Silently ignore read-receipt failures
    }
  }

  List<Conversation> _getMockConversations() {
    return [
      Conversation(
        chatId: 'mock_1',
        otherUserId: 's1',
        otherUserName: 'Алексей Петров',
        otherUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        lastMessage: 'Добрый день! Готов начать работу завтра.',
        lastMessageTime: DateTime.now().subtract(const Duration(minutes: 15)),
        unreadCount: 2,
      ),
      Conversation(
        chatId: 'mock_2',
        otherUserId: 's2',
        otherUserName: 'Мария Соколова',
        otherUserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        lastMessage: 'Отправила вам фото с прошлого проекта',
        lastMessageTime: DateTime.now().subtract(const Duration(hours: 3)),
        unreadCount: 0,
      ),
      Conversation(
        chatId: 'mock_3',
        otherUserId: 's3',
        otherUserName: 'Дмитрий Иванов',
        otherUserAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        lastMessage: 'Заказ выполнен, проверьте пожалуйста',
        lastMessageTime: DateTime.now().subtract(const Duration(days: 1)),
        unreadCount: 1,
      ),
    ];
  }
}
