import 'package:data_access/src/entity/list_item_entity.dart';
import 'package:uuid/uuid.dart';

typedef ListEntityList = List<ListEntity>;

class ListEntity {
  ListEntity({
    required this.id,
    required this.name,
    required this.items,
  });

  final UuidValue id;
  final String name;
  final ListItemEntityList items;

  @override
  String toString() {
    return "ListEntity '$name' { id = '${id.uuid}' }";
  }
}
