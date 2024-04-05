import 'package:data_access/src/entity/list_item_entity.dart';
import 'package:uuid/uuid.dart';

import '../../../entity/list_entity.dart';
import '../../list_repository.dart';
import '../mock_repository_mixin.dart';

class MockListRepository extends ListRepository with MockRepositoryMixin {
  @override
  Future<ListEntity?> get(String id) async {
    await simulateNetworkDelay();

    if (random.nextInt(100) > 90) {
      return null;
    }

    return ListEntity(
      id: UuidValue.fromString(id),
      name: 'List ($id)',
      items: _generateRandomItems(),
    );
  }

  @override
  Future<ListEntityList> getListsForUser(String userId) async {
    await simulateNetworkDelay();

    return ListEntityList.generate(
      10,
      (index) {
        var id = Uuid().v7obj();

        return ListEntity(
          id: id,
          name: "List (${id.uuid})",
          items: _generateRandomItems(),
        );
      },
    );
  }

  ListItemEntityList _generateRandomItems() {
    return ListItemEntityList.generate(10, (index) {
      return ListItemEntity(
        id: Uuid().v7obj(),
        mediaId: Uuid().v7obj(),
      );
    });
  }
}
