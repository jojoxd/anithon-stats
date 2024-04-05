import 'package:data_access/data_access.dart';
import 'package:flutter/material.dart';

class ListCard extends StatelessWidget {
  const ListCard({
    super.key,
    required this.list,
    this.actions,
  });

  final ListEntity list;
  final List<Widget>? actions;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAliasWithSaveLayer,
      child: Column(
        children: [
          SizedBox(
            height: 200,
            width: MediaQuery.of(context).size.width,
            child: Hero(
              tag: 'list_${list.id}_image',
              child: Image.network(
                "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20954-f30bHMXa5Qoe.jpg",
                scale: 2,
                fit: BoxFit.cover,
                alignment: Alignment.center,
              ),
            ),
          ),
          ListTile(
            title: Text(list.name),
            subtitle: Container(
              margin: EdgeInsets.only(top: 8.0),
              child: Row(
                children: [
                  Chip(
                    label: Text("${list.items.length} entries"),
                    backgroundColor: Colors.orangeAccent,
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            child: Container(
              margin: EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                mainAxisSize: MainAxisSize.max,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: actions ?? [],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
