import 'package:flutter/foundation.dart';
import 'package:go_router/go_router.dart';

import '../../feature/routes.dart'
    show ErrorRoute, $appRoutes, rootNavigatorKey;

final GoRouter router = GoRouter(
  routes: $appRoutes,
  navigatorKey: rootNavigatorKey,
  errorBuilder: ErrorRoute.builder,
  debugLogDiagnostics: kDebugMode,
  // TODO Initial should be / using redirect so onboarding works correctly
  initialLocation: '/home',
);
