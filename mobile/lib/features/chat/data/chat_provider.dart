import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:masterok/core/services/chat_service.dart';

final conversationsProvider = FutureProvider.autoDispose<List<Conversation>>((ref) async {
  final service = ref.watch(chatServiceProvider);
  return service.getConversations();
});

final chatHistoryProvider = FutureProvider.autoDispose.family<List<ChatMessageDto>, String>((ref, chatId) async {
  final service = ref.watch(chatServiceProvider);
  return service.getHistory(chatId);
});
