import 'package:anistats_app/feature/activity/widget/activity_overview.dart';
import 'package:anistats_app/feature/auth/bloc/authentication_bloc.dart';
import 'package:anistats_app/feature/list/widget/lists_overview.dart';
import 'package:anistats_app/feature/routes.dart';
import 'package:authentication_repository/authentication_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
      builder: (context, authenticationState) {
        final isAuthenticated =
            authenticationState.status == AuthenticationStatus.authenticated;

        List<Widget> children = [
          if (isAuthenticated)
            Expanded(
              child: ListsOverview(
                maxItems: 3,
                onTapItem: (item) {
                  ListViewRoute(listId: item.id).push(context);
                },
                onTapMore: () {
                  ListOverviewRoute().go(context);
                },
              ),
            ),
          Expanded(
            child: ActivityOverview(
              maxItems: 3,
              onTapItem: (item) {
                ActivityRoute(activityId: item.id).push(context);
              },
              onTapMore: () {
                ActivityOverviewRoute().go(context);
              },
            ),
          ),
        ];

        if (screenWidth > 800) {
          return Row(
            children: children,
          );
        }

        return Column(
          children: children,
        );
      },
    );
  }
}
