import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AccountCreatePage extends StatelessWidget {
  const AccountCreatePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          const Text('Account Create Page'),
          TextButton(
            onPressed: () {
              context.pop('some-account-id');
            },
            child: const Text('Create Account'),
          ),
        ],
      ),
    );
  }
}
