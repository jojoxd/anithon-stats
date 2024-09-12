// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'routes.dart';

// **************************************************************************
// GoRouterGenerator
// **************************************************************************

List<RouteBase> get $appRoutes => [
      $coreModule,
    ];

RouteBase get $coreModule => GoRouteData.$route(
      path: '/',
      factory: $CoreModuleExtension._fromState,
      routes: [
        GoRouteData.$route(
          path: 'auth',
          factory: $AuthRouteExtension._fromState,
          routes: [
            GoRouteData.$route(
              path: 'login',
              factory: $AuthLoginRouteExtension._fromState,
            ),
          ],
        ),
        GoRouteData.$route(
          path: 'onboard',
          factory: $OnboardRouteExtension._fromState,
          routes: [
            GoRouteData.$route(
              path: 'step/settings',
              factory: $OnboardSettingsRouteExtension._fromState,
            ),
            GoRouteData.$route(
              path: 'step/create-account',
              factory: $OnboardCreateAccountRouteExtension._fromState,
            ),
            GoRouteData.$route(
              path: 'step/import-lists',
              factory: $OnboardImportListsRouteExtension._fromState,
            ),
          ],
        ),
        StatefulShellRouteData.$route(
          factory: $ShellModuleExtension._fromState,
          branches: [
            StatefulShellBranchData.$branch(
              routes: [
                GoRouteData.$route(
                  path: 'lists',
                  factory: $ListOverviewRouteExtension._fromState,
                  routes: [
                    GoRouteData.$route(
                      path: 'create',
                      factory: $ListCreateRouteExtension._fromState,
                    ),
                    GoRouteData.$route(
                      path: ':listId/edit',
                      factory: $ListEditRouteExtension._fromState,
                    ),
                    GoRouteData.$route(
                      path: ':listId/view',
                      factory: $ListViewRouteExtension._fromState,
                    ),
                  ],
                ),
              ],
            ),
            StatefulShellBranchData.$branch(
              routes: [
                GoRouteData.$route(
                  path: 'activity',
                  factory: $ActivityOverviewRouteExtension._fromState,
                  routes: [
                    GoRouteData.$route(
                      path: ':activityId',
                      factory: $ActivityRouteExtension._fromState,
                    ),
                  ],
                ),
              ],
            ),
            StatefulShellBranchData.$branch(
              routes: [
                GoRouteData.$route(
                  path: 'home',
                  factory: $HomeRouteExtension._fromState,
                ),
              ],
            ),
            StatefulShellBranchData.$branch(
              routes: [
                GoRouteData.$route(
                  path: 'account',
                  factory: $AccountOverviewRouteExtension._fromState,
                  routes: [
                    GoRouteData.$route(
                      path: 'create',
                      factory: $AccountCreateRouteExtension._fromState,
                    ),
                    GoRouteData.$route(
                      path: 'settings',
                      factory: $AccountSettingsRouteExtension._fromState,
                    ),
                  ],
                ),
              ],
            ),
            StatefulShellBranchData.$branch(
              routes: [
                GoRouteData.$route(
                  path: 'media',
                  factory: $MediaModuleExtension._fromState,
                  routes: [
                    GoRouteData.$route(
                      path: 'search',
                      factory: $SearchMediaRouteExtension._fromState,
                    ),
                    GoRouteData.$route(
                      path: 'view/:mediaId',
                      factory: $ViewMediaRouteExtension._fromState,
                    ),
                  ],
                ),
              ],
            ),
            StatefulShellBranchData.$branch(
              routes: [
                GoRouteData.$route(
                  path: 'users',
                  factory: $UsersModuleExtension._fromState,
                  routes: [
                    GoRouteData.$route(
                      path: 'search',
                      factory: $SearchUsersRouteExtension._fromState,
                    ),
                    GoRouteData.$route(
                      path: ':userId/profile',
                      factory: $UserProfileRouteExtension._fromState,
                    ),
                  ],
                ),
              ],
            ),
            StatefulShellBranchData.$branch(
              routes: [
                GoRouteData.$route(
                  path: 'settings',
                  factory: $SettingsRouteExtension._fromState,
                  routes: [
                    GoRouteData.$route(
                      path: 'transport',
                      factory: $TransportSettingsRouteExtension._fromState,
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ],
    );

extension $CoreModuleExtension on CoreModule {
  static CoreModule _fromState(GoRouterState state) => CoreModule();

  String get location => GoRouteData.$location(
        '/',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $AuthRouteExtension on AuthRoute {
  static AuthRoute _fromState(GoRouterState state) => AuthRoute();

  String get location => GoRouteData.$location(
        '/auth',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $AuthLoginRouteExtension on AuthLoginRoute {
  static AuthLoginRoute _fromState(GoRouterState state) => AuthLoginRoute();

  String get location => GoRouteData.$location(
        '/auth/login',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $OnboardRouteExtension on OnboardRoute {
  static OnboardRoute _fromState(GoRouterState state) => OnboardRoute();

  String get location => GoRouteData.$location(
        '/onboard',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $OnboardSettingsRouteExtension on OnboardSettingsRoute {
  static OnboardSettingsRoute _fromState(GoRouterState state) =>
      OnboardSettingsRoute();

  String get location => GoRouteData.$location(
        '/onboard/step/settings',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $OnboardCreateAccountRouteExtension on OnboardCreateAccountRoute {
  static OnboardCreateAccountRoute _fromState(GoRouterState state) =>
      OnboardCreateAccountRoute();

  String get location => GoRouteData.$location(
        '/onboard/step/create-account',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $OnboardImportListsRouteExtension on OnboardImportListsRoute {
  static OnboardImportListsRoute _fromState(GoRouterState state) =>
      OnboardImportListsRoute();

  String get location => GoRouteData.$location(
        '/onboard/step/import-lists',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $ShellModuleExtension on ShellModule {
  static ShellModule _fromState(GoRouterState state) => const ShellModule();
}

extension $ListOverviewRouteExtension on ListOverviewRoute {
  static ListOverviewRoute _fromState(GoRouterState state) =>
      ListOverviewRoute();

  String get location => GoRouteData.$location(
        '/lists',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $ListCreateRouteExtension on ListCreateRoute {
  static ListCreateRoute _fromState(GoRouterState state) => ListCreateRoute();

  String get location => GoRouteData.$location(
        '/lists/create',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $ListEditRouteExtension on ListEditRoute {
  static ListEditRoute _fromState(GoRouterState state) => ListEditRoute(
        listId: state.pathParameters['listId']!,
      );

  String get location => GoRouteData.$location(
        '/lists/${Uri.encodeComponent(listId)}/edit',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $ListViewRouteExtension on ListViewRoute {
  static ListViewRoute _fromState(GoRouterState state) => ListViewRoute(
        listId: state.pathParameters['listId']!,
      );

  String get location => GoRouteData.$location(
        '/lists/${Uri.encodeComponent(listId)}/view',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $ActivityOverviewRouteExtension on ActivityOverviewRoute {
  static ActivityOverviewRoute _fromState(GoRouterState state) =>
      ActivityOverviewRoute();

  String get location => GoRouteData.$location(
        '/activity',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $ActivityRouteExtension on ActivityRoute {
  static ActivityRoute _fromState(GoRouterState state) => ActivityRoute(
        activityId: state.pathParameters['activityId']!,
      );

  String get location => GoRouteData.$location(
        '/activity/${Uri.encodeComponent(activityId)}',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $HomeRouteExtension on HomeRoute {
  static HomeRoute _fromState(GoRouterState state) => HomeRoute();

  String get location => GoRouteData.$location(
        '/home',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $AccountOverviewRouteExtension on AccountOverviewRoute {
  static AccountOverviewRoute _fromState(GoRouterState state) =>
      AccountOverviewRoute();

  String get location => GoRouteData.$location(
        '/account',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $AccountCreateRouteExtension on AccountCreateRoute {
  static AccountCreateRoute _fromState(GoRouterState state) =>
      AccountCreateRoute();

  String get location => GoRouteData.$location(
        '/account/create',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $AccountSettingsRouteExtension on AccountSettingsRoute {
  static AccountSettingsRoute _fromState(GoRouterState state) =>
      AccountSettingsRoute();

  String get location => GoRouteData.$location(
        '/account/settings',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $MediaModuleExtension on MediaModule {
  static MediaModule _fromState(GoRouterState state) => MediaModule();

  String get location => GoRouteData.$location(
        '/media',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $SearchMediaRouteExtension on SearchMediaRoute {
  static SearchMediaRoute _fromState(GoRouterState state) => SearchMediaRoute();

  String get location => GoRouteData.$location(
        '/media/search',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $ViewMediaRouteExtension on ViewMediaRoute {
  static ViewMediaRoute _fromState(GoRouterState state) => ViewMediaRoute(
        mediaId: state.pathParameters['mediaId']!,
      );

  String get location => GoRouteData.$location(
        '/media/view/${Uri.encodeComponent(mediaId)}',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $UsersModuleExtension on UsersModule {
  static UsersModule _fromState(GoRouterState state) => UsersModule();

  String get location => GoRouteData.$location(
        '/users',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $SearchUsersRouteExtension on SearchUsersRoute {
  static SearchUsersRoute _fromState(GoRouterState state) => SearchUsersRoute();

  String get location => GoRouteData.$location(
        '/users/search',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $UserProfileRouteExtension on UserProfileRoute {
  static UserProfileRoute _fromState(GoRouterState state) => UserProfileRoute(
        userId: state.pathParameters['userId']!,
      );

  String get location => GoRouteData.$location(
        '/users/${Uri.encodeComponent(userId)}/profile',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $SettingsRouteExtension on SettingsRoute {
  static SettingsRoute _fromState(GoRouterState state) => SettingsRoute();

  String get location => GoRouteData.$location(
        '/settings',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}

extension $TransportSettingsRouteExtension on TransportSettingsRoute {
  static TransportSettingsRoute _fromState(GoRouterState state) =>
      TransportSettingsRoute();

  String get location => GoRouteData.$location(
        '/settings/transport',
      );

  void go(BuildContext context) => context.go(location);

  Future<T?> push<T>(BuildContext context) => context.push<T>(location);

  void pushReplacement(BuildContext context) =>
      context.pushReplacement(location);

  void replace(BuildContext context) => context.replace(location);
}
