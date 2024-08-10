import 'package:anistats_app/bloc/init/init_bloc.dart';
import 'package:anistats_app/routes/lib/navigation_service.dart';
import 'package:anistats_app/routes/routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

const kDebugMode = true;

class AppView extends StatefulWidget {
  const AppView({super.key});

  @override
  State<StatefulWidget> createState() => _AppViewState()
}

class _AppViewState extends State<AppView> {
  @override
  Widget build(BuildContext context) {
    return Builder(
          builder: (context) {
            final navigator = NavigationService.of(context);

            return MaterialApp(
              debugShowCheckedModeBanner: kDebugMode,
              restorationScopeId: 'app',
              // localizationsDelegates: [
              //   S.delegate,
              //   GlobalMaterialLocalizations.delegate,
              //   GlobalWidgetsLocalizations.delegate,
              // ],
              // supportedLocales: const [
              //   Locale('en', '')
              // ],
              // onGenerateTitle: (BuildContext context) => S.of(context).appTitle,
              // theme: context.watch<ThemeCubit>().getDefaultTheme(),
              // darkTheme: context.watch<ThemeCubit>().darkTheme,
              // themeMode: context.watch<ThemeCubit>().themeMode,
              navigatorKey: appNavigatorKey,
              onGenerateRoute: navigator.onGenerateRoute,
              builder: (_, child) => BlocListener<InitBloc, InitState>(
                listener: (_, state) {
                  if (state is OpenApp) {
                    navigator.pushAndRemoveAll(Routes.app);
                  }
                },
                child: child,
              ),
            );
          },
        );
  }
}
