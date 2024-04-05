import 'dart:io';

import '../entity/list_entity.dart';
import 'impl/mock/list_repository.dart';
import 'impl/native/list_repository.dart';
import 'impl/network/list_repository.dart';

abstract class ListRepository {
  const ListRepository();

  factory ListRepository.network(HttpClient client) {
    return NetworkListRepository(client);
  }

  factory ListRepository.native() {
    return NativeListRepository();
  }

  factory ListRepository.mock() {
    return MockListRepository();
  }

  Future<ListEntity?> get(String id);
  Future<ListEntityList> getListsForUser(String userId);
}
