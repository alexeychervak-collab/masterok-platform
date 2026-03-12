import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';
import 'app_text_styles.dart';

class AppTheme {
  // Запрет создания экземпляра класса
  AppTheme._();

  /// Светлая тема (Material Design 3)
  static ThemeData get light => ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        scaffoldBackgroundColor: AppColors.background,
        fontFamily: GoogleFonts.inter().fontFamily,
        
        // Цветовая схема
        colorScheme: ColorScheme.light(
          primary: AppColors.primary,
          onPrimary: Colors.white,
          primaryContainer: AppColors.primaryLight,
          onPrimaryContainer: AppColors.primaryDark,
          
          secondary: AppColors.secondary,
          onSecondary: Colors.white,
          secondaryContainer: AppColors.secondaryExtraLight,
          onSecondaryContainer: AppColors.secondary,
          
          tertiary: AppColors.accent,
          onTertiary: Colors.white,
          
          error: AppColors.error,
          onError: Colors.white,
          errorContainer: AppColors.error.withOpacity(0.1),
          onErrorContainer: AppColors.error,
          
          background: AppColors.background,
          onBackground: AppColors.textPrimary,
          
          surface: Colors.white,
          onSurface: AppColors.textPrimary,
          surfaceVariant: const Color(0xFFF3F4F6),
          onSurfaceVariant: AppColors.textSecondary,
          
          outline: AppColors.border,
          outlineVariant: const Color(0xFFF1F5F9),
          
          shadow: Colors.black.withOpacity(0.1),
          scrim: Colors.black.withOpacity(0.5),
          
          inverseSurface: Colors.grey[900]!,
          onInverseSurface: Colors.white,
          inversePrimary: AppColors.primaryLight,
        ),
        
        // Типографика
        textTheme: GoogleFonts.interTextTheme(AppTextStyles.textTheme),
        
        // AppBar
        appBarTheme: AppBarTheme(
          elevation: 0,
          centerTitle: true,
          backgroundColor: Colors.white,
          foregroundColor: AppColors.textPrimary,
          surfaceTintColor: Colors.transparent,
          titleTextStyle: AppTextStyles.h3.copyWith(color: AppColors.textPrimary),
          iconTheme: const IconThemeData(color: AppColors.textPrimary),
        ),
        
        // Card
        cardTheme: CardThemeData(
          elevation: 0,
          shadowColor: Colors.black.withOpacity(0.1),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          margin: const EdgeInsets.all(8),
        ),
        
