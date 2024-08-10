import 'dart:async';

import 'package:anistats_app/core/routing/guard.dart';
import 'package:anistats_app/feature/auth/bloc/authentication_bloc.dart';
import 'package:anistats_app/feature/routes.dart';
import 'package:authentication_repository/authentication_repository.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

final class IsAuthenticatedGuard extends RoutingGuard {
  IsAuthenticatedGuard({String? next, super.strictLocationMatch}) {
    _next = next ?? AuthLoginRoute().location;
  }

  late final String _next;

  @override
  FutureOr<String?> call(BuildContext context, GoRouterState state) {
    var bloc = Provider.of<AuthenticationBloc>(context, listen: false);

    if (bloc.state.status != AuthenticationStatus.authenticated) {
      return _next;
    }

    return null;
  }
}
