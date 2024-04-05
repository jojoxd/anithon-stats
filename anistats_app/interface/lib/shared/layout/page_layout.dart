import 'package:flutter/material.dart';

class PageLayout extends StatelessWidget {
  const PageLayout({
    super.key,
    required this.body,
    this.title,
    this.floatingActionButton,
  });

  final Widget body;
  final Widget? title;

  final Widget? floatingActionButton;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: title ?? const Text("TEST"),
      ),
      body: body,
      floatingActionButton: floatingActionButton,
    );
  }
}
