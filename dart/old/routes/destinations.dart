import 'package:anistats_app/routes/lib/nav_destination.dart';
import 'package:flutter/material.dart';

final List<NavDestination> destinations = [
  NavDestination(
    label: 'My Lists',
    icon: const Icon(Icons.abc),
    selectedIcon: const Icon(Icons.abc_outlined),
    screenBuilder: (_, __) => const Center(
      child: Text('My Lists Overview Page'),
    ),
  ),
  NavDestination(
    label: 'Search',
    icon: const Icon(Icons.loop),
    selectedIcon: const Icon(Icons.loop_outlined),
    screenBuilder: (_, __) => const Center(
      child: Text('Search Page'),
    ),
  ),
];
