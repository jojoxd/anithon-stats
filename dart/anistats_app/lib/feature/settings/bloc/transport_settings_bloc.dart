import 'dart:async';

import 'package:anistats_api/anistats_api.dart';
import 'package:anistats_app/core/settings/app_transport_settings.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:formz/formz.dart';
import 'package:logging/logging.dart';

import '../model/transport/host.dart';
import '../model/transport/insecure.dart';
import '../model/transport/port.dart';

part 'transport_settings_event.dart';
part 'transport_settings_state.dart';

typedef SaveCallback = void Function(AppTransportSettings transport);

const kPingTimeout = Duration(seconds: 5);

class TransportSettingsBloc extends Bloc<TransportSettingsEvent, TransportSettingsState> {
  TransportSettingsBloc(AppTransportSettings transport, {this.onSave})
    : super(TransportSettingsState.initial(transport)) {
    on<HostChanged>(_onHostChanged);
    on<PortChanged>(_onPortChanged);
    on<InsecureChanged>(_onInsecureChanged);
    on<TransportSettingsSubmitted>(_onSubmitted);
  }

  final SaveCallback? onSave;

  final Logger _logger = Logger('TransportSettingsBloc');

  void _onHostChanged(
    HostChanged event,
    Emitter<TransportSettingsState> emit,
  ) {
    emit(state.copyWith(
      host: Host.dirty(event.host),
      status: FormzSubmissionStatus.initial,
    ));
  }

  void _onPortChanged(
    PortChanged event,
    Emitter<TransportSettingsState> emit,
  ) {
    emit(state.copyWith(
      port: Port.dirty(event.port),
      status: FormzSubmissionStatus.initial,
    ));
  }

  void _onInsecureChanged(
    InsecureChanged event,
    Emitter<TransportSettingsState> emit,
  ) {
    emit(state.copyWith(
      insecure: Insecure.dirty(event.insecure),
      status: FormzSubmissionStatus.initial,
    ));
  }

  Future<void> _onSubmitted(
    TransportSettingsSubmitted event,
    Emitter<TransportSettingsState> emit,
  ) async {
    if (!state.isFormValid) {
      return;
    }

    emit(state.copyWith(status: FormzSubmissionStatus.inProgress));

    var pingSuccessful = await _tryPing();
    if (!pingSuccessful) {
      emit(state.copyWith(
        status: FormzSubmissionStatus.failure,
      ));

      return;
    }

    _logger.info("Updating transport settings");
    onSave?.call(AppTransportSettings(
      host: state.host.value,
      port: int.parse(state.port.value),
      insecure: state.insecure.value,
    ));

    emit(state.copyWith(
      status: FormzSubmissionStatus.success,
    ));
  }

  Future<bool> _tryPing() async {
    _logger.info("Testing connection");

    var credentials = const ChannelCredentials.secure();
    if (state.insecure.value) {
      credentials = const ChannelCredentials.insecure();
    }

    var channel = ClientChannel(
        state.host.value,
        port: int.parse(state.port.value),
        options: ChannelOptions(
          credentials: credentials,
          connectTimeout: kPingTimeout,
          connectionTimeout: kPingTimeout,
          idleTimeout: kPingTimeout,
        ),
    );

    try {
      var pingService = PingService(channel);

      var pong = await Future.any([
          pingService.ping(),
          Future.delayed(kPingTimeout)
      ]);

      if (pong is Pong) {
        _logger.info(
            "Connection to ${state.host.value}:${state.port.value} successful, "
                "server version = ${pong.serverVersion}"
        );
      } else {
        throw TimeoutException("timed out");
      }
    } catch(e) {
      _logger.warning("Connection to ${state.host.value}:${state.port.value} failed", e);

      return false;
    } finally {
      await channel.terminate();
    }

    return true;
  }
}