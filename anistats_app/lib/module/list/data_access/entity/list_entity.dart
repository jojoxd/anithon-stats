import 'list_item_entity.dart';

class ListEntity {
  ListEntity({
    required this.id,
    required this.name,
    required this.items,
  });

  final String id;
  final String name;

  List<ListItemEntity> items;

  // TODO: Add List Settings
}
