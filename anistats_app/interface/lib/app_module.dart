import 'package:anistats_app/module/media/media_module.dart';
import 'package:data_access/data_access.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';

import 'module/auth/auth_module.dart';
import 'module/list/list_module.dart';
import 'module/settings/settings_module.dart';
import 'shared/keys.dart';
import 'shared/module.dart';
import 'shared/layout/main_layout.dart';

class AppModule extends Module {
  final AuthModule _authModule = AuthModule();
  final ListModule _listModule = ListModule();
  final MediaModule _mediaModule = MediaModule();
  final SettingsModule _settingsModule = SettingsModule();

  @override
  List<RouteBase> get routes => [
        StatefulShellRoute.indexedStack(
          builder: (context, state, navigationShell) {
            return MainLayout(
              navigationShell: navigationShell,
            );
          },
          branches: [
            StatefulShellBranch(
              navigatorKey: kListModuleNavigatorKey,
              routes: _listModule.routes,
            ),
            StatefulShellBranch(
              navigatorKey: kSettingsModuleNavigatorKey,
              routes: _settingsModule.routes,
            )
          ],
        ),
        GoRoute(
          path: '/auth',
          redirect: (_, __) => "/auth/login",
          routes: _authModule.routes,
        ),
        ..._mediaModule.routes,
      ];

  @override
  void register(GetIt locator) {
    print("register app module");

    // @TODO: Allow selection of type, currently locked to mocked data
    DataAccessServiceLocator.mock(locator);

    _authModule.register(locator);
    _listModule.register(locator);
    _mediaModule.register(locator);
    _settingsModule.register(locator);
  }
}
