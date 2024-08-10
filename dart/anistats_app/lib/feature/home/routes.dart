import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'pages.dart';

const homeModule = TypedGoRoute<HomeRoute>(
  path: 'home',
  routes: [],
);

class HomeRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) => const HomePage();
}
