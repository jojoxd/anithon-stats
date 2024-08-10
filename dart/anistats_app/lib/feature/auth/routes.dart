import 'dart:async';

import 'package:anistats_app/core/routing/noop_route.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../routes.dart' as routes;
import 'pages.dart';

const authModule = TypedGoRoute<AuthRoute>(
  path: 'auth',
  routes: [
    TypedGoRoute<AuthLoginRoute>(path: 'login'),
  ],
);

class AuthRoute extends GoRouteData with NoopRoute {
  @override
  FutureOr<String?> redirect(BuildContext context, GoRouterState state) {
    return routes.AuthLoginRoute().location;
  }
}

class AuthLoginRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const AuthLoginPage();
}
