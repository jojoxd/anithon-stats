import 'package:anistats_app/core/routing/guard.dart';
import 'package:anistats_app/feature/auth/guard/is_authenticated_guard.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'pages.dart';

const accountModule = TypedGoRoute<AccountOverviewRoute>(
  path: 'account',
  routes: [
    TypedGoRoute<AccountCreateRoute>(path: 'create'),
    TypedGoRoute<AccountSettingsRoute>(path: 'settings'),
  ],
);

class AccountOverviewRoute extends GoRouteData with Guarding {
  @override
  List<RoutingGuard> get guards => [IsAuthenticatedGuard()];

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const AccountOverviewPage();
}

class AccountCreateRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const AccountCreatePage();
}

class AccountSettingsRoute extends GoRouteData with Guarding {
  @override
  List<RoutingGuard> get guards => [IsAuthenticatedGuard()];

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const AccountSettingsPage();
}
