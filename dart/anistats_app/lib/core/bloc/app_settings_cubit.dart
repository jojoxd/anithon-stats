import 'dart:ui';

import 'package:anistats_app/core/l10n.dart';
import 'package:anistats_app/core/settings/app_transport_settings.dart';
import 'package:anistats_app/core/settings/app_theme.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';
import 'package:logging/logging.dart';

import '../settings/app_settings.dart';

class AppSettingsCubit extends HydratedCubit<AppSettings> {
  AppSettingsCubit()
    : super(AppSettings.initial());

  final Logger _logger = Logger('AppSettingsCubit');

  @override
  AppSettings? fromJson(Map<String, dynamic> json) {
    return AppSettings.fromJson(json);
  }

  @override
  Map<String, dynamic>? toJson(AppSettings state) {
    return state.toJson();
  }

  void updateTransportSettings(AppTransportSettings transport) {
    _logger.fine("Updating transport settings", transport);
    emit(state.copyWith(transport: transport));
  }

  void updateTheme(AppTheme theme) {
    _logger.fine("Updating theme", theme);
    emit(state.copyWith(theme: theme));
  }

  void updateLocale(Locale locale) {
    var isSupported = L10n.supportedLocales.any((supportedLocale) {
      return supportedLocale.languageCode == locale.languageCode;
    });

    if (isSupported) {
      emit(state.copyWith(locale: locale));
    }
  }
}