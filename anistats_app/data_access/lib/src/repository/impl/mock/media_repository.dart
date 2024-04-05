import 'dart:math';

import 'package:uuid/data.dart';
import 'package:uuid/rng.dart';
import 'package:uuid/uuid.dart';

import '../../../entity/media_entity.dart';
import '../../media_repository.dart';
import '../mock_repository_mixin.dart';

class MockMediaRepository extends MediaRepository with MockRepositoryMixin {
  @override
  Future<MediaEntity?> get(String id) async {
    await simulateNetworkDelay();

    if (random.nextInt(100) > 90) {
      return null;
    }

    return MediaEntity(
      id: UuidValue.fromString(id),
      anilistId: random.nextInt(1000),
      name: "Media ($id)",
    );
  }

  @override
  Future<MediaEntityList> search(String query) async {
    return MediaEntityList.generate(10, (index) {
      var id = Uuid().v7obj();

      return MediaEntity(
        id: id,
        anilistId: random.nextInt(1000),
        name: "Media ${id.uuid}",
      );
    });
  }
}
