import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class TestScreen extends StatelessWidget {
  const TestScreen({super.key, required this.label, required this.buttonRoute});

  final String label;
  final String buttonRoute;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(label),
        ElevatedButton(
          onPressed: () {
            context.go(buttonRoute);
          },
          child: Text("Go $buttonRoute"),
        ),
      ],
    );
  }
}
