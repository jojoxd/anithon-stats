import 'package:anistats_app/core/bloc/app_settings_cubit.dart';
import 'package:anistats_app/feature/onboard/bloc/onboard_cubit.dart';
import 'package:anistats_app/feature/settings/bloc/transport_settings_bloc.dart';
import 'package:anistats_app/feature/settings/widget/transport_settings_form.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:anistats_app/feature/routes.dart';

class OnboardSettingsPage extends StatelessWidget {
  const OnboardSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: BlocProvider(
          create: (context) {
            var appSettingsCubit = context.read<AppSettingsCubit>();
            return TransportSettingsBloc(
              appSettingsCubit.state.transport,
              onSave: (transport) {
                appSettingsCubit.updateTransportSettings(transport);
                context.read<OnboardCubit>().advanceState();
                OnboardRoute().go(context);
              }
            );
          },
          child: const TransportSettingsForm(),
        ),
      ),
    );
  }
}