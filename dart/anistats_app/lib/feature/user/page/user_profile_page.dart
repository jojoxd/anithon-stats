import 'package:anistats_api/anistats_api.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:uuid/uuid.dart';

class UserProfilePage extends StatelessWidget {
  const UserProfilePage({super.key, required this.userId});

  final String userId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Text('User Profile Page for user "$userId"'),
    );
  }
}