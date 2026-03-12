import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/features/auth/presentation/pages/login_page.dart';
import 'package:masterok/features/auth/presentation/pages/register_page.dart';
import 'package:masterok/features/auth/presentation/pages/forgot_password_page.dart';
import 'package:masterok/features/auth/presentation/pages/phone_login_page.dart';
import 'package:masterok/features/home/presentation/pages/home_page_improved.dart';
import 'package:masterok/features/specialists/presentation/pages/specialists_page.dart';
import 'package:masterok/features/specialists/presentation/pages/specialist_detail_page.dart';
import 'package:masterok/features/orders/presentation/pages/orders_page.dart';
import 'package:masterok/features/orders/presentation/pages/orders_list_page.dart';
import 'package:masterok/features/orders/presentation/pages/create_order_page.dart';
import 'package:masterok/features/orders/presentation/pages/order_tracking_page.dart';
import 'package:masterok/features/orders/presentation/pages/order_responses_page.dart';
import 'package:masterok/features/orders/presentation/pages/order_detail_page.dart';
import 'package:masterok/features/orders/presentation/pages/payment_page.dart';
import 'package:masterok/features/profile/presentation/pages/profile_page.dart';
import 'package:masterok/features/shell/presentation/pages/shell_page.dart';
import 'package:masterok/features/notifications/presentation/pages/notifications_page.dart';
import 'package:masterok/features/promo/presentation/pages/promo_page.dart';
import 'package:masterok/features/referral/presentation/pages/referral_page.dart';
import 'package:masterok/features/settings/presentation/pages/settings_page.dart';
import 'package:masterok/features/favorites/presentation/pages/favorites_page.dart';
import 'package:masterok/features/support/presentation/pages/support_page.dart';
import 'package:masterok/features/support/presentation/pages/support_chat_page.dart';
import 'package:masterok/features/support/presentation/pages/support_faq_page.dart';
import 'package:masterok/features/support/presentation/pages/create_ticket_page.dart';
import 'package:masterok/features/chat/presentation/pages/chat_page.dart';
import 'package:masterok/features/categories/presentation/pages/categories_page.dart';
import 'package:masterok/features/search/presentation/pages/search_page.dart';
import 'package:masterok/features/payments/presentation/pages/payment_methods_page.dart';
import 'package:masterok/features/subscription/presentation/pages/pro_page.dart';
import 'package:masterok/features/chat/presentation/pages/conversations_page.dart';
import 'package:masterok/features/orders/presentation/pages/specialist_orders_page.dart';

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
              child: HomePageImproved(),
            ),
          ),
          GoRoute(
            path: '/specialists',
            name: 'specialists',
            pageBuilder: (context, state) => NoTransitionPage(
              child: SpecialistsPage(
                initialCategory: state.uri.queryParameters['category'],
                initialSearch: state.uri.queryParameters['search'],
                focusSearch: state.uri.queryParameters['focus'] == '1',
              ),
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
        path: '/forgot-password',
        name: 'forgot-password',
        builder: (context, state) => const ForgotPasswordPage(),
      ),
      GoRoute(
        path: '/phone-login',
        name: 'phone-login',
        builder: (context, state) => const PhoneLoginPage(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => RegisterPage(
          initialRole: state.uri.queryParameters['role'],
        ),
      ),
      // Utility pages (outside bottom nav)
      GoRoute(
        path: '/notifications',
        name: 'notifications',
        builder: (context, state) => const NotificationsPage(),
      ),
      GoRoute(
        path: '/promo',
        name: 'promo',
        builder: (context, state) => const PromoPage(),
      ),
      GoRoute(
        path: '/referral',
        name: 'referral',
        builder: (context, state) => const ReferralPage(),
      ),
      GoRoute(
        path: '/categories',
        name: 'categories',
        builder: (context, state) => const CategoriesPage(),
      ),
      GoRoute(
        path: '/search',
        name: 'search',
        builder: (context, state) => SearchPage(
          initialSearch: state.uri.queryParameters['q'],
        ),
      ),
      GoRoute(
        path: '/settings',
        name: 'settings',
        builder: (context, state) => const SettingsPage(),
      ),
      GoRoute(
        path: '/favorites',
        name: 'favorites',
        builder: (context, state) => const FavoritesPage(),
      ),
      GoRoute(
        path: '/payment-methods',
        name: 'payment-methods',
        builder: (context, state) => const PaymentMethodsPage(),
      ),
      GoRoute(
        path: '/pro',
        name: 'pro',
        builder: (context, state) => const ProPage(),
      ),
      GoRoute(
        path: '/conversations',
        name: 'conversations',
        builder: (context, state) => const ConversationsPage(),
      ),
      GoRoute(
        path: '/specialist-orders',
        name: 'specialist-orders',
        builder: (context, state) => const SpecialistOrdersPage(),
      ),
      GoRoute(
        path: '/support',
        name: 'support',
        builder: (context, state) => const SupportPage(),
      ),
      GoRoute(
        path: '/support/chat',
        name: 'support-chat',
        builder: (context, state) => const SupportChatPage(),
      ),
      GoRoute(
        path: '/support/faq',
        name: 'support-faq',
        builder: (context, state) => const SupportFaqPage(),
      ),
      GoRoute(
        path: '/support/ticket',
        name: 'support-ticket',
        builder: (context, state) => const CreateTicketPage(),
      ),
      // Detail routes
      GoRoute(
        path: '/specialist/:id',
        name: 'specialist-detail',
        builder: (context, state) => SpecialistDetailPage(
          id: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/chat/:specialistId',
        name: 'chat',
        builder: (context, state) => ChatPage(
          specialistId: int.parse(state.pathParameters['specialistId']!),
          specialistName: state.uri.queryParameters['name'] ?? 'Чат',
        ),
      ),
      // Order routes
      GoRoute(
        path: '/orders/list',
        name: 'orders-list',
        builder: (context, state) => const OrdersListPage(),
      ),
      GoRoute(
        path: '/orders/create',
        name: 'create-order',
        builder: (context, state) => const CreateOrderPage(),
      ),
      GoRoute(
        path: '/orders/:id/track',
        name: 'order-tracking',
        builder: (context, state) => OrderTrackingPage(
          orderId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/orders/:id',
        name: 'order-detail',
        builder: (context, state) => OrderDetailPage(
          orderId: int.parse(state.pathParameters['id']!),
        ),
      ),
      GoRoute(
        path: '/orders/:id/responses',
        name: 'order-responses',
        builder: (context, state) => OrderResponsesPage(
          orderId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/orders/:id/payment',
        name: 'order-payment',
        builder: (context, state) => PaymentPage(
          orderId: int.parse(state.pathParameters['id']!),
        ),
      ),
    ],
  );
});




