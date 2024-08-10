import 'package:anistats_app/config/app_config.dart';
import 'package:anistats_app/config/build_type.dart';
import 'package:anistats_app/config/environment.dart';
import 'package:anistats_app/run.dart';

void main() {
  Environment.init(
    buildType: BuildType.debug,
    config: const AppConfig(
      url: '',
    ),
  );

  run();
}
