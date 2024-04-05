import 'package:data_access/data_access.dart';
import 'package:flutter/material.dart';

import 'media_entity_card.dart';

bool _defaultIsSelected(MediaEntity _) => false;

class MediaEntityGridView extends StatelessWidget {
  const MediaEntityGridView({
    super.key,
    required this.items,
    this.onTapItem,
    this.onLongPressItem,
    this.isSelected = _defaultIsSelected,
  });

  final List<MediaEntity> items;

  final void Function(MediaEntity)? onTapItem;
  final void Function(MediaEntity)? onLongPressItem;

  final bool Function(MediaEntity) isSelected;

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 550,
        crossAxisSpacing: 8.0,
        mainAxisSpacing: 8.0,
        mainAxisExtent: 350,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        var mediaEntity = items.elementAt(index);

        return MediaEntityCard(
          selected: isSelected(mediaEntity),
          mediaEntity: mediaEntity,
          onTap: () {
            onTapItem?.call(mediaEntity);
          },
          onLongPress: () {
            onLongPressItem?.call(mediaEntity);
          },
        );
      },
    );
  }
}
