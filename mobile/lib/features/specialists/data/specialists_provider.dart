import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yodo/core/models/specialist.dart';
import 'package:yodo/core/models/review.dart';
import 'package:yodo/core/services/specialists_service.dart';

// Specialists list
final specialistsListProvider = FutureProvider.autoDispose<List<Specialist>>((ref) async {
  final service = ref.read(specialistsServiceProvider);
  return service.getSpecialists();
});

// Specialists list with filters
final filteredSpecialistsProvider = FutureProvider.autoDispose.family<List<Specialist>, SpecialistsFilter>(
  (ref, filter) async {
    final service = ref.read(specialistsServiceProvider);
    return service.getSpecialists(
      category: filter.category,
      search: filter.search,
      minRating: filter.minRating,
    );
  },
);

// Specialist detail
final specialistDetailProvider = FutureProvider.autoDispose.family<Specialist, int>((ref, id) async {
  final service = ref.read(specialistsServiceProvider);
  return service.getSpecialistById(id);
});

// Specialist reviews
final specialistReviewsProvider = FutureProvider.autoDispose.family<List<Review>, int>((ref, specialistId) async {
  final service = ref.read(specialistsServiceProvider);
  return service.getSpecialistReviews(specialistId);
});

// Featured specialists (top rated)
final featuredSpecialistsProvider = FutureProvider.autoDispose<List<Specialist>>((ref) async {
  final service = ref.read(specialistsServiceProvider);
  return service.getSpecialists(minRating: 4, limit: 10);
});

class SpecialistsFilter {
  final String? category;
  final String? search;
  final int? minRating;

  const SpecialistsFilter({
    this.category,
    this.search,
    this.minRating,
  });
}

