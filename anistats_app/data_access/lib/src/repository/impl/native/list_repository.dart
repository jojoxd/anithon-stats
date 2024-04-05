import '../../../entity/list_entity.dart';
import '../../list_repository.dart';

class NativeListRepository extends ListRepository {
  @override
  Future<ListEntity?> get(String id) async {
    // @TODO: Add native interface to ListRepository.get
    throw UnimplementedError();
  }

  @override
  Future<ListEntityList> getListsForUser(String userId) async {
    // @TODO: Add native interface to ListRepository.getListsForUser
    throw UnimplementedError();
  }
}
