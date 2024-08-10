import 'package:flutter/material.dart';

class ListItem {
  const ListItem({
    required this.id,
    required this.name,
  });

  final String id;
  final String name;
}

class ListOverviewItem extends StatelessWidget {
  const ListOverviewItem({
    super.key,
    required this.item,
    this.onTap,
    this.onLongPress,
  });

  final ListItem item;

  final void Function()? onTap;
  final void Function()? onLongPress;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        onLongPress: onLongPress,
        child: Column(
          children: [
            ListTile(
              title: Text(item.name),
            ),
            Container(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Text('5H30M'),
                  Text('Complete'),
                ]
                    .map(
                      (chip) => Container(
                        margin: const EdgeInsets.symmetric(horizontal: 4.0),
                        child: chip,
                      ),
                    )
                    .toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
