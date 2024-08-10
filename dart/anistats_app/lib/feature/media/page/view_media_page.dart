import 'package:flutter/material.dart';

class ViewMediaPage extends StatelessWidget {
  const ViewMediaPage({super.key, required this.mediaId});

  final String mediaId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Text('View Media "$mediaId" Page'),
    );
  }
}
