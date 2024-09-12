import 'package:uuid/uuid.dart';

class Profile {
  const Profile({ required this.user });

  final User user;
}

class User {
  const User({
    required this.id,
    required this.name,
    required this.joinedAt,
  });

  final UuidValue id;
  final String name;
  final DateTime joinedAt;
}