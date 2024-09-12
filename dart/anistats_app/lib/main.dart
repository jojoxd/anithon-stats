import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:logging/logging.dart';
import 'package:path_provider/path_provider.dart';

import 'core/app.dart';

var _logger = Logger("main");

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  Logger.root.level = Level.ALL;
  Logger.root.onRecord.listen((record) {
    print(
      '[${record.level.name}/${record.loggerName}]: '
      '${record.time}: ${record.message}',
    );
  });

  await initializeHydratedBloc();

  runApp(const App());
}

Future<void> initializeHydratedBloc() async {
  var storageDirectory = kIsWeb
      ? HydratedStorage.webStorageDirectory
      : await getApplicationSupportDirectory();

  _logger.info('Storage path: $storageDirectory');

  HydratedBloc.storage = await HydratedStorage.build(
    storageDirectory: storageDirectory,
  );
}