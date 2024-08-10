import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'pages.dart';

const activityModule = TypedGoRoute<ActivityOverviewRoute>(
  path: 'activity',
  routes: [
    TypedGoRoute<ActivityRoute>(path: ':activityId'),
  ],
);

class ActivityOverviewRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const ActivityOverviewPage();
}

class ActivityRoute extends GoRouteData {
  const ActivityRoute({required this.activityId});

  final String activityId;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      ActivityPage(activityId: activityId);
}
