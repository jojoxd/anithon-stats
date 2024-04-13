import 'package:anistats_app/module/list/service/list_service.dart';
import 'package:anistats_app/shared/widget/empty_state_widget.dart';
import 'package:data_access/data_access.dart';
import 'package:flutter/material.dart';

import '../../widget/list/list_card_grid.dart';

class DesktopListOverviewPage extends StatefulWidget {
  const DesktopListOverviewPage({
    super.key,
    required this.listService,
  });

  final ListService listService;

  @override
  State<DesktopListOverviewPage> createState() =>
      _DesktopListOverviewPageState();
}

class _DesktopListOverviewPageState extends State<DesktopListOverviewPage> {
  late Future<ListEntityList> _lists;

  @override
  void initState() {
    super.initState();

    // @TODO: Allow user selection
    _lists = widget.listService.getForUser(
      "018eae9b-1717-7125-aff4-f15def68fab7",
    );
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
