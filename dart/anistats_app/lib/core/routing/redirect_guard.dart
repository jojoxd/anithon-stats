import 'dart:async';

import 'package:anistats_app/core/routing/guard.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class RedirectGuard extends RoutingGuard {
  const RedirectGuard({required this.next, super.strictLocationMatch});

  final String next;

  @override
  FutureOr<String?> call(BuildContext context, GoRouterState state) {
    return next;
  }
}
