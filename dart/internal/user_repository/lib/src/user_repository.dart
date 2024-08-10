import 'dart:async';

import 'package:user_repository/src/models/user.dart';
import 'package:uuid/uuid.dart';

class UserRepository {
  User? _currentUser;

  Future<User?> getCurrentUser() async {
    if (_currentUser != null) {
      return _currentUser;
    }

    return Future.delayed(
      const Duration(milliseconds: 300),
      () => _currentUser = User(const Uuid().v4()),
    );
  }
}
