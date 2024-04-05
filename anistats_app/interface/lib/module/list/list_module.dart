import 'package:anistats_app/module/list/service/list_service.dart';
import 'package:data_access/data_access.dart';
import 'package:get_it/get_it.dart';
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
              desktopLayout: (context) => DesktopListOverviewPage(
                listService: GetIt.instance.get<ListService>(),
              ),
              defaultLayout: (context) => ListOverviewPage(
                listService: GetIt.instance.get<ListService>(),
              ),
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

  @override
  void register(GetIt locator) {
    print("register list module");

    locator.registerSingletonWithDependencies<ListService>(
      () {
        return ListService(
          listRepository: locator.get<ListRepository>(),
        );
      },
      dependsOn: [
        ListRepository,
      ],
    );
  }
}
