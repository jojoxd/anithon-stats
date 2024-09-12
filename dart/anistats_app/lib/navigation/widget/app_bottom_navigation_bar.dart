import 'package:anistats_app/feature/auth/bloc/authentication_bloc.dart';
import 'package:authentication_repository/authentication_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:user_repository/user_repository.dart';

import '../model/app_navigation_destination.dart';

class AppBottomNavigationBar extends StatelessWidget {
  const AppBottomNavigationBar({
    super.key,
    required this.destinations,
    this.isAuthenticated = false,
  });

  final List<AppNavigationDestination> destinations;
  final bool isAuthenticated;

  @override
  Widget build(BuildContext context) {
    var routerState = GoRouterState.of(context);

    var enabledDestinations = destinations
        .where((dest) => dest.enabled?.call(context) ?? true)
        .toList();

    var currentIndex = enabledDestinations.indexWhere(
      (dest) => dest.matches(routerState.uri.path),
    );

    // TODO Something is broken here, icon color gets reset after out-of-shell routing
    return BottomNavigationBar(
      items: enabledDestinations.map((dest) => dest.toItem(context)).toList(),
      currentIndex: currentIndex == -1 ? 0 : currentIndex,
      onTap: (index) {
        enabledDestinations[index].go(context);
      },
    );
  }
}

extension _AppNavigationDestinationX on AppNavigationDestination {
  BottomNavigationBarItem toItem(BuildContext context) {
    var theme = Theme.of(context);

    return BottomNavigationBarItem(
      icon: icon(context),
      label: label(context),
      backgroundColor: theme.secondaryHeaderColor,
    );
  }
}
