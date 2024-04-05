import 'dart:io';

import 'package:get_it/get_it.dart';

import 'repository/list_repository.dart';
import 'repository/media_repository.dart';

class DataAccessServiceLocator {
  static void mock(GetIt locator) {
    print("register data_access/mock");

    locator.registerSingletonAsync<ListRepository>(
      () async => ListRepository.mock(),
    );
    locator.registerSingletonAsync<MediaRepository>(
      () async => MediaRepository.mock(),
    );
  }

  static void native(GetIt locator) {
    print("register data_access/native");

    locator.registerSingleton<ListRepository>(ListRepository.native());
    locator.registerSingleton<MediaRepository>(MediaRepository.native());
  }

  static void network(GetIt locator, HttpClient client) {
    print("register data_access/network");

    locator.registerSingleton<HttpClient>(client, instanceName: 'data_access');

    locator.registerSingletonWithDependencies<ListRepository>(() {
      var client = locator.get<HttpClient>(instanceName: 'data_access');

      return ListRepository.network(client);
    });

    locator.registerSingletonWithDependencies<MediaRepository>(() {
      var client = locator.get<HttpClient>(instanceName: 'data_access');

      return MediaRepository.network(client);
    });
  }
}
