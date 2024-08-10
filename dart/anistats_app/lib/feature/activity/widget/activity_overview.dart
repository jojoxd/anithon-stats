import 'package:flutter/material.dart';

import 'activity_overview_item.dart';

class ActivityOverview extends StatefulWidget {
  const ActivityOverview({
    super.key,
    this.maxItems,
    this.onTapItem,
    this.onLongPressItem,
    this.onTapMore,
  });

  final int? maxItems;

  final void Function(ActivityItem item)? onTapItem;
  final void Function(ActivityItem item)? onLongPressItem;
  final void Function()? onTapMore;

  // TODO Remove this
  final _ActivityRepository _activityRepository = const _ActivityRepository();

  @override
  State<StatefulWidget> createState() => _ActivityOverviewState();
}

class _ActivityOverviewState extends State<ActivityOverview> {
  late Future<List<ActivityItem>> items;

  @override
  void initState() {
    super.initState();

    items = widget._activityRepository.getActivities(widget.maxItems);
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

          return ActivityOverviewImmediate(
            items: state.data!.take(widget.maxItems ?? 200).toList(),
            onTapItem: widget.onTapItem,
            onLongPressItem: widget.onLongPressItem,
            onTapMore: widget.onTapMore,
          );
        }

        return _ActivityOverviewLoading(
          maxItems: widget.maxItems,
        );
      },
    );
  }
}

class ActivityOverviewImmediate extends StatelessWidget {
  const ActivityOverviewImmediate({
    super.key,
    required this.items,
    this.onTapItem,
    this.onLongPressItem,
    this.onTapMore,
  });

  final List<ActivityItem> items;

  final void Function(ActivityItem item)? onTapItem;
  final void Function(ActivityItem item)? onLongPressItem;
  final void Function()? onTapMore;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverList.builder(
          itemCount: items.length,
          itemBuilder: (context, index) {
            return ActivityOverviewItem(
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

class _ActivityOverviewLoading extends StatelessWidget {
  const _ActivityOverviewLoading({this.maxItems});

  final int? maxItems;

  @override
  Widget build(BuildContext context) {
    // TODO Better loading procedures
    return const CircularProgressIndicator();
  }
}

// TODO faked ActivityRepository, should be managed somewhere else
class _ActivityRepository {
  const _ActivityRepository();

  Future<List<ActivityItem>> getActivities(int? maxItems) async {
    await Future.delayed(const Duration(milliseconds: 600));

    return List.generate(
      maxItems ?? 20,
      (index) => ActivityItem(
        id: 'should-be-uuid-$index',
        title: 'Some Activity #$index',
      ),
    );
  }
}
