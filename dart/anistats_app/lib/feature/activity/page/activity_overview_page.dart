import 'package:anistats_app/feature/activity/widget/activity_overview.dart';
import 'package:anistats_app/feature/routes.dart';
import 'package:flutter/material.dart';

class ActivityOverviewPage extends StatelessWidget {
  const ActivityOverviewPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ActivityOverview(
        onTapItem: (item) {
          ActivityRoute(activityId: item.id).push(context);
        },
      ),
    );
  }
}
