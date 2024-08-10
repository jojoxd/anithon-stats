import 'package:flutter/material.dart';

class ListEditPage extends StatelessWidget {
  const ListEditPage({super.key, required this.listId});

  final String listId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Text('List Edit Page $listId'),
    );
  }
}
