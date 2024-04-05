import 'dart:io';

import '../../../entity/media_entity.dart';
import '../../media_repository.dart';

class NetworkMediaRepository extends MediaRepository {
  const NetworkMediaRepository(this.client);

  final HttpClient client;

  @override
  Future<MediaEntity?> get(String id) async {
    // @TODO: Add network interface to MediaRepository.get
    throw UnimplementedError();
  }

  @override
  Future<MediaEntityList> search(String query) async {
    // @TODO: Add network interface to MediaRepository.search
    throw UnimplementedError();
  }
}
