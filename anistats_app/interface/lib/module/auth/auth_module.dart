import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';

import '../../shared/module.dart';
import '../../shared/test_screen.dart';

class AuthModule extends Module {
  @override
  List<RouteBase> get routes => [
        GoRoute(
          path: 'login',
          builder: (context, state) => const Scaffold(
            body: TestScreen(
              label: 'Auth Login Page',
              buttonRoute: '/list',
            ),
          ),
        ),
      ];

  @override
  void register(GetIt locator) {}
}
