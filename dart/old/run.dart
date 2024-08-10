import 'package:anistats_app/app/app.dart';
import 'package:anistats_app/di/container.dart';
import 'package:anistats_app/di/init.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

Future<void> run([
  List<DeviceOrientation> orientations = const [
    DeviceOrientation.portraitUp,
  ],
]) async {
  WidgetsFlutterBinding.ensureInitialized();

  await SystemChrome.setPreferredOrientations(orientations);

  await initDI(container, 'dev');

  _runApp();
}

void _runApp() {
  runApp(const App());
}
