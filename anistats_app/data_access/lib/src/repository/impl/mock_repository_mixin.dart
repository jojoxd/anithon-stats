import 'dart:math';

mixin MockRepositoryMixin {
  final Random random = Random();

  Future<void> simulateNetworkDelay() async {
    int networkDelay = (1000 * random.nextDouble()).floor();
    await Future.delayed(Duration(milliseconds: networkDelay));
  }
}
