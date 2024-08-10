import 'package:anistats_app/core/routing/noop_route.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'pages.dart';

const usersModule = TypedGoRoute<UsersModule>(
  path: 'users',
  routes: [
    TypedGoRoute<SearchUsersRoute>(path: 'search'),
    TypedGoRoute<UserProfileRoute>(path: ':userId/profile'),
  ],
);

class UsersModule extends GoRouteData with NoopRoute {}

class SearchUsersRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const SearchUsersPage();
}

class UserProfileRoute extends GoRouteData {
  const UserProfileRoute({required this.userId});

  final String userId;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      UserProfilePage(userId: userId);
}
