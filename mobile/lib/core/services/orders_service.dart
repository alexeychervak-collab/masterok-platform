import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yodo/core/network/api_client.dart';
import 'package:yodo/core/models/order.dart';

final ordersServiceProvider = Provider<OrdersService>((ref) {
  return OrdersService(ref.read(dioProvider));
});

class OrdersService {
  final Dio _dio;

  OrdersService(this._dio);

  Future<List<Order>> getMyOrders({String? status, int skip = 0, int limit = 20}) async {
    try {
      final queryParams = <String, dynamic>{
        'skip': skip,
        'limit': limit,
      };
      
      if (status != null) queryParams['status'] = status;

      final response = await _dio.get('/orders/my', queryParameters: queryParams);
      
      final List<dynamic> data = response.data as List<dynamic>;
      return data.map((json) => Order.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Order> getOrderById(int id) async {
    try {
      final response = await _dio.get('/orders/$id');
      return Order.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Order> createOrder({
    required String title,
    required String description,
    required double price,
    required int categoryId,
    DateTime? deadline,
  }) async {
    try {
      final response = await _dio.post('/orders', data: {
        'title': title,
        'description': description,
        'price': price,
        'category_id': categoryId,
        'deadline': deadline?.toIso8601String(),
      });
      
      return Order.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Order> updateOrderStatus(int orderId, String status) async {
    try {
      final response = await _dio.patch('/orders/$orderId/status', data: {
        'status': status,
      });
      
      return Order.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> cancelOrder(int orderId) async {
    try {
      await _dio.delete('/orders/$orderId');
    } catch (e) {
      throw _handleError(e);
    }
  }

  String _handleError(dynamic error) {
    if (error is DioException) {
      if (error.response?.statusCode == 404) {
        return 'Заказ не найден';
      } else if (error.response?.statusCode == 403) {
        return 'У вас нет прав для выполнения этого действия';
      }
    }
    return 'Произошла ошибка при работе с заказами';
  }
}

