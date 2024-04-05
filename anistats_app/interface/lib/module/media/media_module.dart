import 'package:anistats_app/module/media/page/desktop/media_details_page.dart';
import 'package:anistats_app/module/media/service/media_service.dart';
import 'package:anistats_app/shared/module.dart';
import 'package:anistats_app/shared/widget/layout_helper_widget.dart';
import 'package:data_access/data_access.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';

import 'page/desktop/media_search_page.dart';

class MediaModule extends Module {
  @override
  List<RouteBase> get routes => [
        GoRoute(
          path: '/media/search',
          pageBuilder: (context, state) => NoTransitionPage(
            child: LayoutHelperWidget(
              desktopLayout: (context) => DesktopMediaSearchPage(
                mediaService: GetIt.instance.get<MediaService>(),
              ),
              defaultLayout: (context) => DesktopMediaSearchPage(
                mediaService: GetIt.instance.get<MediaService>(),
              ), // @DEBUG
            ),
          ),
        ),
        GoRoute(
          path: '/media/:mediaId/details',
          pageBuilder: (context, state) => NoTransitionPage(
            child: LayoutHelperWidget(
              desktopLayout: (context) => DesktopMediaDetailsPage(
                mediaId: state.pathParameters['mediaId']!,
                mediaService: GetIt.instance.get<MediaService>(),
              ),
              defaultLayout: (context) => DesktopMediaDetailsPage(
                mediaId: state.pathParameters['mediaId']!,
                mediaService: GetIt.instance.get<MediaService>(),
              ),
            ),
          ),
        ),
      ];

  @override
  void register(GetIt locator) {
    print("register media module");

    locator.registerSingletonWithDependencies<MediaService>(
      () {
        return MediaService(
          mediaRepository: locator.get<MediaRepository>(),
        );
      },
      dependsOn: [
        MediaRepository,
      ],
    );
  }
}
