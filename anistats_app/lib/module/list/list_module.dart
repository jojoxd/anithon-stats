import 'package:go_router/go_router.dart';

import '../../shared/module.dart';
import '../../shared/widget/layout_helper_widget.dart';
import 'page/desktop/list_overview_page.dart';
import 'page/list_edit_page.dart';
import 'page/list_overview_page.dart';
import 'page/list_settings_page.dart';

class ListModule extends Module {
  @override
  List<RouteBase> get routes => [
        GoRoute(
          path: '/lists',
          pageBuilder: (context, state) => NoTransitionPage(
            child: LayoutHelperWidget(
              desktopLayout: (context) => DesktopListOverviewPage(),
              defaultLayout: (context) => ListOverviewPage(),
            ),
          ),
          routes: [
            GoRoute(
              path: ':listId',
              redirect: (context, state) {
                return '/lists/${state.pathParameters['listId']}/edit';
              },
            ),
            GoRoute(
              path: ':listId/edit',
              builder: (context, state) => LayoutHelperWidget(
                defaultLayout: (context) => ListEditPage(
                  listId: state.pathParameters['listId']!,
                ),
              ),
            ),
            GoRoute(
              path: ':listId/settings',
              builder: (context, state) => LayoutHelperWidget(
                defaultLayout: (context) => const ListSettingsPage(),
              ),
            ),
          ],
        ),
      ];
}
