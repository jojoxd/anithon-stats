import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'pages.dart';

const settingsModule = TypedGoRoute<SettingsRoute>(
    path: 'settings',
    routes: [
      TypedGoRoute<TransportSettingsRoute>(path: 'transport'),
    ],
);

class SettingsRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const SettingsPage();
}

class TransportSettingsRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const TransportSettingsPage();
}