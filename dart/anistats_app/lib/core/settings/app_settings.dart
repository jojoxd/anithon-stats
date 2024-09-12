import 'dart:ui';

import 'package:anistats_app/core/l10n.dart';
import 'package:equatable/equatable.dart';

import 'app_theme.dart';
import 'app_transport_settings.dart';

class AppSettings extends Equatable {
  static const _jsonThemeKey = 'theme';
  static const _jsonTransportKey = 'transport';
  static const _jsonLocaleKey = 'locale';

  const AppSettings({
    required this.theme,
    required this.transport,
    required this.locale,
  });

  factory AppSettings.initial() {
    return AppSettings(
      theme: AppTheme.light,
      transport: AppTransportSettings.initial(),
      locale: L10n.supportedLocales[0],
    );
  }

  factory AppSettings.fromJson(Map<String, dynamic> json) {
    return AppSettings(
      theme: tryParseAppTheme(json[_jsonThemeKey]) ?? AppTheme.light,
      transport: AppTransportSettings.fromJson(json[_jsonTransportKey]),
      locale: Locale(json[_jsonLocaleKey]),
    );
  }

  final AppTheme theme;
  final AppTransportSettings transport;
  final Locale locale;

  Map<String, dynamic> toJson() {
    return {
      _jsonThemeKey: theme.toString(),
      _jsonTransportKey: transport.toJson(),
      _jsonLocaleKey: locale.languageCode,
    };
  }

  AppSettings copyWith({
    AppTheme? theme,
    AppTransportSettings? transport,
    Locale? locale,
  }) {
    return AppSettings(
      theme: theme ?? this.theme,
      transport: transport ?? this.transport,
      locale: locale ?? this.locale,
    );
  }

  @override
  List<Object?> get props => [theme, transport, locale];
}