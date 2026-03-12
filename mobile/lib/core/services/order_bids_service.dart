import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:masterok/core/network/api_client.dart';
import 'package:masterok/core/models/order_bid.dart';

final orderBidsServiceProvider = Provider<OrderBidsService>((ref) {
  return OrderBidsService(ref.read(dioProvider));
});

class OrderBidsService {
  final Dio _dio;

  OrderBidsService(this._dio);

  Future<List<OrderBid>> getOrderBids(String orderId) async {
    try {
      final response = await _dio.get('/orders/$orderId/bids');
      final List<dynamic> data = response.data as List<dynamic>;
      return data.map((json) => OrderBid.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      // Return mock data on error for demo
      return _getMockBids(orderId);
    }
  }

  Future<OrderBid> createBid({
    required String orderId,
    required double price,
    String? timeline,
    String? message,
  }) async {
    final response = await _dio.post(
      '/orders/$orderId/bids',
      data: {
        'price': price,
        'timeline': timeline,
        'message': message,
      },
    );
    return OrderBid.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> acceptBid(String orderId, String bidId) async {
    await _dio.post('/orders/$orderId/bids/$bidId/accept');
  }

  Future<void> rejectBid(String orderId, String bidId) async {
    await _dio.post('/orders/$orderId/bids/$bidId/reject');
  }

  List<OrderBid> _getMockBids(String orderId) {
    return [
      OrderBid(
        id: '1',
        orderId: orderId,
        specialistId: 's1',
        specialistName: 'Алексей Петров',
        specialistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        specialistRating: 4.9,
        specialistReviewsCount: 127,
        price: 45000,
        timeline: '5-7 дней',
        message: 'Здравствуйте! Готов выполнить вашу работу качественно и в срок. Имею опыт более 10 лет.',
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      OrderBid(
        id: '2',
        orderId: orderId,
        specialistId: 's2',
        specialistName: 'Мария Соколова',
        specialistAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        specialistRating: 4.8,
        specialistReviewsCount: 89,
        price: 52000,
        timeline: '3-5 дней',
        message: 'Добрый день! Специализируюсь на подобных заказах. Могу начать на этой неделе.',
        createdAt: DateTime.now().subtract(const Duration(hours: 5)),
      ),
      OrderBid(
        id: '3',
        orderId: orderId,
        specialistId: 's3',
        specialistName: 'Дмитрий Иванов',
        specialistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        specialistRating: 4.7,
        specialistReviewsCount: 64,
        price: 38000,
        timeline: '7-10 дней',
        message: 'Привет! Предлагаю выгодную цену при сохранении высокого качества.',
        createdAt: DateTime.now().subtract(const Duration(hours: 8)),
      ),
    ];
  }
}
