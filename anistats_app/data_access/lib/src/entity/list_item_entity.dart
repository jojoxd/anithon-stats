import 'package:copy_with_extension/copy_with_extension.dart';
import 'package:data_access/src/entity/list_item_settings_entity.dart';
import 'package:data_access/src/enum/list_item_state.dart';
import 'package:equatable/equatable.dart';
import 'package:uuid/uuid.dart';

part 'list_item_entity.g.dart';

typedef ListItemEntityList = List<ListItemEntity>;

@CopyWith()
class ListItemEntity with EquatableMixin {
  ListItemEntity({
    required this.id,
    required this.mediaId,
    required this.state,
    required this.settings,
  });

  // factory ListItemEntity.fromJson() {}

  @CopyWithField(immutable: true)
  final UuidValue id;

  @CopyWithField(immutable: true)
  final UuidValue mediaId;

  final ListItemState state;

  final ListItemSettingsEntity settings;

  @override
  String toString() {
    return "ListItemEntity '${id.uuid}' { mediaId = '${mediaId.uuid}' }";
  }

  @override
  List<Object?> get props => [id];
}
