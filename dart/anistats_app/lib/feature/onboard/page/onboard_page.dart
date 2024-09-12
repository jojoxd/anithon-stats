import 'package:anistats_app/core/app.dart';
import 'package:anistats_app/feature/onboard/bloc/onboard_cubit.dart';
import 'package:anistats_app/feature/routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../model/onboard_stage.dart';

// TODO Refactor using bloc/cubit
class OnboardPage extends StatelessWidget {
  const OnboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          ListTile(
            title: const Text('Onboard Page'),
            trailing: IconButton(
              icon: const Icon(Icons.close),
              onPressed: () {
                HomeRoute().go(context);
              },
            ),
          ),
          Row(
            children: [
              TextButton(
                onPressed: () {
                  context.read<OnboardCubit>().advanceState();

                  OnboardRoute().go(context);
                },
                child: const Text('Connect to a different server'),
              ),
              TextButton(
                onPressed: () {
                  // context.read<OnboardCubit>()
                  //   .advanceState(OnboardStage.login);
                },
                child: const Text('Log in'),
              ),
              TextButton(
                onPressed: () async {
                  String? accountId =
                      await OnboardCreateAccountRoute().push<String?>(context);

                  if (accountId != null && context.mounted) {
                    print('Account Id = $accountId');
                    OnboardImportListsRoute().go(context);

                    return;
                  }

                  // TODO Maybe show a snackbar?
                },
                child: const Text('Create Account'),
              ),
            ],
          )
        ],
      ),
    );
  }
}
