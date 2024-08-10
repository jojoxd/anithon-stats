import 'package:anistats_app/feature/routes.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'pages.dart';

const onboardModule = TypedGoRoute<OnboardRoute>(
  path: 'onboard',
  routes: [
    TypedGoRoute<OnboardCreateAccountRoute>(path: 'step/create-account'),
    TypedGoRoute<OnboardImportListsRoute>(path: 'step/import-lists'),
  ],
);

class OnboardRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const OnboardPage();
}

class OnboardImportListsRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const OnboardImportListsPage();
}

// NOTE: Cross-feature usage
class OnboardCreateAccountRoute extends AccountCreateRoute {}
