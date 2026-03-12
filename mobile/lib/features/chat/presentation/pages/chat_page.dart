import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/core/services/local_chat_storage.dart';
import 'package:masterok/features/auth/data/auth_provider.dart';

class ChatPage extends ConsumerStatefulWidget {
  final int specialistId;
  final String specialistName;

  const ChatPage({
    super.key,
    required this.specialistId,
    required this.specialistName,
  });

  @override
  ConsumerState<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends ConsumerState<ChatPage> {
  final _controller = TextEditingController();
  final _uuid = const Uuid();
  List<ChatMessage> _messages = const [];
  bool _loading = true;
  String? _chatId;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final user = ref.read(currentUserProvider).valueOrNull;
    if (user == null) {
      setState(() {
        _loading = false;
        _chatId = null;
        _messages = const [];
      });
      return;
    }

    final storage = ref.read(localChatStorageProvider);
    final chatId = storage.chatIdFor(user.id, widget.specialistId);
    final existing = await storage.load(chatId);

    // Если чат новый — добавим системное приветствие (один раз).
    final seeded = existing.isNotEmpty
        ? existing
        : [
            ChatMessage(
              id: _uuid.v4(),
              senderId: widget.specialistId,
              receiverId: user.id,
              text: 'Здравствуйте! Напишите, что нужно сделать.',
              createdAt: DateTime.now(),
            ),
          ];

    if (existing.isEmpty) {
      await storage.save(chatId, seeded);
    }

    if (!mounted) return;
    setState(() {
      _chatId = chatId;
      _messages = seeded;
      _loading = false;
    });
  }

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    final user = ref.read(currentUserProvider).valueOrNull;
    final chatId = _chatId;
    if (user == null || chatId == null) return;

    final storage = ref.read(localChatStorageProvider);
    final msg = ChatMessage(
      id: _uuid.v4(),
      senderId: user.id,
      receiverId: widget.specialistId,
      text: text,
      createdAt: DateTime.now(),
    );

    await storage.append(chatId, msg);
    final updated = await storage.load(chatId);

    if (!mounted) return;
    setState(() {
      _messages = updated;
      _controller.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider).valueOrNull;

    return Scaffold(
      appBar: AppBar(title: Text(widget.specialistName)),
      body: Column(
        children: [
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : user == null
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.lock_outline, size: 44),
                              const SizedBox(height: 12),
                              const Text('Войдите, чтобы писать сообщения'),
                              const SizedBox(height: 12),
                              ElevatedButton(
                                onPressed: () => Navigator.of(context).pop(),
                                child: const Text('Ок'),
                              ),
                            ],
                          ),
                        ),
                      )
                    : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
                      itemBuilder: (context, i) => _Bubble(
                        msg: _messages[i],
                        myId: user.id,
                      ),
                    ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) => _send(),
                      decoration: const InputDecoration(hintText: 'Сообщение…'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  IconButton(
                    onPressed: user == null ? null : _send,
                    icon: const Icon(Icons.send),
                    color: AppColors.primary,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Bubble extends StatelessWidget {
  final ChatMessage msg;
  final int myId;
  const _Bubble({required this.msg, required this.myId});

  @override
  Widget build(BuildContext context) {
    final isMe = msg.senderId == myId;
    final align = isMe ? Alignment.centerRight : Alignment.centerLeft;
    final color = isMe ? AppColors.primary : AppColors.surface;
    final textColor = isMe ? Colors.white : AppColors.textPrimary;
    final border = isMe ? null : Border.all(color: AppColors.border);

    return Align(
      alignment: align,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        constraints: const BoxConstraints(maxWidth: 320),
        decoration: BoxDecoration(
          color: color,
          border: border,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(msg.text, style: TextStyle(color: textColor)),
      ),
    );
  }
}




