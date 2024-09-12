part of 'transport_settings_bloc.dart';

sealed class TransportSettingsEvent extends Equatable {
  const TransportSettingsEvent();

  @override
  List<Object?> get props => [];
}

final class ConnectionDetailsChanged extends TransportSettingsEvent {
  const ConnectionDetailsChanged();
}

final class HostChanged extends ConnectionDetailsChanged {
  const HostChanged(this.host);

  final String host;

  @override
  List<Object?> get props => [host];
}

final class PortChanged extends ConnectionDetailsChanged {
  const PortChanged(this.port);

  final String port;

  @override
  List<Object?> get props => [port];
}

final class InsecureChanged extends ConnectionDetailsChanged {
  const InsecureChanged(this.insecure);

  final bool insecure;

  @override
  List<Object?> get props => [insecure];
}

final class TransportSettingsSubmitted extends TransportSettingsEvent {}