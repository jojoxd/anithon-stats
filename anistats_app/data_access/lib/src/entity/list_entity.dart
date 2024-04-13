import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:equatable/equatable.dart';
import 'package:uuid/uuid.dart';

import 'list_item_entity.dart';
import 'list_settings_entity.dart';

part 'list_entity.g.dart';

typedef ListEntityList = List<ListEntity>;

@CopyWith()
class ListEntity with EquatableMixin {
  ListEntity({
    required this.id,
    required this.name,
    required this.items,
    required this.settings,
  });

  @CopyWithField(immutable: true)
  final UuidValue id;

  final String name;

  final ListItemEntityList items;

  final ListSettingsEntity settings;

  @override
  String toString() {
    return "ListEntity '$name' { id = '${id.uuid}' }";
  }

  @override
  List<Object?> get props => [id];
}
