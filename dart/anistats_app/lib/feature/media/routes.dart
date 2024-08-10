import 'package:anistats_app/core/routing/noop_route.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'pages.dart';

const mediaModule = TypedGoRoute<MediaModule>(
  path: 'media',
  routes: [
    TypedGoRoute<SearchMediaRoute>(path: 'search'),
    TypedGoRoute<ViewMediaRoute>(path: 'view/:mediaId'),
  ],
);

class MediaModule extends GoRouteData with NoopRoute {}

class SearchMediaRoute extends GoRouteData {
  @override
  Widget build(BuildContext context, GoRouterState state) =>
      const SearchMediaPage();
}

class ViewMediaRoute extends GoRouteData {
  const ViewMediaRoute({required this.mediaId});

  final String mediaId;

  @override
  Widget build(BuildContext context, GoRouterState state) =>
      ViewMediaPage(mediaId: mediaId);
}
