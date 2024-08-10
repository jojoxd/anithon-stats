import 'package:anistats_app/core/routing/guard.dart';
import 'package:anistats_app/feature/auth/guard/is_authenticated_guard.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'pages.dart';

const listModule = TypedGoRoute<ListOverviewRoute>(
  path: 'lists',
  routes: [
    TypedGoRoute<ListCreateRoute>(path: 'create'),
    TypedGoRoute<ListEditRoute>(path: ':listId/edit'),
    TypedGoRoute<ListViewRoute>(path: ':listId/view'),
  ],
);

class ListOverviewRoute extends GoRouteData with Guarding {
  @override
  List<RoutingGuard> get guards => [IsAuthenticatedGuard()];

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const ListOverviewPage();
}

class ListCreateRoute extends GoRouteData with Guarding {
  @override
  List<RoutingGuard> get guards => [IsAuthenticatedGuard()];

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const ListCreatePage();
}

class ListEditRoute extends GoRouteData with Guarding {
  ListEditRoute({required this.listId});

  final String listId;

  @override
  List<RoutingGuard> get guards => [IsAuthenticatedGuard()];

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      ListEditPage(listId: listId);
}

class ListViewRoute extends GoRouteData {
  const ListViewRoute({required this.listId});

  final String listId;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      ListViewPage(listId: listId);
}
