import 'dart:async';

import 'package:anistats_app/core/routing/guard.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// TODO Refactor away to actual state
const kIsOnboarded = false;

final class IsOnboardedGuard extends RoutingGuard {
  const IsOnboardedGuard({required this.next, super.strictLocationMatch});

  final String next;

  @override
  FutureOr<String?> call(BuildContext context, GoRouterState state) {
    if (!kIsOnboarded) {
      return next;
    }

    return null;
  }
}
