import 'package:anistats_app/feature/routes.dart';
import 'package:flutter/material.dart';

import '../widget/lists_overview.dart';

class ListOverviewPage extends StatelessWidget {
  const ListOverviewPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListsOverview(
        onTapItem: (item) {
          ListViewRoute(listId: item.id).go(context);
        },
      ),
      // TODO I'd rather have this passed to ShellScaffold somehow (up the tree above navigator)
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          ListCreateRoute().go(context);
        },
        child: const Icon(Icons.add),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }
}
