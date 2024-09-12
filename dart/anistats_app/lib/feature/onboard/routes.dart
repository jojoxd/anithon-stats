import 'dart:async';

import 'package:anistats_app/core/app.dart';
import 'package:anistats_app/feature/onboard/bloc/onboard_cubit.dart';
import 'package:anistats_app/feature/onboard/model/onboard_stage.dart';
import 'package:anistats_app/feature/routes.dart' as routes;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import 'pages.dart';

const onboardModule = TypedGoRoute<OnboardRoute>(
  path: 'onboard',
  routes: [
    TypedGoRoute<OnboardSettingsRoute>(path: 'step/settings'),
    TypedGoRoute<OnboardCreateAccountRoute>(path: 'step/create-account'),
    TypedGoRoute<OnboardImportListsRoute>(path: 'step/import-lists'),
  ],
);

class OnboardRoute extends GoRouteData {

  @override
  FutureOr<String?> redirect(BuildContext context, GoRouterState state) {
    var cubit = context.read<OnboardCubit>();

    switch(cubit.state.stage) {
      case OnboardStage.initial:
        return null; // Just use this page

      case OnboardStage.transport:
        return routes.OnboardSettingsRoute().location;

      case OnboardStage.login:
        return routes.OnboardLoginRoute().location;

      case OnboardStage.import:
        return routes.OnboardImportListsRoute().location;

      case OnboardStage.done:
        return routes.HomeRoute().location;
    }

    return null;
  }

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const OnboardPage();
}

class OnboardSettingsRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const OnboardSettingsPage();
}

class OnboardImportListsRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const OnboardImportListsPage();
}

// NOTE: Cross-feature usage
class OnboardLoginRoute extends routes.AuthLoginRoute {}

// NOTE: Cross-feature usage
class OnboardCreateAccountRoute extends routes.AccountCreateRoute {}
