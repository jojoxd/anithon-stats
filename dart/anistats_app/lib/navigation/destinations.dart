import 'package:anistats_app/core/cubit/theme_cubit.dart';
import 'package:anistats_app/core/l10n.dart';
import 'package:anistats_app/core/theme/app_theme.dart';
import 'package:anistats_app/feature/auth/bloc/authentication_bloc.dart';
import 'package:authentication_repository/authentication_repository.dart';
import 'package:flutter/material.dart';
import 'package:logging/logging.dart';
import 'package:provider/provider.dart';

import '../feature/routes.dart';
import 'model/app_navigation_destination.dart';

final List<AppNavigationDestination> appNavigationDestinations = [
  _homeDestination,
  _listsDestination,
  _activitiesDestination,
  _mediaDestination,
  _usersDestination,
  _loginDestination,
  _settingsDestination,
];

final _homeDestination = AppNavigationDestination(
  label: (context) => context.l10n.homeTitle,
  pathPrefix: '/home',
  exact: true,
  icon: (_) {
    return const Icon(Icons.home);
  },
  go: (context) {
    HomeRoute().go(context);
  },
);

final _listsDestination = AppNavigationDestination(
  label: (context) => context.l10n.listsTitle,
  pathPrefix: '/lists',
  icon: (_) {
    return const Icon(Icons.list_alt);
  },
  enabled: (context) {
    var bloc = Provider.of<AuthenticationBloc>(context);
    return bloc.state.status == AuthenticationStatus.authenticated;
  },
  go: (context) {
    ListOverviewRoute().go(context);
  },
);

final _activitiesDestination = AppNavigationDestination(
  label: (context) => context.l10n.activitiesTitle,
  pathPrefix: '/activity',
  icon: (_) {
    return const Icon(Icons.sports_football);
  },
  go: (context) {
    ActivityOverviewRoute().go(context);
  },
);

final _mediaDestination = AppNavigationDestination(
  label: (context) => context.l10n.mediaTitle,
  pathPrefix: '/media',
  icon: (_) {
    return const Icon(Icons.abc);
  },
  go: (context) {
    return SearchMediaRoute().go(context);
  },
);

final _usersDestination = AppNavigationDestination(
  label: (context) => context.l10n.usersTitle,
  pathPrefix: '/users',
  icon: (_) {
    return const Icon(Icons.account_circle);
  },
  go: (context) {
    SearchUsersRoute().go(context);
  },
);

// TODO Remove, just use trailing directly
final _loginDestination = AppNavigationDestination(
  label: (context) => context.l10n.login,
  pathPrefix: '/auth',
  section: AppNavigationSection.config,
  icon: (_) {
    return const Icon(Icons.login);
  },
  enabled: (context) {
    var bloc = Provider.of<AuthenticationBloc>(context);
    return bloc.state.status != AuthenticationStatus.authenticated;
  },
  go: (context) {
    AuthLoginRoute().push(context);
  },
);

// TODO Remove, just use trailing
final _settingsDestination = AppNavigationDestination(
  label: (context) => context.l10n.settingsTitle,
  pathPrefix: '/settings',
  section: AppNavigationSection.config,
  icon: (_) {
    return const Icon(Icons.settings);
  },
  enabled: (context) {
    var bloc = Provider.of<AuthenticationBloc>(context);
    return bloc.state.status == AuthenticationStatus.authenticated;
  },
  go: (context) {
    // TODO Add Settings
    Logger('TODO').info('TODO: Add Settings');

    var cubit = Provider.of<ThemeCubit>(context, listen: false);
    cubit.setTheme(AppTheme.dark);
  },
);
