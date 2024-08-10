// import 'package:shared_preferences/shared_preferences.dart';

// abstract class ThemeStorage {
//   Future<void> saveTheme(AppTheme theme);
//   Future<AppTheme> getTheme();
// }

// class SharedPreferencesThemeStorage implements ThemeStorage {
//   SharedPreferencesThemeStorage(this.sharedPreferences);

//   static const _themeKey = 'app.theme';

//   final SharedPreferences sharedPreferences;

//   @override
//   Future<AppTheme> getTheme() async {
//     final preferences = await SharedPreferences.getInstance();
//     final themeIndex = preferences.getInt(_themeKey) ?? 0;

//     return AppTheme.values[themeIndex];
//   }

//   @override
//   Future<void> saveTheme(AppTheme theme) {
//     await sharedPreferences.setInt(_themeKey, theme.index);
//   }
// }
