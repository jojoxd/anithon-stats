import 'package:anistats_app/config/app_config.dart';
import 'package:anistats_app/config/build_type.dart';
import 'package:anistats_app/config/environment.dart';
import 'package:anistats_app/run.dart';

void main(List<String> args) {
  Environment.init(
    buildType: BuildType.release,
    config: const AppConfig(
      url: '',
    ),
  );

  run();
}
