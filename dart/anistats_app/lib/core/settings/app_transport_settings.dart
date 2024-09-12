import 'package:equatable/equatable.dart';

class AppTransportSettings extends Equatable {
  static const _jsonHostKey = 'host';
  static const _jsonPortKey = 'port';
  static const _jsonInsecureKey = 'insecure';

  const AppTransportSettings({
    required this.host,
    required this.port,
    required this.insecure,
  });

  factory AppTransportSettings.initial() {
    return const AppTransportSettings(
      host: '127.0.0.1',
      port: 8008,
      insecure: true,
    );
  }

  factory AppTransportSettings.fromJson(Map<String, dynamic> json) {
    return AppTransportSettings(
      host: json[_jsonHostKey],
      port: json[_jsonPortKey],
      insecure: json[_jsonInsecureKey],
    );
  }

  final String host;
  final int port;
  final bool insecure;

  Map<String, dynamic> toJson() {
    return {
      _jsonHostKey: host,
      _jsonPortKey: port,
      _jsonInsecureKey: insecure,
    };
  }

  AppTransportSettings copyWith({
    String? host,
    int? port,
    bool? insecure,
  }) {
    return AppTransportSettings(
      host: host ?? this.host,
      port: port ?? this.port,
      insecure: insecure ?? this.insecure,
    );
  }

  @override
  List<Object?> get props => [host, port, insecure];
}