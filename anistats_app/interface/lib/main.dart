import 'package:anistats_app/shared/page/error_page.dart';
import 'package:flutter/material.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';

import 'app_module.dart';
import 'shared/keys.dart';

final AppModule appModule = AppModule();

void main() {
  appModule.register(GetIt.instance);

  final router = GoRouter(
    initialLocation: '/lists',
    navigatorKey: kRootNavigatorKey,
    debugLogDiagnostics: true,
    routes: appModule.routes,
    errorBuilder: (context, state) => Scaffold(
      body: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ErrorPage(
            message: state.error?.message ?? "HALP (TODO: FIX THIS MESSAGE)",
          ),
        ],
      ),
    ),
  );

  runApp(MainApp(router: router));
}

class MainApp extends StatelessWidget {
  const MainApp({super.key, required this.router});

  final GoRouter router;

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,
      title: 'anistats_app',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        primarySwatch: Colors.deepPurple,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.deepPurple,
      ),
      themeMode: ThemeMode.dark,
    );
  }
}
