import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:yodo/features/auth/presentation/pages/login_page.dart';
import 'package:yodo/features/auth/presentation/pages/register_page.dart';
import 'package:yodo/features/home/presentation/pages/home_page.dart';
import 'package:yodo/features/specialists/presentation/pages/specialists_page.dart';
import 'package:yodo/features/specialists/presentation/pages/specialist_detail_page.dart';
import 'package:yodo/features/orders/presentation/pages/orders_page.dart';
import 'package:yodo/features/profile/presentation/pages/profile_page.dart';
import 'package:yodo/features/shell/presentation/pages/shell_page.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      // Shell route with bottom navigation
      ShellRoute(
        builder: (context, state, child) => ShellPage(child: child),
        routes: [
          GoRoute(
            path: '/',
            name: 'home',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: HomePage(),
            ),
          ),
          GoRoute(
            path: '/specialists',
            name: 'specialists',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: SpecialistsPage(),
            ),
          ),
          GoRoute(
            path: '/orders',
            name: 'orders',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: OrdersPage(),
            ),
          ),
          GoRoute(
            path: '/profile',
            name: 'profile',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: ProfilePage(),
            ),
          ),
        ],
      ),
      // Auth routes
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterPage(),
      ),
      // Detail routes
      GoRoute(
        path: '/specialist/:id',
        name: 'specialist-detail',
        builder: (context, state) => SpecialistDetailPage(
          id: state.pathParameters['id']!,
        ),
      ),
    ],
  );
});




