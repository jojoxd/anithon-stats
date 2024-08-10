import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:logging/logging.dart';

abstract class RoutingGuard {
  const RoutingGuard({this.strictLocationMatch = false});

  final bool strictLocationMatch;

  FutureOr<String?> call(BuildContext context, GoRouterState state);
}

mixin Guarding on GoRouteData {
  final _log = Logger('Guarding');

  List<RoutingGuard> get guards;

  @override
  FutureOr<String?> redirect(BuildContext context, GoRouterState state) async {
    for (RoutingGuard guard in guards) {
      bool shouldRunGuard = !guard.strictLocationMatch ||
          (guard.strictLocationMatch &&
              state.uri.path == state.matchedLocation);

      _log.finer(
        'Guard $runtimeType/${guard.runtimeType} '
        'fullPath=${state.uri.path}, '
        'matchedLocation=${state.matchedLocation}',
      );

      if (!shouldRunGuard) {
        _log.fine('Guard $runtimeType/${guard.runtimeType} skipped');
        continue;
      }

      String? response = await guard(context, state);

      _log.fine('Guard $runtimeType/${guard.runtimeType} returned $response');

      if (response != null) {
        return response;
      }
    }

    return null;
  }
}
