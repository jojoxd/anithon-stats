import 'package:flutter/material.dart';

import '../../../shared/widget/card/selectable_card.dart';
import '../data_access/entity/media_entity.dart';

class MediaEntityCard extends StatelessWidget {
  const MediaEntityCard({
    super.key,
    required this.mediaEntity,
    this.selected = false,
    this.onTap,
    this.onLongPress,
  });

  final bool selected;
  final MediaEntity mediaEntity;

  final void Function()? onTap;
  final void Function()? onLongPress;

  @override
  Widget build(BuildContext context) {
    return SelectableCard(
      selected: selected,
      clipBehavior: Clip.antiAliasWithSaveLayer,
      onTap: onTap,
      onLongPress: onLongPress,
      child: Column(
        children: [
          SizedBox(
            height: 150,
            child: Image.network(
              "https://s4.anilist.co/file/anilistcdn/media/anime/banner/153518-7uRvV7SLqmHV.jpg",
              alignment: Alignment.center,
              fit: BoxFit.cover,
            ),
          ),
          ListTile(
            title: Text(mediaEntity.name),
          ),
        ],
      ),
    );
  }
}
