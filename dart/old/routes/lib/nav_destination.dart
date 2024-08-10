import 'package:flutter/material.dart';

typedef ScreenBuilder = Widget Function(
  BuildContext context,
  BoxConstraints constraints,
);

class NavDestination {
  const NavDestination({
    required this.label,
    required this.icon,
    this.selectedIcon,
    required this.screenBuilder,
    this.childBuilder,
  });

  final String label;

  final Widget icon;
  final Widget? selectedIcon;

  final ScreenBuilder screenBuilder;
  final WidgetBuilder? childBuilder;

  NavigationDestination get navigationDestination => NavigationDestination(
        icon: icon,
        label: label,
        selectedIcon: selectedIcon,
      );
}
