import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../shared/layout/page_layout.dart';
import '../../../shared/widget/empty_state_widget.dart';
import '../data_access/entity/list_entity.dart';
import '../data_access/repository/list_repository.dart';

class ListOverviewPage extends StatefulWidget {
  ListOverviewPage({super.key});

  final ListRepository listRepository = ListRepository();

  @override
  State<StatefulWidget> createState() => _ListOverviewPageState();
}

class _ListOverviewPageState extends State<ListOverviewPage> {
  late Future<List<ListEntity>> _lists;

  @override
  void initState() {
    super.initState();

    _lists = widget.listRepository.getLists();
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
