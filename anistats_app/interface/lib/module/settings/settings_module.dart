import 'package:go_router/go_router.dart';

import '../../shared/module.dart';
import '../../shared/test_screen.dart';

class SettingsModule extends Module {
  @override
  List<RouteBase> get routes => [
        GoRoute(
          path: '/settings',
          pageBuilder: (context, state) => const NoTransitionPage(
            child: TestScreen(
              label: 'Settings',
              buttonRoute: '/settings/sub',
            ),
          ),
          routes: [
            GoRoute(
              path: 'sub',
              builder: (context, state) => const TestScreen(
                label: 'Settings Sub Page',
                buttonRoute: '/auth/login',
              ),
            ),
          ],
        ),
      ];
}
