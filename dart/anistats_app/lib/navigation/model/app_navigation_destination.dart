import 'package:flutter/material.dart';

enum AppNavigationSection {
  global,
  config,
}

class AppNavigationDestination {
  const AppNavigationDestination({
    required this.pathPrefix,
    required this.icon,
    required this.label,
    required this.go,
    this.enabled,
    this.exact = false,
    this.section = AppNavigationSection.global,
  });

  final String pathPrefix;
  final Icon Function(BuildContext context) icon;
  final String Function(BuildContext context) label;
  final bool exact;
  final void Function(BuildContext context) go;
  final AppNavigationSection section;

  final bool Function(BuildContext context)? enabled;

  bool matches(String uri) {
    if (exact) {
      return uri == pathPrefix;
    }

    return uri.startsWith(pathPrefix);
  }
}
