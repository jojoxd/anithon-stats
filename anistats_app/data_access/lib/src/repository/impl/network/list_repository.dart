import 'dart:io';

import '../../../entity/list_entity.dart';
import '../../list_repository.dart';

class NetworkListRepository extends ListRepository {
  const NetworkListRepository(this.client);

  final HttpClient client;

  @override
  Future<ListEntity?> get(String id) async {
    // @TODO: Add network interface to ListRepository.get
    throw UnimplementedError();
  }

  @override
  Future<ListEntityList> getForUser(String userId) async {
    // @TODO: Add network interface to ListRepository.getForUser
    throw UnimplementedError();
  }
}
