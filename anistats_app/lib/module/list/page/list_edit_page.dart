import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:go_router/go_router.dart';

import '../../../shared/layout/page_layout.dart';

class ListEditPage extends StatelessWidget {
  const ListEditPage({
    super.key,
    required this.listId,
  });

  final String listId;

  @override
  Widget build(BuildContext context) {
    return PageLayout(
      body: Row(
        children: [
          Hero(
            tag: 'list_${listId}_image',
            child: Image.network(
              "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20954-f30bHMXa5Qoe.jpg",
              scale: 2,
              fit: BoxFit.cover,
              alignment: Alignment.center,
            ),
          ),
          const Text("ListEditPage"),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        heroTag: "action_add_media",
        onPressed: () async {
          var data = await context.push("/media/search");

          print(data);
        },
        child: Icon(Icons.abc),
      ),
    );
  }
}
