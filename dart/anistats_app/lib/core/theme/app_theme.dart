import 'package:flutter/material.dart';

enum AppTheme {
  light,
  dark,
}

extension AppThemeData on AppTheme {
  ThemeData get theme {
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
}

AppTheme? tryParseAppTheme(String stringValue) {
  return AppTheme.values.firstWhere((value) {
    return value.toString() == stringValue;
  });
}
