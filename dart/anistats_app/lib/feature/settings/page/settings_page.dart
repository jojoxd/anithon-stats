import 'package:anistats_app/core/bloc/app_settings_cubit.dart';
import 'package:anistats_app/core/l10n.dart';
import 'package:anistats_app/core/settings/app_transport_settings.dart';
import 'package:anistats_app/feature/routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/settings/app_settings.dart';
import '../../../core/settings/app_theme.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        children: [
          BlocSelector<AppSettingsCubit, AppSettings, AppTheme>(
            selector: (state) => state.theme,
            builder: (context, currentTheme) {
              return ListTile(
                title: Text(context.l10n.theme),
                subtitle: Text(currentTheme.l10n(context)),
                leading: Icon(currentTheme.icon),
                onTap: () async {
                  var newTheme = await _themeDialog(context);

                  if (context.mounted && newTheme != null) {
                    var cubit = context.read<AppSettingsCubit>();
                    cubit.updateTheme(newTheme);
                  }
                },
              );
            },
          ),

          BlocSelector<AppSettingsCubit, AppSettings, Locale>(
            selector: (state) => state.locale,
            builder: (context, locale) {
              return ListTile(
                title: Text(context.l10n.locale),
                subtitle: Text(locale.l10n(context)),
                leading: const Icon(Icons.translate),
                onTap: () async {
                  var newLocale = await _localeDialog(context);

                  if (context.mounted && newLocale != null) {
                    var cubit = context.read<AppSettingsCubit>();
                    cubit.updateLocale(newLocale);
                  }
                },
              );
            }
          ),

          BlocSelector<AppSettingsCubit, AppSettings, AppTransportSettings>(
            selector: (state) => state.transport,
            builder: (context, transport) {
              return ListTile(
                title: Text(context.l10n.transport),
                subtitle: Text('${transport.host}:${transport.port}'),
                leading: const Icon(Icons.settings_ethernet),
                onTap: () {
                  TransportSettingsRoute().go(context);
                },
              );
            },
          ),
        ],
      )
    );
  }

  Future<AppTheme?> _themeDialog(BuildContext context) {
    return showDialog<AppTheme>(
      context: context,
      builder: (context) {
        return SimpleDialog(
          title: Text(context.l10n.selectTheme),
          children: [
            ...AppTheme.values.map<Widget>((theme) {
              return SimpleDialogOption(
                onPressed: () {
                  Navigator.pop(context, theme);
                },
                child: Text(theme.l10n(context)),
              );
            }),

            Padding(
              padding: const EdgeInsets.only(
                left: 16.0,
                right: 16.0,
                top: 8.0,
              ),
              child: TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text(context.l10n.cancel),
              ),
            ),
          ],
        );
      },
    );
  }

  Future<Locale?> _localeDialog(BuildContext context) {
    return showDialog<Locale>(
      context: context,
      builder: (context) {
        return SimpleDialog(
          title: Text(context.l10n.selectLocale),
          children: [
            ...L10n.supportedLocales.map<Widget>((locale) {
              return SimpleDialogOption(
                onPressed: () {
                  Navigator.pop(context, locale);
                },
                child: Text(locale.l10n(context)),
              );
            }),

            Padding(
              padding: const EdgeInsets.only(
                left: 16.0,
                right: 16.0,
                top: 8.0,
              ),
              child: TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text(context.l10n.cancel),
              ),
            ),
          ],
        );
      },
    );
  }
}

extension LocaleL10n on Locale {
  String l10n(BuildContext context) {
    switch(languageCode) {
      case 'en':
        return context.l10n.localeEN;
      case 'nl':
        return context.l10n.localeNL;
      default: // noop
    }

    return context.l10n.unsupportedLocale;
  }
}

extension AppThemeIconDataX on AppTheme {
  IconData get icon {
    switch(this) {
      case AppTheme.dark:
        return Icons.dark_mode_outlined;
      case AppTheme.light:
        return Icons.light_mode_outlined;
    }
  }
}