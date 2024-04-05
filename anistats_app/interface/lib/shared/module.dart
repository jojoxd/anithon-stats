import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';

abstract class Module {
  List<RouteBase> get routes => [];

  void register(GetIt locator);
}
