import 'package:uuid/uuid.dart';

typedef ListItemEntityList = List<ListItemEntity>;

class ListItemEntity {
  ListItemEntity({
    required this.id,
    required this.mediaId,
  });

  final UuidValue id;
  final UuidValue mediaId;

  @override
  String toString() {
    return "ListItemEntity '${id.uuid}' { mediaId = '${mediaId.uuid}' }";
  }
}
