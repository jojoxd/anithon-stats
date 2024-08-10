import 'package:anistats_app/feature/auth/bloc/authentication_bloc.dart';
import 'package:anistats_app/feature/routes.dart';
import 'package:authentication_repository/authentication_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:user_repository/user_repository.dart';

import '../model/app_navigation_destination.dart';

class AppNavigationRail extends StatelessWidget {
  const AppNavigationRail({
    super.key,
    required this.destinations,
    this.extended = false,
    this.isAuthenticated = false,
  });

  final List<AppNavigationDestination> destinations;
  final bool extended;
  final bool isAuthenticated;

  @override
  Widget build(BuildContext context) {
    var state = GoRouterState.of(context);

    var enabledDestinationsTop = destinations
        .where((dest) => dest.enabled?.call(context) ?? true)
        .where((dest) => dest.section == AppNavigationSection.global)
        .toList();

    var selectedIndexTop = enabledDestinationsTop.indexWhere(
      (dest) => dest.matches(state.uri.path),
    );

    return NavigationRail(
      destinations:
          enabledDestinationsTop.map((dest) => dest.toItem(context)).toList(),
      selectedIndex: selectedIndexTop == -1 ? null : selectedIndexTop,
      onDestinationSelected: (index) {
        enabledDestinationsTop[index].go(context);
      },
      extended: extended,
      trailing: _trailing(context, state),
    );
  }

  Widget _trailing(BuildContext context, GoRouterState state) {
    var enabledDestinationsBottom = destinations
        .where((dest) => dest.enabled?.call(context) ?? true)
        .where((dest) => dest.section == AppNavigationSection.config)
        .toList();

    return Expanded(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 8.0),
        child: Column(
          children: [
            const Spacer(),
            ...enabledDestinationsBottom.map(
              (dest) => _destinationButton(context, state, dest),
            ),
          ],
        ),
      ),
    );
  }

  Widget _destinationButton(
    BuildContext context,
    GoRouterState state,
    AppNavigationDestination destination,
  ) {
    var isSelected = destination.matches(state.uri.path);

    if (extended) {
      return TextButton.icon(
        label: Text(destination.label(context)),
        icon: destination.icon(context),
        onPressed: () {
          destination.go(context);
        },
      );
    }

    return IconButton(
      icon: destination.icon(context),
      isSelected: isSelected,
      onPressed: () {
        destination.go(context);
      },
    );
  }
}

extension _AppNavigationDestinationX on AppNavigationDestination {
  NavigationRailDestination toItem(BuildContext context) {
    return NavigationRailDestination(
      icon: icon(context),
      label: Text(label(context)),
    );
  }
}

// class _Trailing extends StatelessWidget {
//   const _Trailing({required this.extended});

//   final bool extended;

//   @override
//   Widget build(BuildContext context) {
//     return BlocBuilder<AuthenticationBloc, AuthenticationState>(
//       builder: (context, state) {
//         print(state.status);

//         switch (AuthenticationStatus.authenticated) {
//           // state.status) {
//           case AuthenticationStatus.authenticated:
//             return _TrailingAuthenticated(
//               user: state.user,
//               extended: extended,
//             );

//           default: // no-op
//         }

//         return _TrailingUnauthenticated(
//           extended: extended,
//         );
//       },
//     );
//   }
// }

// class _TrailingAuthenticated extends StatelessWidget {
//   const _TrailingAuthenticated({
//     required this.user,
//     required this.extended,
//   });

//   final User user;
//   final bool extended;

//   @override
//   Widget build(BuildContext context) {
//     if (extended) {
//       return SizedBox(
//         height: 128,
//         child: Material(
//           color: Colors.redAccent,
//           child: Text('Hello'),
//         ),
//       );

//       // return Material(
//       //   child: Column(
//       //     mainAxisAlignment: MainAxisAlignment.end,
//       //     mainAxisSize: MainAxisSize.min,
//       //     children: [
//       //       ListTile(
//       //         leading: CircleAvatar(
//       //           foregroundImage: NetworkImage(user.avatar),
//       //         ),
//       //         title: Text(user.id),
//       //         onTap: () {
//       //           print('On Tap User');
//       //         },
//       //       ),
//       //       TextButton.icon(
//       //         onPressed: () {
//       //           print('On Tap Settings');
//       //         },
//       //         label: const Text('Settings'),
//       //         icon: const Icon(Icons.settings),
//       //       ),
//       //     ],
//       //   ),
//       // );
//     }

//     return Column(
//       children: [
//         const Spacer(),
//         InkWell(
//           child: CircleAvatar(
//             foregroundImage: NetworkImage(user.avatar),
//           ),
//           onTap: () {
//             print('On Tap User');
//           },
//         ),
//         IconButton(
//           onPressed: () {
//             print('On Tap Settings');
//           },
//           icon: const Icon(Icons.settings),
//         ),
//       ],
//     );
//   }
// }

// class _TrailingUnauthenticated extends StatelessWidget {
//   const _TrailingUnauthenticated({
//     required this.extended,
//   });

//   final bool extended;

//   @override
//   Widget build(BuildContext context) {
//     if (extended) {
//       return TextButton.icon(
//         onPressed: () {
//           AuthLoginRoute().go(context);
//         },
//         label: const Text('Login'),
//         icon: const Icon(Icons.login),
//       );
//     }

//     return IconButton(
//       onPressed: () {
//         AuthLoginRoute().go(context);
//       },
//       icon: const Icon(Icons.login),
//     );
//   }
// }
