import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final localChatStorageProvider = Provider<LocalChatStorage>((ref) {
  return LocalChatStorage();
});

class ChatMessage {
  final String id;
  final int senderId;
  final int receiverId;
  final String text;
  final DateTime createdAt;

  const ChatMessage({
    required this.id,
    required this.senderId,
    required this.receiverId,
    required this.text,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'sender_id': senderId,
        'receiver_id': receiverId,
        'text': text,
        'created_at': createdAt.toIso8601String(),
      };

  static ChatMessage fromJson(Map<String, dynamic> json) => ChatMessage(
        id: json['id'] as String,
        senderId: json['sender_id'] as int,
        receiverId: json['receiver_id'] as int,
        text: json['text'] as String,
        createdAt: DateTime.parse(json['created_at'] as String),
      );
}

class LocalChatStorage {
  static const _keyPrefix = 'local_chat_v1_';

  /// Стабильный id диалога по двум участникам (чтобы при смене аккаунта чат совпадал).
  String chatIdFor(int a, int b) {
    final min = a < b ? a : b;
    final max = a < b ? b : a;
    return '$min-$max';
  }

  String _keyForChat(String chatId) => '$_keyPrefix$chatId';

  Future<List<ChatMessage>> load(String chatId) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyForChat(chatId));
    if (raw == null || raw.isEmpty) return [];
    try {
      final list = jsonDecode(raw) as List<dynamic>;
      return list.map((e) => ChatMessage.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> save(String chatId, List<ChatMessage> messages) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = jsonEncode(messages.map((m) => m.toJson()).toList());
    await prefs.setString(_keyForChat(chatId), raw);
  }

  Future<ChatMessage> append(String chatId, ChatMessage message) async {
    final current = await load(chatId);
    final updated = [...current, message];
    await save(chatId, updated);
    return message;
  }
}




