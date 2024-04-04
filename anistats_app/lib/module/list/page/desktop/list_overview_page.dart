import 'package:anistats_app/shared/widget/empty_state_widget.dart';
import 'package:flutter/material.dart';

import '../../data_access/entity/list_entity.dart';
import '../../data_access/repository/list_repository.dart';
import '../../widget/list/list_card_grid.dart';

class DesktopListOverviewPage extends StatefulWidget {
  DesktopListOverviewPage({super.key});

  final ListRepository listRepository = ListRepository();

  @override
  State<DesktopListOverviewPage> createState() =>
      _DesktopListOverviewPageState();
}

class _DesktopListOverviewPageState extends State<DesktopListOverviewPage> {
  late Future<List<ListEntity>> _lists;

  @override
  void initState() {
    super.initState();

    _lists = widget.listRepository.getLists();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _lists,
      builder: (context, state) {
        if (state.hasData) {
          if (state.data!.isEmpty) {
            return const EmptyStateWidget(
              title: Text("You have no lists"),
              media: Icon(Icons.playlist_remove_rounded),
            );
          }

          return ListCardGrid(lists: state.data!);
        }

        return const EmptyStateWidget(
          title: Text("Loading lists"),
          media: CircularProgressIndicator(),
        );
      },
    );
  }
}
