import 'package:flutter/material.dart';

class ActivityPage extends StatelessWidget {
  const ActivityPage({super.key, required this.activityId});

  final String activityId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Text('Activity "$activityId" Page'),
    );
  }
}
