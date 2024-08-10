import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'page/error_page.dart';

class ErrorRoute extends GoRouteData {
  ErrorRoute({required this.error});

  final Exception error;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      ErrorPage(error: error);

  static Widget Function(BuildContext, GoRouterState) get builder =>
      (context, state) => ErrorRoute(error: state.error!).build(context, state);
}
