import 'package:anistats_app/feature/auth/bloc/authentication_bloc.dart';
import 'package:authentication_repository/authentication_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../navigation/navigation.dart';

class ShellScaffold extends StatelessWidget {
  const ShellScaffold({super.key, required this.body});

  final Widget body;

  @override
  Widget build(BuildContext context) {
    // TODO Better way of breakpointing
    double screenWidth = MediaQuery.of(context).size.width;

    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
      builder: (context, state) {
        final isAuthenticated =
            state.status == AuthenticationStatus.authenticated;

        return Scaffold(

          body: SafeArea(
            child: Row(
              children: [
                if (screenWidth >= 600)
                  AppNavigationRail(
                    destinations: appNavigationDestinations,
                    isAuthenticated: isAuthenticated,
                    extended: screenWidth >= 800,
                  ),
                if (screenWidth >= 600)
                  const VerticalDivider(
                    width: 1,
                    thickness: 1,
                  ),
                Expanded(child: body),
              ],
            ),
          ),
          bottomNavigationBar: screenWidth < 600
              ? AppBottomNavigationBar(
                  destinations: appNavigationDestinations,
                  isAuthenticated: isAuthenticated,
                )
              : null,
        );
      },
    );
  }
}
