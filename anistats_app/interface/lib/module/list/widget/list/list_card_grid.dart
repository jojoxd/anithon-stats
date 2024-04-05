import 'dart:math';

import 'package:data_access/data_access.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'list_card.dart';

class ListCardGrid extends StatelessWidget {
  const ListCardGrid({
    super.key,
    required this.lists,
    this.padding,
    this.mainAxisSpacing = 10,
    this.crossAxisSpacing = 10,
    this.maxItemWidth = 500,
  });

  final List<ListEntity> lists;

  final EdgeInsetsGeometry? padding;
  final double mainAxisSpacing;
  final double crossAxisSpacing;
  final double maxItemWidth;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      return GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          mainAxisSpacing: mainAxisSpacing,
          crossAxisSpacing: crossAxisSpacing,
          crossAxisCount: max(2, (constraints.maxWidth / maxItemWidth).floor()),
          mainAxisExtent: 350,
        ),
        shrinkWrap: true,
        padding: padding ??
            EdgeInsets.only(
              left: crossAxisSpacing,
              right: crossAxisSpacing,
              top: mainAxisSpacing,
              bottom: mainAxisSpacing,
            ),
        itemCount: lists.length,
        physics: const ScrollPhysics(),
        itemBuilder: (context, index) {
          return ListCard(
            list: lists[index],
            actions: [
              FilledButton.tonalIcon(
                onPressed: () {
                  context.go('/lists/${lists[index].id}');
                },
                icon: Icon(Icons.pentagon),
                label: Text("Edit"),
              ),
            ],
          );
        },
      );
    });
  }
}
