import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:masterok/core/models/specialist.dart';
import 'package:masterok/core/models/review.dart';
import 'package:masterok/core/models/user.dart';
import 'package:masterok/core/services/specialists_service.dart';
import 'package:masterok/core/services/local_user_db.dart';
import 'package:masterok/core/data/mock_data.dart';

const _kLocalSpecialistIdOffset = 100000;

int _localSpecialistId(int userId) => _kLocalSpecialistIdOffset + userId;

Specialist _userToSpecialist(User u) {
  final names = (u.fullName.isEmpty ? 'Новый специалист' : u.fullName).split(' ');
  final firstName = names.isNotEmpty ? names.first : 'Новый';
  final lastName = names.length > 1 ? names.sublist(1).join(' ') : '';
  return Specialist(
    id: _localSpecialistId(u.id),
    firstName: firstName,
    lastName: lastName,
    avatar: u.avatar,
    title: 'Специалист',
    rating: 5.0,
    reviewsCount: 0,
    completedOrders: 0,
    hourlyRate: 1200,
    bio: 'Профиль создан недавно. Напишите в чат, чтобы обсудить детали.',
    city: null,
    skills: const ['Ремонт квартир', 'Отделка'],
    languages: const ['Русский'],
    isVerified: false,
    isOnline: true,
    createdAt: u.createdAt,
  );
}

Future<List<Specialist>> _loadLocalSpecialists(Ref ref) async {
  final db = ref.read(localUserDbProvider);
  await db.ensureSeeded();
  final users = await db.listSpecialists();
  return users.map(_userToSpecialist).toList();
}

/// Локально зарегистрированные специалисты (для "новых пользователей", чтобы они сразу появлялись в выдаче).
final localSpecialistsProvider = FutureProvider.autoDispose<List<Specialist>>((ref) async {
  return _loadLocalSpecialists(ref);
});

// Specialists list (with fallback to mock data)
final specialistsListProvider = FutureProvider.autoDispose<List<Specialist>>((ref) async {
  try {
    final service = ref.read(specialistsServiceProvider);
    return await service.getSpecialists();
  } catch (e) {
    final local = await _loadLocalSpecialists(ref);
    return [...local, ...MockData.specialists];
  }
});

// Specialists list with filters (with fallback to mock data)
final filteredSpecialistsProvider = FutureProvider.autoDispose.family<List<Specialist>, SpecialistsFilter>(
  (ref, filter) async {
    try {
      final service = ref.read(specialistsServiceProvider);
      // Не держим UI в вечной загрузке: быстрый таймаут и fallback на mock.
      return await service
          .getSpecialists(
            category: filter.category,
            search: filter.search,
            minRating: filter.minRating,
          )
          .timeout(const Duration(seconds: 2));
    } catch (e) {
      final local = await _loadLocalSpecialists(ref);
      var specialists = [...local, ...MockData.specialists];
      
      if (filter.category != null) {
        final catLower = filter.category!.toLowerCase();
        specialists = specialists
            .where((s) => s.skills.any((skill) => skill.toLowerCase().contains(catLower)))
            .toList();
      }
      
      if (filter.search != null && filter.search!.isNotEmpty) {
        final searchLower = filter.search!.toLowerCase();
        specialists = specialists
            .where((s) =>
                s.firstName.toLowerCase().contains(searchLower) ||
                s.lastName.toLowerCase().contains(searchLower) ||
                (s.bio ?? '').toLowerCase().contains(searchLower) ||
                s.title.toLowerCase().contains(searchLower))
            .toList();
      }
      
      if (filter.minRating != null) {
        specialists = specialists
            .where((s) => s.rating >= filter.minRating!)
            .toList();
      }
      
      return specialists;
    }
  },
);

// Specialist detail (with fallback to mock data)
final specialistDetailProvider = FutureProvider.autoDispose.family<Specialist, int>((ref, id) async {
  try {
    final service = ref.read(specialistsServiceProvider);
    return await service.getSpecialistById(id);
  } catch (e) {
    if (id >= _kLocalSpecialistIdOffset) {
      final userId = id - _kLocalSpecialistIdOffset;
      final db = ref.read(localUserDbProvider);
      await db.ensureSeeded();
      final u = await db.getUserById(userId);
      if (u != null) return _userToSpecialist(u);
    }
    return MockData.specialists.firstWhere((s) => s.id == id);
  }
});

// Specialist reviews (with fallback to mock data)
final specialistReviewsProvider = FutureProvider.autoDispose.family<List<Review>, int>((ref, specialistId) async {
  try {
    final service = ref.read(specialistsServiceProvider);
    return await service.getSpecialistReviews(specialistId);
  } catch (e) {
    // Return empty list as reviews are not in mock data yet
    return [];
  }
});

// Featured specialists (top rated, with fallback to mock data)
final featuredSpecialistsProvider = FutureProvider.autoDispose<List<Specialist>>((ref) async {
  try {
    final service = ref.read(specialistsServiceProvider);
    return await service.getSpecialists(minRating: 4, limit: 10);
  } catch (e) {
    final local = await _loadLocalSpecialists(ref);
    final base = [...local, ...MockData.specialists];
    return base
        .where((s) => s.rating >= 4.7)
        .take(6)
        .toList();
  }
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





