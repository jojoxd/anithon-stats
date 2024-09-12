import 'package:anistats_app/core/l10n.dart';
import 'package:anistats_app/feature/settings/model/transport/host.dart';
import 'package:anistats_app/feature/settings/model/transport/port.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:formz/formz.dart';

import '../bloc/transport_settings_bloc.dart';

class TransportSettingsForm extends StatelessWidget {
  const TransportSettingsForm({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          var bloc = context.read<TransportSettingsBloc>();

          bloc.add(TransportSettingsSubmitted());
        },

        child: BlocBuilder<TransportSettingsBloc, TransportSettingsState>(
          builder: (context, state) {
            switch (state.status) {
              case FormzSubmissionStatus.inProgress:
                return const CircularProgressIndicator();

              default:
                return const Icon(Icons.save);
            }
          }
        ),
      ),

      body: BlocListener<TransportSettingsBloc, TransportSettingsState>(
        listener: (context, state) {
          switch(state.status) {
            case FormzSubmissionStatus.failure:
              _cannotConnectMessage(context);

            default: // noop
          }
        },

        child: const Align(
          alignment: Alignment(0, -1 / 3),
          child: Column(
            children: [
              _HostInput(),
              Padding(
                padding: EdgeInsets.all(12),
              ),
              _PortInput(),
              const Padding(
                padding: EdgeInsets.all(12),
              ),
              _InsecureInput(),
            ],
          ),
        ),
      ),
    );
  }

  void _cannotConnectMessage(BuildContext context) {
    var messenger = ScaffoldMessenger.of(context);

    messenger.hideCurrentSnackBar();

    var snackbar = SnackBar(content: Text(context.l10n.errorCannotConnect));
    messenger.showSnackBar(snackbar);
  }
}

class _HostInput extends StatelessWidget {
  const _HostInput();

  @override
  Widget build(BuildContext context) {
    final displayError = context.select(
          (TransportSettingsBloc bloc) => bloc.state.host.displayError,
    );
    final currentValue = context.select(
          (TransportSettingsBloc bloc) => bloc.state.host.value,
    );

    return TextFormField(
      key: const Key('transportSettingsPage_hostInput_textField'),
      initialValue: currentValue,
      onChanged: (value) {
        context.read<TransportSettingsBloc>().add(HostChanged(value));
      },
      decoration: InputDecoration(
        icon: const Icon(Icons.computer),
        labelText: context.l10n.host,
        errorText: displayError?.l10n(context),
      ),
    );
  }
}

class _PortInput extends StatelessWidget {
  const _PortInput();

  @override
  Widget build(BuildContext context) {
    final displayError = context.select(
        (TransportSettingsBloc bloc) => bloc.state.port.displayError,
    );

    final currentValue = context.select(
        (TransportSettingsBloc bloc) => bloc.state.port.value,
    );

    return TextFormField(
      key: const Key('transportSettingsPage_portInput_textField'),
      keyboardType: TextInputType.number,
      initialValue: currentValue,
      onChanged: (value) {
        context.read<TransportSettingsBloc>().add(PortChanged(value));
      },
      decoration: InputDecoration(
        icon: const Icon(Icons.cable),
        labelText: context.l10n.port,
        errorText: displayError?.l10n(context),
      ),
    );
  }
}

class _InsecureInput extends StatelessWidget {
  const _InsecureInput();

  @override
  Widget build(BuildContext context) {
    final currentValue = context.select(
          (TransportSettingsBloc bloc) => bloc.state.insecure.value,
    );

    var theme = Theme.of(context);

    return SwitchListTile(
      contentPadding: const EdgeInsets.only(left: 40.0, right: 12.0),
      title: Text(context.l10n.insecureConnection),
      subtitle: Text(context.l10n.insecureConnectionDescription),
      value: currentValue,
      onChanged: (value) {
        context.read<TransportSettingsBloc>().add(InsecureChanged(value));
      },
      thumbIcon: WidgetStateProperty.resolveWith((state) {
        return state.contains(WidgetState.selected)
            ? Icon(Icons.lock_open_outlined, color: theme.colorScheme.onError)
            : Icon(Icons.lock_outline, color: theme.colorScheme.onPrimary);
      }),
      trackColor: WidgetStateProperty.resolveWith((state) {
        return state.contains(WidgetState.selected)
            ? theme.colorScheme.error
            : theme.colorScheme.primary;
      }),
      thumbColor: WidgetStateProperty.resolveWith((state) {
        return state.contains(WidgetState.selected)
            ? theme.colorScheme.onErrorContainer
            : theme.colorScheme.onPrimaryContainer;
      }),
    );
  }
}