part of 'transport_settings_bloc.dart';

class TransportSettingsState extends Equatable {
  const TransportSettingsState({
    required this.status,
    required this.host,
    required this.port,
    required this.insecure,
  });

  factory TransportSettingsState.initial(AppTransportSettings transport) {
    return TransportSettingsState(
      status: FormzSubmissionStatus.initial,
      host: Host.pure(transport.host),
      port: Port.pure(transport.port.toString()),
      insecure: Insecure.pure(transport.insecure),
    );
  }

  final FormzSubmissionStatus status;
  final Host host;
  final Port port;
  final Insecure insecure;

  get isFormValid => Formz.validate([host, port, insecure]);

  TransportSettingsState copyWith({
    FormzSubmissionStatus? status,
    Host? host,
    Port? port,
    Insecure? insecure,
  }) {
    return TransportSettingsState(
      status: status ?? this.status,
      host: host ?? this.host,
      port: port ?? this.port,
      insecure: insecure ?? this.insecure,
    );
  }

  @override
  List<Object?> get props => [status, host, port, insecure];
}