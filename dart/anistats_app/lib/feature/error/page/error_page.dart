import 'package:flutter/material.dart';

class ErrorPage extends StatelessWidget {
  const ErrorPage({super.key, required this.error});

  final Exception error;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          const Center(
            child: Text('Whoops, something went wrong...'),
          ),
          TextButton(
            onPressed: () {
              // TODO Implement go back functionality on error page
              print('TODO: Go Back');
            },
            child: const Text('Go Back'),
          ),
        ],
      ),
    );
  }
}
