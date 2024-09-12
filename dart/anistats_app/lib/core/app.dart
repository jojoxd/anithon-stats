import 'package:anistats_app/core/bloc/app_settings_cubit.dart';
import 'package:anistats_app/core/l10n.dart';
import 'package:anistats_app/core/settings/app_settings.dart';
import 'package:anistats_app/core/settings/app_theme.dart';
import 'package:anistats_app/core/transport/widgets/client_channel_provider.dart';
import 'package:anistats_app/feature/auth/bloc/authentication_bloc.dart';
import 'package:anistats_app/feature/onboard/bloc/onboard_cubit.dart';
import 'package:authentication_repository/authentication_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:user_repository/user_repository.dart';

import 'router.dart';

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<StatefulWidget> createState() => AppState();
}

class AppState extends State<App> {
  late final AuthenticationRepository _authenticationRepository;
  late final UserRepository _userRepository;

  @override
  void initState() {
    super.initState();

    _authenticationRepository = AuthenticationRepository();
    _userRepository = UserRepository();
  }

  @override
  void dispose() {
    _authenticationRepository.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider.value(
            value: _authenticationRepository,
        ),
      ],
      child: MultiBlocProvider(
        providers: [
          BlocProvider(
            lazy: false,
            create: (_) => AuthenticationBloc(
              authenticationRepository: _authenticationRepository,
              userRepository: _userRepository,
            )..add(AuthenticationSubscriptionRequested()),
          ),
          BlocProvider(
            lazy: false,
            create: (_) => AppSettingsCubit()
          ),
          BlocProvider(
            lazy: false,
            create: (_) => OnboardCubit(),
          )
        ],
        child: ClientChannelProvider(
          child: const _AppView(),
        ),
      ),
    );
  }
}

class _AppView extends StatelessWidget {
  const _AppView();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AppSettingsCubit, AppSettings>(builder: (context, appSettings) {
      return MaterialApp.router(
        routerConfig: router,
        localizationsDelegates: L10n.localizationsDelegates,
        supportedLocales: L10n.supportedLocales,
        onGenerateTitle: (context) => context.l10n.appTitle,
        theme: appSettings.theme.themeData,
        locale: appSettings.locale,
        darkTheme: null,
      );
    });
  }
}
