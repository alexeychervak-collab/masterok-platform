import 'package:flutter/material.dart';

/// Лёгкая анимированная кнопка (для использования в демо-экранах)
class AnimatedButton extends StatefulWidget {
  final String text;
  final IconData? icon;
  final VoidCallback? onPressed;
  final bool isPrimary;
  final Color? backgroundColor;
  final Color? foregroundColor;

  const AnimatedButton({
    super.key,
    required this.text,
    this.icon,
    this.onPressed,
    this.isPrimary = true,
    this.backgroundColor,
    this.foregroundColor,
  });

  @override
  State<AnimatedButton> createState() => _AnimatedButtonState();
}

class _AnimatedButtonState extends State<AnimatedButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final enabled = widget.onPressed != null;
    final scheme = Theme.of(context).colorScheme;
    final bg = widget.backgroundColor ??
        (widget.isPrimary ? scheme.primary : Colors.transparent);
    final fg = widget.foregroundColor ??
        (widget.isPrimary ? Colors.white : scheme.primary);

    return AnimatedScale(
      scale: _pressed ? 0.98 : 1,
      duration: const Duration(milliseconds: 120),
      child: ElevatedButton.icon(
        onPressed: enabled ? widget.onPressed : null,
        onLongPress: null,
        icon: widget.icon != null
            ? Icon(widget.icon, size: 18)
            : const SizedBox(width: 0, height: 0),
        label: Text(widget.text),
        style: ElevatedButton.styleFrom(
          backgroundColor: bg,
          foregroundColor: fg,
          elevation: widget.isPrimary ? 0 : 0,
          side: widget.isPrimary ? null : BorderSide(color: scheme.primary.withOpacity(0.4)),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      ),
    );
  }
}


