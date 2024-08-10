import 'package:anistats_app/feature/routes.dart';
import 'package:flutter/material.dart';

class OnboardImportListsPage extends StatelessWidget {
  const OnboardImportListsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          const Text('Importing lists...'),
          const CircularProgressIndicator(),
          TextButton(
              onPressed: () {
                ListOverviewRoute().go(context);
              },
              child: const Text('TODO: Next'))
        ],
      ),
    );
  }
}
