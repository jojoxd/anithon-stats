import 'package:flutter/material.dart';

import 'list_overview_item.dart';

class ListsOverview extends StatefulWidget {
  const ListsOverview({
    super.key,
    this.maxItems,
    this.onTapItem,
    this.onLongPressItem,
    this.onTapMore,
  });

  final int? maxItems;

  final void Function(ListItem item)? onTapItem;
  final void Function(ListItem item)? onLongPressItem;
  final void Function()? onTapMore;

  // TODO Remove this
  final _ListRepository _listRepository = const _ListRepository();

  @override
  State<StatefulWidget> createState() => ListsOverviewState();
}

class ListsOverviewState extends State<ListsOverview> {
  late Future<List<ListItem>> items;

  @override
  void initState() {
    super.initState();

    items = widget._listRepository.getLists(widget.maxItems);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: items,
        builder: (context, state) {
          if (state.hasData) {
            if (state.data!.isEmpty) {
              return const Text('TODO: Nicer "No Data" Handling');
            }

            return ListsOverviewImmediate(
              items: state.data!.take(widget.maxItems ?? 200).toList(),
              onTapItem: widget.onTapItem,
              onLongPressItem: widget.onLongPressItem,
              onTapMore: widget.onTapMore,
            );
          }

          return _ListsOverviewLoading(
            maxItems: widget.maxItems,
          );
        });
  }
}

class ListsOverviewImmediate extends StatelessWidget {
  const ListsOverviewImmediate({
    super.key,
    required this.items,
    this.onTapItem,
    this.onLongPressItem,
    this.onTapMore,
  });

  final List<ListItem> items;

  final void Function(ListItem item)? onTapItem;
  final void Function(ListItem item)? onLongPressItem;
  final void Function()? onTapMore;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverList.builder(
          itemCount: items.length,
          itemBuilder: (context, index) {
            return ListOverviewItem(
              item: items[index],
              onTap: onTapItem != null
                  ? () => onTapItem!.call(items[index])
                  : null,
              onLongPress: onLongPressItem != null
                  ? () => onLongPressItem!.call(items[index])
                  : null,
            );
          },
        ),
        if (onTapMore != null)
          SliverFillRemaining(
            hasScrollBody: false,
            child: Align(
              alignment: Alignment.topRight,
              child: TextButton.icon(
                onPressed: onTapMore,
                label: const Text('More'),
                icon: const Icon(Icons.chevron_right),
                iconAlignment: IconAlignment.end,
              ),
            ),
          ),
      ],
    );
  }
}

class _ListsOverviewLoading extends StatelessWidget {
  const _ListsOverviewLoading({this.maxItems});

  final int? maxItems;

  @override
  Widget build(BuildContext context) {
    // TODO Better loading procedures
    return const CircularProgressIndicator();
  }
}

// TODO faked ListRepository, should be managed somewhere else
class _ListRepository {
  const _ListRepository();

  Future<List<ListItem>> getLists(int? maxItems) async {
    await Future.delayed(const Duration(milliseconds: 500));

    return List.generate(
      maxItems ?? 20,
      (index) => ListItem(
        id: 'should-be-uuid-$index',
        name: 'List #$index',
      ),
    );
  }
}
