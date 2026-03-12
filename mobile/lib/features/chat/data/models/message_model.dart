import 'package:equatable/equatable.dart';

enum MessageType {
  text,
  image,
  file,
  voice,
  system,
}

enum MessageStatus {
  sending,
  sent,
  delivered,
  read,
  failed,
}

class MessageModel extends Equatable {
  final String id;
  final String chatRoomId;
  final String senderId;
  final String content;
  final MessageType type;
  final MessageStatus status;
  final DateTime timestamp;
  final String? fileUrl;
  final String? fileName;
  final int? fileSize;
  final bool isEdited;
  final String? replyToMessageId;

  const MessageModel({
    required this.id,
    required this.chatRoomId,
    required this.senderId,
    required this.content,
    this.type = MessageType.text,
    this.status = MessageStatus.sent,
    required this.timestamp,
    this.fileUrl,
    this.fileName,
    this.fileSize,
    this.isEdited = false,
    this.replyToMessageId,
  });

  @override
  List<Object?> get props => [
        id,
        chatRoomId,
        senderId,
        content,
        type,
        status,
        timestamp,
        fileUrl,
        fileName,
        fileSize,
        isEdited,
        replyToMessageId,
      ];
}

class ChatRoomModel extends Equatable {
  final String id;
  final String orderId;
  final String clientId;
  final String specialistId;
  final MessageModel? lastMessage;
  final int unreadCount;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;

  const ChatRoomModel({
    required this.id,
    required this.orderId,
    required this.clientId,
    required this.specialistId,
    this.lastMessage,
    this.unreadCount = 0,
    required this.createdAt,
    required this.updatedAt,
    this.isActive = true,
  });

  @override
  List<Object?> get props => [
        id,
        orderId,
        clientId,
        specialistId,
        lastMessage,
        unreadCount,
        createdAt,
        updatedAt,
        isActive,
      ];
}




