import 'package:anistats_app/module/list/service/list_service.dart';
import 'package:data_access/data_access.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../shared/layout/page_layout.dart';
import '../../../shared/widget/empty_state_widget.dart';

class ListOverviewPage extends StatefulWidget {
  const ListOverviewPage({
    super.key,
    required this.listService,
  });

  final ListService listService;

  @override
  State<StatefulWidget> createState() => _ListOverviewPageState();
}

class _ListOverviewPageState extends State<ListOverviewPage> {
  late Future<ListEntityList> _lists;

  @override
  void initState() {
    super.initState();

    _lists = widget.listService.getListsForUser(
      "018eae9b-1717-7125-aff4-f15def68fab7",
    );
  }

  @override
  Widget build(BuildContext context) {
    return PageLayout(
      title: const Text("List Overview"),
      body: FutureBuilder(
        future: _lists,
        builder: (context, state) {
          if (state.hasData) {
            if (state.data!.isEmpty) {
              return const EmptyStateWidget(
                title: Text("You have no lists"),
                media: Icon(Icons.playlist_remove_rounded),
              );
            }

            return ListView.builder(
              itemBuilder: (context, index) {
                return ListTile(
                  leading: Image.network(
                    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20954-UMb6Kl7ZL8Ke.jpg",
                    scale: 2,
                    fit: BoxFit.cover,
                  ),
                  title: Text(state.data![index].name),
                  subtitle: Text("SUBTITLE - I SHOULD BE CHIPS"),
                  isThreeLine: false,
                  onTap: () {
                    context.go('/lists/${state.data![index].id}/edit');
                  },
                );
              },
              itemCount: state.data!.length,
            );
          }

          return const EmptyStateWidget(
            title: Text("Loading lists"),
            media: CircularProgressIndicator(),
          );
        },
      ),
    );
  }
}
