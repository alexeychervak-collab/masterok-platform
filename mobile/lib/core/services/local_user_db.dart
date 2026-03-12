import 'dart:convert';

import 'package:crypto/crypto.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';
import 'package:masterok/core/models/user.dart';

final localUserDbProvider = Provider<LocalUserDb>((ref) {
  return LocalUserDb();
});

class LocalUserDb {
  static const _dbName = 'masterok.db';
  static const _dbVersion = 1;

  Database? _db;

  Future<Database> _open() async {
    if (_db != null) return _db!;
    final dir = await getApplicationDocumentsDirectory();
    final path = p.join(dir.path, _dbName);
    _db = await openDatabase(
      path,
      version: _dbVersion,
      onCreate: (db, version) async {
        await db.execute('''
CREATE TABLE users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar TEXT,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL,
  pro_until TEXT
)
''');
      },
    );
    return _db!;
  }

  String _hashPassword(String password, {required String email}) {
    final normalizedEmail = email.trim().toLowerCase();
    final bytes = utf8.encode('$normalizedEmail::$password');
    return sha256.convert(bytes).toString();
  }

  Future<void> ensureSeeded() async {
    final db = await _open();
    final rows = await db.rawQuery('SELECT COUNT(*) as c FROM users');
    final count = (rows.first['c'] as int?) ?? 0;
    if (count > 0) return;

    // Тестовые пользователи: обычный и PRO
    await createUser(
      email: 'user@test.ru',
      password: 'test123',
      role: 'client',
      firstName: 'Тест',
      lastName: 'Пользователь',
      proUntil: null,
    );

    await createUser(
      email: 'pro@test.ru',
      password: 'test123',
      role: 'client',
      firstName: 'PRO',
      lastName: 'Пользователь',
      proUntil: DateTime.now().add(const Duration(days: 365)),
    );
  }

  Future<User> createUser({
    required String email,
    required String password,
    required String role,
    String? phone,
    String? firstName,
    String? lastName,
    String? avatar,
    DateTime? proUntil,
  }) async {
    final db = await _open();
    final now = DateTime.now();
    final id = await db.insert(
      'users',
      {
        'email': email.trim().toLowerCase(),
        'password_hash': _hashPassword(password, email: email),
        'phone': phone,
        'first_name': firstName,
        'last_name': lastName,
        'avatar': avatar,
        'role': role,
        'created_at': now.toIso8601String(),
        'pro_until': proUntil?.toIso8601String(),
      },
      conflictAlgorithm: ConflictAlgorithm.fail,
    );

    return User(
      id: id,
      email: email.trim().toLowerCase(),
      phone: phone,
      firstName: firstName,
      lastName: lastName,
      avatar: avatar,
      role: role,
      createdAt: now,
    );
  }

  Future<User?> login({
    required String email,
    required String password,
  }) async {
    final db = await _open();
    final normalized = email.trim().toLowerCase();
    final rows = await db.query('users', where: 'email = ?', whereArgs: [normalized], limit: 1);
    if (rows.isEmpty) return null;
    final row = rows.first;
    final hash = row['password_hash'] as String;
    if (hash != _hashPassword(password, email: normalized)) return null;
    return _userFromRow(row);
  }

  Future<User?> getUserById(int id) async {
    final db = await _open();
    final rows = await db.query('users', where: 'id = ?', whereArgs: [id], limit: 1);
    if (rows.isEmpty) return null;
    return _userFromRow(rows.first);
  }

  Future<User?> getUserByEmail(String email) async {
    final db = await _open();
    final normalized = email.trim().toLowerCase();
    final rows = await db.query('users', where: 'email = ?', whereArgs: [normalized], limit: 1);
    if (rows.isEmpty) return null;
    return _userFromRow(rows.first);
  }

  Future<DateTime?> getProUntil(int userId) async {
    final db = await _open();
    final rows = await db.query('users', columns: ['pro_until'], where: 'id = ?', whereArgs: [userId], limit: 1);
    if (rows.isEmpty) return null;
    final raw = rows.first['pro_until'] as String?;
    if (raw == null || raw.isEmpty) return null;
    return DateTime.tryParse(raw);
  }

  Future<void> setProUntil(int userId, DateTime? until) async {
    final db = await _open();
    await db.update(
      'users',
      {'pro_until': until?.toIso8601String()},
      where: 'id = ?',
      whereArgs: [userId],
    );
  }

  Future<void> deleteUser(int userId) async {
    final db = await _open();
    await db.delete('users', where: 'id = ?', whereArgs: [userId]);
  }

  Future<List<User>> listUsersByRole(String role) async {
    final db = await _open();
    final rows = await db.query(
      'users',
      where: 'role = ?',
      whereArgs: [role],
      orderBy: 'created_at DESC',
    );
    return rows.map(_userFromRow).toList();
  }

  Future<List<User>> listSpecialists() async {
    return listUsersByRole('specialist');
  }

  User _userFromRow(Map<String, Object?> row) {
    return User(
      id: row['id'] as int,
      email: row['email'] as String,
      phone: row['phone'] as String?,
      firstName: row['first_name'] as String?,
      lastName: row['last_name'] as String?,
      avatar: row['avatar'] as String?,
      role: row['role'] as String,
      createdAt: DateTime.parse(row['created_at'] as String),
    );
  }
}




