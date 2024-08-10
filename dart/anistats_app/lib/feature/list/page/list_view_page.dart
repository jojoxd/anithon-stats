import 'package:flutter/material.dart';

class ListViewPage extends StatelessWidget {
  const ListViewPage({super.key, required this.listId});

  final String listId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Text('List "$listId" View Page'),
    );
  }
}
