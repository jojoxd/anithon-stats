import 'dart:io';

import '../entity/media_entity.dart';
import 'impl/mock/media_repository.dart';
import 'impl/native/media_repository.dart';
import 'impl/network/media_repository.dart';

abstract class MediaRepository {
  const MediaRepository();

  factory MediaRepository.network(HttpClient client) {
    return NetworkMediaRepository(client);
  }

  factory MediaRepository.native() {
    return NativeMediaRepository();
  }

  factory MediaRepository.mock() {
    return MockMediaRepository();
  }

  Future<MediaEntity?> get(String id);
  Future<MediaEntityList> search(String query);
}