        // Button
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            textStyle: AppTextStyles.button,
          ),
        ),
        
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            side: BorderSide(color: AppColors.primary, width: 2),
            textStyle: AppTextStyles.button,
          ),
        ),
        
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            textStyle: AppTextStyles.button,
          ),
        ),
        
        // Input
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFFF9FAFB),
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.primary, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.error),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.error, width: 2),
          ),
          labelStyle: AppTextStyles.body,
          hintStyle: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
        ),
        
        // Chip
        chipTheme: ChipThemeData(
          backgroundColor: Colors.grey[100]!,
          selectedColor: AppColors.primary.withOpacity(0.2),
          labelStyle: AppTextStyles.caption,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        
        // Divider
        dividerTheme: DividerThemeData(
          color: Colors.grey[200],
          thickness: 1,
          space: 1,
        ),
        
        // BottomSheet
        bottomSheetTheme: const BottomSheetThemeData(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
        ),
        
        // Dialog
        dialogTheme: DialogThemeData(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
        ),
        
        // FloatingActionButton
        floatingActionButtonTheme: FloatingActionButtonThemeData(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        
        navigationBarTheme: NavigationBarThemeData(
          backgroundColor: Colors.white,
          elevation: 0,
          indicatorColor: AppColors.primary.withOpacity(0.10),
          labelTextStyle: WidgetStatePropertyAll(
            AppTextStyles.caption.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
          ),
        ),
        
        // SnackBar
        snackBarTheme: SnackBarThemeData(
          backgroundColor: Colors.grey[900],
          contentTextStyle: AppTextStyles.body.copyWith(color: Colors.white),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          behavior: SnackBarBehavior.floating,
        ),
      );

  /// Темная тема (OLED-friendly)
  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        fontFamily: GoogleFonts.inter().fontFamily,
        
        // Цветовая схема
        colorScheme: ColorScheme.dark(
          primary: AppColors.primaryLight,
          onPrimary: Colors.black,
          primaryContainer: AppColors.primary,
          onPrimaryContainer: Colors.white,
          
          secondary: AppColors.secondaryLight,
          onSecondary: Colors.black,
          secondaryContainer: AppColors.secondary,
          onSecondaryContainer: Colors.white,
          
          tertiary: AppColors.accent,
          onTertiary: Colors.black,
          
          error: AppColors.error,
          onError: Colors.white,
          errorContainer: AppColors.error.withOpacity(0.2),
          onErrorContainer: AppColors.error.withOpacity(0.8),
          
          background: Colors.black, // Чистый черный для OLED
          onBackground: Colors.white,
          
          surface: const Color(0xFF121212), // Темно-серый
          onSurface: Colors.white,
          surfaceVariant: const Color(0xFF1E1E1E),
          onSurfaceVariant: Colors.white70,
          
          outline: Colors.grey[700]!,
          outlineVariant: Colors.grey[800]!,
          
          shadow: Colors.black.withOpacity(0.5),
          scrim: Colors.black.withOpacity(0.7),
          
          inverseSurface: Colors.grey[100]!,
          onInverseSurface: Colors.black,
          inversePrimary: AppColors.primaryDark,
        ),
        
        // Типографика
        textTheme: GoogleFonts.interTextTheme(AppTextStyles.textTheme).apply(
          bodyColor: Colors.white,
          displayColor: Colors.white,
        ),
        
        // AppBar
        appBarTheme: AppBarTheme(
          elevation: 0,
          centerTitle: true,
          backgroundColor: const Color(0xFF121212),
          foregroundColor: Colors.white,
          surfaceTintColor: Colors.transparent,
          titleTextStyle: AppTextStyles.h3.copyWith(color: Colors.white),
          iconTheme: const IconThemeData(color: Colors.white),
        ),
        
        // Card
        cardTheme: CardThemeData(
          elevation: 4,
          shadowColor: Colors.black.withOpacity(0.5),
          color: const Color(0xFF1E1E1E),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          margin: const EdgeInsets.all(8),
        ),
        
        // Button
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 2,
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            textStyle: AppTextStyles.button,
          ),
        ),
        
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            side: BorderSide(color: AppColors.primaryLight, width: 2),
            textStyle: AppTextStyles.button,
          ),
        ),
        
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            textStyle: AppTextStyles.button,
          ),
        ),
        
        // Input
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF1E1E1E),
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.grey[700]!),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.grey[700]!),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.primaryLight, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.error),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.error, width: 2),
          ),
          labelStyle: AppTextStyles.body.copyWith(color: Colors.white70),
          hintStyle: AppTextStyles.body.copyWith(color: Colors.grey),
        ),
        
        // Chip
        chipTheme: ChipThemeData(
          backgroundColor: const Color(0xFF1E1E1E),
          selectedColor: AppColors.primaryLight.withOpacity(0.3),
          labelStyle: AppTextStyles.caption.copyWith(color: Colors.white),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        
        // Divider
        dividerTheme: DividerThemeData(
          color: Colors.grey[800],
          thickness: 1,
          space: 1,
        ),
        
        // BottomSheet
        bottomSheetTheme: const BottomSheetThemeData(
          backgroundColor: Color(0xFF1E1E1E),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
        ),
        
        // Dialog
        dialogTheme: const DialogThemeData(
          backgroundColor: Color(0xFF1E1E1E),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(24)),
          ),
        ),
        
        // FloatingActionButton
        floatingActionButtonTheme: FloatingActionButtonThemeData(
          backgroundColor: AppColors.primaryLight,
          foregroundColor: Colors.black,
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        
        // BottomNavigationBar
        bottomNavigationBarTheme: BottomNavigationBarThemeData(
          backgroundColor: const Color(0xFF1E1E1E),
          selectedItemColor: AppColors.primaryLight,
          unselectedItemColor: Colors.grey,
          selectedLabelStyle: AppTextStyles.caption,
          unselectedLabelStyle: AppTextStyles.caption,
          showSelectedLabels: true,
          showUnselectedLabels: true,
          type: BottomNavigationBarType.fixed,
          elevation: 8,
        ),
        
        // SnackBar
        snackBarTheme: SnackBarThemeData(
          backgroundColor: const Color(0xFF2E2E2E),
          contentTextStyle: AppTextStyles.body.copyWith(color: Colors.white),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          behavior: SnackBarBehavior.floating,
        ),
      );
}
