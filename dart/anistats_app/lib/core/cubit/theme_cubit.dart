import 'package:anistats_app/core/theme/app_theme.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';

class ThemeCubit extends HydratedCubit<AppTheme> {
  static const _jsonValueKey = 'value';

  ThemeCubit() : super(AppTheme.light);

  void setTheme(AppTheme appTheme) {
    emit(appTheme);
  }

  @override
  AppTheme? fromJson(Map<String, dynamic> json) {
    return tryParseAppTheme(json[_jsonValueKey]!) ?? AppTheme.light;
  }

  @override
  Map<String, dynamic>? toJson(AppTheme state) {
    return {
      _jsonValueKey: state.toString(),
    };
  }
}
