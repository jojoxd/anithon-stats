class AppConfig {
  const AppConfig({
    required this.url,
  });

  final String url;

  AppConfig copyWith({
    String? url,
  }) =>
      AppConfig(
        url: url ?? this.url,
      );
}
