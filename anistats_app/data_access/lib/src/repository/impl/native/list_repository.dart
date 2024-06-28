import 'dart:ffi' as ffi;

import '../../../entity/list_entity.dart';
import '../../list_repository.dart';

class NativeListRepository extends ListRepository {
  const NativeListRepository(this.library);

  final ffi.DynamicLibrary library;

  @override
  Future<ListEntity?> get(String id) async {
    // @TODO: Add native interface to ListRepository.get
    throw UnimplementedError();
  }

  @override
  Future<ListEntityList> getForUser(String userId) async {
    // @TODO: Add native interface to ListRepository.getForUser
    throw UnimplementedError();
  }
}
