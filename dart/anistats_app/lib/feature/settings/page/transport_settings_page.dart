import 'package:anistats_app/core/bloc/app_settings_cubit.dart';
import 'package:anistats_app/core/l10n.dart';
import 'package:anistats_app/feature/settings/bloc/transport_settings_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../widget/transport_settings_form.dart';

class TransportSettingsPage extends StatelessWidget {
  const TransportSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: BlocProvider(
          create: (context) {
            var appSettingsCubit = context.read<AppSettingsCubit>();
            return TransportSettingsBloc(
              appSettingsCubit.state.transport,
              onSave: (transport) {
                appSettingsCubit.updateTransportSettings(transport);
                _onSaved(context);
              },
            );
          },

          child: const TransportSettingsForm(),
        )
      ),
    );
  }

  void _onSaved(BuildContext context) {
    var messenger = ScaffoldMessenger.of(context);

    messenger.hideCurrentSnackBar();

    var snackbar = SnackBar(
      content: Text(context.l10n.transportSettingsSaved),
    );
    messenger.showSnackBar(snackbar);
  }
}