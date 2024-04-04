import 'package:flutter/material.dart';

class EmptyStateWidget extends StatelessWidget {
  const EmptyStateWidget({
    super.key,
    required this.title,
    this.subtitle,
    this.media,
  });

  final Widget title;
  final Widget? subtitle;
  final Widget? media;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(32.0),
      child: LayoutBuilder(builder: (context, constraints) {
        return Column(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            SizedBox.square(
              dimension: constraints.smallest.shortestSide / 3,
              child: MediaQuery(
                data: MediaQuery.of(context).copyWith(
                  textScaleFactor: 3,
                ),
                child: media ?? Text(""), // @TODO: This should be different
              ),
            ),
            Expanded(
              flex: 1,
              child: Container(
                padding: const EdgeInsets.only(
                  top: 32,
                  bottom: 32,
                ),
                child: MediaQuery(
                  data: MediaQuery.of(context).copyWith(
                    textScaleFactor: 3,
                  ),
                  child: title,
                ),
              ),
            ),
            if (subtitle != null)
              Expanded(
                flex: 1,
                child: subtitle!,
              ),
          ],
        );
      }),
    );
  }
}
