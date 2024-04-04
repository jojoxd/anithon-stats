import 'package:anistats_app/module/media/page/desktop/media_details_page.dart';
import 'package:anistats_app/shared/module.dart';
import 'package:anistats_app/shared/widget/layout_helper_widget.dart';
import 'package:go_router/go_router.dart';

import 'page/desktop/media_search_page.dart';

class MediaModule extends Module {
  @override
  List<RouteBase> get routes => [
        GoRoute(
          path: '/media/search',
          pageBuilder: (context, state) => NoTransitionPage(
            child: LayoutHelperWidget(
              desktopLayout: (context) => DesktopMediaSearchPage(),
              defaultLayout: (context) => DesktopMediaSearchPage(), // @DEBUG
            ),
          ),
        ),
        GoRoute(
          path: '/media/:mediaId/details',
          pageBuilder: (context, state) => NoTransitionPage(
            child: LayoutHelperWidget(
              desktopLayout: (context) => DesktopMediaDetailsPage(
                mediaId: state.pathParameters['mediaId']!,
              ),
              defaultLayout: (context) => DesktopMediaDetailsPage(
                mediaId: state.pathParameters['mediaId']!,
              ),
            ),
          ),
        ),
      ];
}
