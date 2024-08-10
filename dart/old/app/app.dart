import 'package:anistats_app/app/app_view.dart';
import 'package:anistats_app/authentication/bloc/authentication_bloc.dart';
import 'package:anistats_app/bloc/init/init_bloc.dart';
import 'package:anistats_app/di/container.dart';
import 'package:anistats_app/di/init.dart';
import 'package:anistats_app/routes/routes.dart';
import 'package:authentication_repository/authentication_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:user_repository/user_repository.dart';

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<StatefulWidget> createState() => _AppState();
}

class _AppState extends State<App> {
  late final AuthenticationRepository _authenticationRepository;
  late final UserRepository _userRepository;

  @override
  void initState() {
    super.initState();

    _authenticationRepository = AuthenticationRepository();
    _userRepository = UserRepository();
  }

  @override
  Widget build(BuildContext context) {
    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider.value(
          value: _authenticationRepository,
        ),
        RepositoryProvider<NavigationService>(
          create: (context) => NavigationService(),
        ),
      ],
      child: MultiBlocProvider(
        providers: [
          BlocProvider<InitBloc>(
            create: (_) => InitBloc()
              ..add(
                StartAppEvent(),
              ),
          ),
          BlocProvider(
            lazy: false,
            create: (_) => AuthenticationBloc(
              authenticationRepository: _authenticationRepository,
              userRepository: _userRepository,
            )..add(AuthenticationSubscriptionRequested()),
          ),
        ],
        child: const AppView(),
      ),
    );
  }
}
