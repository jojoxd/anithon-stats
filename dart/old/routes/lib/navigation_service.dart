import 'package:anistats_app/features/view.dart';
import 'package:anistats_app/routes/routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

final GlobalKey<NavigatorState> appNavigatorKey = GlobalKey<NavigatorState>();

class NavigationService {
  final _appRoutes = {
    Routes.app: (_) => const MainScreen(),
  };

  // iOS: full screen routes pop up from the bottom and disappear vertically too
  // On iOS that's a standard full screen dialog
  // Has no effect on Android.
  final Set<String> _fullScreenRoutes = {};

  static NavigationService of(BuildContext context) =>
      RepositoryProvider.of<NavigationService>(context);

  Future<dynamic> navigateTo(
    String routeName, [
    Object? arguments,
    bool replace = false,
  ]) async {
    if (_appRoutes[routeName] != null) {
      if (replace) {
        return appNavigatorKey.currentState
            ?.pushReplacementNamed(routeName, arguments: arguments);
      }

      return appNavigatorKey.currentState
          ?.pushNamed(routeName, arguments: arguments);
    }
  }

  Route<dynamic> onGenerateRoute(RouteSettings settings) {
    if (_appRoutes[settings.name!] != null) {
      return MaterialPageRoute(
        settings: settings,
        builder: (_) => _appRoutes[settings.name]!(settings.arguments),
        fullscreenDialog: _fullScreenRoutes.contains(settings.name),
      );
    }

    return MaterialPageRoute(builder: (_) => const SplashScreen());
  }

  Future<dynamic> pushAndRemoveAll(
    String routeName, [
    Object? arguments,
  ]) async {
    return appNavigatorKey.currentState?.pushNamedAndRemoveUntil(
      routeName,
      (route) => false,
    );
  }
}
