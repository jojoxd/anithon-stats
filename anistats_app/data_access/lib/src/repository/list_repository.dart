import 'dart:io';

import '../entity/list_entity.dart';
import 'impl/mock/list_repository.dart';
import 'impl/native/list_repository.dart';
import 'impl/network/list_repository.dart';

abstract class ListRepository {
  const ListRepository();

  factory ListRepository.mock() {
    return MockListRepository();
  }

  factory ListRepository.native() {
    return NativeListRepository();
  }

  factory ListRepository.network(HttpClient client) {
    return NetworkListRepository(client);
  }

  Future<ListEntity?> get(String id);

  Future<ListEntityList> getForUser(String userId);
}
