import 'package:anistats_api/anistats_api.dart';
import 'package:anistats_app/core/settings/app_settings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:logging/logging.dart';

import '../../bloc/app_settings_cubit.dart';

class ClientChannelProvider extends StatelessWidget {
  ClientChannelProvider({super.key, required this.child});

  final Widget child;

  final Logger _logger = Logger('ClientChannelProvider');

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AppSettingsCubit, AppSettings>(
      buildWhen: (previous, current) {
        return previous.transport != current.transport;
      },
      builder: (context, appSettings) {
        return RepositoryProvider(
          create: (context) {
            _logger.info('Remote ${appSettings.transport.host}:${appSettings.transport.port}');

            var credentials = const ChannelCredentials.secure();
            if (appSettings.transport.insecure) {
              _logger.warning('Using an insecure channel');

              credentials = const ChannelCredentials.insecure();
            }

            return ClientChannel(
                appSettings.transport.host,
                port: appSettings.transport.port,
                options: ChannelOptions(
                  credentials: credentials,
                ),

                channelShutdownHandler: _onChannelShutdown
            );
          },
          child: child,
        );
      }
    );

  }

  void _onChannelShutdown() {
    _logger.warning('Channel shut down');
  }
}