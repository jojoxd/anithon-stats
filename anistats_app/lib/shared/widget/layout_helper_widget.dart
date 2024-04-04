import 'package:flutter/material.dart';

class LayoutHelperWidget extends StatelessWidget {
  const LayoutHelperWidget({
    super.key,
    this.desktopLayout,
    this.mobileLayout,
    required this.defaultLayout,
  });

  final Widget Function(BuildContext)? desktopLayout;
  final Widget Function(BuildContext)? mobileLayout;
  final Widget Function(BuildContext) defaultLayout;

  static const double breakpointDesktop = 900;

  @override
  Widget build(context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (_isMobile(context) && mobileLayout != null) {
          return mobileLayout!(context);
        }

        if (_isDesktop(context) && desktopLayout != null) {
          return desktopLayout!(context);
        }

        return defaultLayout(context);
      },
    );
  }

  bool _isMobile(BuildContext context) {
    return MediaQuery.of(context).size.width < breakpointDesktop;
  }

  bool _isDesktop(BuildContext context) {
    return MediaQuery.of(context).size.width >= breakpointDesktop;
  }
}
