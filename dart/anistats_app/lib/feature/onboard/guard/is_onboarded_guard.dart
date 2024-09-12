import 'dart:async';

import 'package:anistats_app/core/routing/guard.dart';
import 'package:anistats_app/feature/onboard/bloc/onboard_cubit.dart';
import 'package:anistats_app/feature/routes.dart' as routes;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../model/onboard_stage.dart';

final class IsOnboardedGuard extends RoutingGuard {
  IsOnboardedGuard({String? next, super.strictLocationMatch})
    : _next = next ?? routes.OnboardRoute().location;

  final String _next;

  @override
  FutureOr<String?> call(BuildContext context, GoRouterState state) {
    // TODO: Make this better
    return null;

    var cubit = Provider.of<OnboardCubit>(context, listen: false);

    if (cubit.state.stage != OnboardStage.done) {
      return _next;
    }

    return null;
  }
}
