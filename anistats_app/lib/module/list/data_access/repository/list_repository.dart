import '../entity/list_entity.dart';
import '../entity/list_item_entity.dart';

class ListRepository {
  // @TODO: Future<ListEntity?>
  Future<ListEntity> getList(String listId) async {
    await Future.delayed(const Duration(milliseconds: 150), () => "AAAA");

    return ListEntity(
      id: listId,
      name: "Test ($listId)",
      items: List<ListItemEntity>.generate(
        10,
        (index) {
          return ListItemEntity(
            id: index.toString(),
            mediaId: index.toString(),
          );
        },
      ),
    );
  }

  Future<List<ListEntity>> getLists() async {
    await Future.delayed(const Duration(milliseconds: 2500), () => "AAAA");

    return Future.wait(
      List.generate(10, (index) {
        return getList(index.toString());
      }),
    );
  }
}
