import 'package:anistats_app/shared/widget/empty_state_widget.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ErrorPage extends StatelessWidget {
  const ErrorPage({super.key, required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return EmptyStateWidget(
      title: const Text("Something went wrong"),
      media: const Icon(Icons.question_mark_rounded),
      subtitle: Column(
        children: [
          Text(message),
          ElevatedButton(
              onPressed: () {
                context.go("/lists");
              },
              child: const Text("Go back to home"))
        ],
      ),
    );
  }
}
