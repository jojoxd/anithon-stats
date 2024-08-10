import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:logging/logging.dart';

mixin NoopRoute on GoRouteData {
  final Logger _logger = Logger('NoopRoute');

  @override
  Widget build(BuildContext context, GoRouterState state) {
    _logger
        .warning('Got into Noop Page for $runtimeType, This should not happen');

    return Scaffold(
      body: Text('Noop Page for $runtimeType'),
    );
  }
}
