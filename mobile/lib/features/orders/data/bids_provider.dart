import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:masterok/core/models/order_bid.dart';
import 'package:masterok/core/services/order_bids_service.dart';

final orderBidsProvider = FutureProvider.autoDispose.family<List<OrderBid>, String>((ref, orderId) async {
  final service = ref.watch(orderBidsServiceProvider);
  return service.getOrderBids(orderId);
});
