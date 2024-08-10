import 'package:flutter/material.dart';

class ActivityItem {
  const ActivityItem({required this.id, required this.title});

  final String id;
  final String title;
}

class ActivityOverviewItem extends StatelessWidget {
  const ActivityOverviewItem({
    super.key,
    required this.item,
    this.onTap,
    this.onLongPress,
  });

  final ActivityItem item;

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
              title: Text(item.title),
            ),
            Container(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Text('Some Activity ${item.id}'),
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
