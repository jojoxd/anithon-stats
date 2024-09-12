import 'package:anistats_app/core/l10n.dart';
import 'package:flutter/material.dart';

enum AppTheme {
  light,
  dark,
}

extension AppThemeData on AppTheme {
  ThemeData get themeData {
    switch (this) {
      case AppTheme.light:
        return ThemeData.from(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            brightness: Brightness.light,
            seedColor: Colors.deepPurpleAccent,
          ),
        );

      case AppTheme.dark:
        return ThemeData.from(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            brightness: Brightness.dark,
            seedColor: Colors.deepPurpleAccent,
          ),
        );
    }
  }

  String l10n(BuildContext context) {
    switch(this) {
      case AppTheme.light:
        return context.l10n.themeLight;

      case AppTheme.dark:
        return context.l10n.themeDark;
    }
  }
}

AppTheme? tryParseAppTheme(String stringValue) {
  return AppTheme.values.firstWhere((value) {
    return value.toString() == stringValue;
  });
}
