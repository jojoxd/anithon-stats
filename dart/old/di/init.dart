import 'dart:async';

import 'package:anistats_app/di/container.dart';
import 'package:anistats_app/di/init.config.dart';
import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

@injectableInit
Future<GetIt> initDI(GetIt getIt, String environment) async {
  registerDependencies();

  await container.isReady<SharedPreferences>();

  return getIt.init(environment: environment);
}

@module
void registerDependencies() {
  container.registerLazySingletonAsync<SharedPreferences>(() async {
    final sharedPreferences = await SharedPreferences.getInstance();

    return sharedPreferences;
  });
}
