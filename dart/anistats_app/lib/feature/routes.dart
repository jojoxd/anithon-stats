import 'dart:async';

import 'package:anistats_app/core/routing/guard.dart';
import 'package:anistats_app/core/routing/noop_route.dart';
import 'package:anistats_app/core/widgets/shell_scaffold.dart';
import 'package:anistats_app/feature/onboard/guard/is_onboarded_guard.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'account/routes.dart';
import 'activity/routes.dart';
import 'auth/routes.dart';
import 'home/routes.dart';
import 'list/routes.dart';
import 'media/routes.dart';
import 'onboard/routes.dart';
import 'settings/routes.dart';
import 'user/routes.dart';

export 'account/routes.dart';
export 'activity/routes.dart';
export 'auth/routes.dart';
export 'error/routes.dart';
export 'home/routes.dart';
export 'list/routes.dart';
export 'media/routes.dart';
export 'onboard/routes.dart';
export 'settings/routes.dart';
export 'user/routes.dart';

part 'routes.g.dart';

final GlobalKey<NavigatorState> rootNavigatorKey = GlobalKey<NavigatorState>();

final GlobalKey<NavigatorState> shellNavigatorKey = GlobalKey<NavigatorState>();

@TypedGoRoute<CoreModule>(
  path: '/',
  routes: [
    authModule,
    onboardModule,
    shellModule,
  ],
)
class CoreModule extends GoRouteData with Guarding, NoopRoute {
  @override
  List<RoutingGuard> get guards => [
        IsOnboardedGuard(
          next: OnboardRoute().location,
          strictLocationMatch: true,
        ),
      ];
}

const shellModule = TypedStatefulShellRoute<ShellModule>(
  branches: [
    TypedStatefulShellBranch<ListModuleBranch>(
      routes: [
        listModule,
      ],
    ),
    TypedStatefulShellBranch<ActivityModuleBranch>(
      routes: [
        activityModule,
      ],
    ),
    TypedStatefulShellBranch<HomeModuleBranch>(
      routes: [
        homeModule,
      ],
    ),
    TypedStatefulShellBranch<AccountModuleBranch>(
      routes: [
        accountModule,
      ],
    ),
    TypedStatefulShellBranch<MediaModuleBranch>(
      routes: [
        mediaModule,
      ],
    ),
    TypedStatefulShellBranch<UserModuleBranch>(
      routes: [
        usersModule,
      ],
    ),
    TypedStatefulShellBranch<SettingsModuleBranch>(
      routes: [
        settingsModule,
      ],
    ),
  ],
);

class ShellModule extends StatefulShellRouteData {
  const ShellModule();

  static final GlobalKey<NavigatorState> $navigatorKey = shellNavigatorKey;

  @override
  FutureOr<String?> redirect(BuildContext context, GoRouterState state) {
    return IsOnboardedGuard()(context, state);
  }

  @override
  Page<void> pageBuilder(
    BuildContext context,
    GoRouterState state,
    StatefulNavigationShell navigationShell,
  ) {
    return MaterialPage(
      key: state.pageKey,
      child: ShellScaffold(
        body: navigationShell,
      ),
    );
  }
}

class AccountModuleBranch extends StatefulShellBranchData {}

class ActivityModuleBranch extends StatefulShellBranchData {}

class HomeModuleBranch extends StatefulShellBranchData {}

class ListModuleBranch extends StatefulShellBranchData {}

class MediaModuleBranch extends StatefulShellBranchData {}

class UserModuleBranch extends StatefulShellBranchData {}

class SettingsModuleBranch extends StatefulShellBranchData {}