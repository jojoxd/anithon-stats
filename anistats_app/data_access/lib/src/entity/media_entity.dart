import 'package:uuid/uuid.dart';

typedef MediaEntityList = List<MediaEntity>;

class MediaEntity {
  MediaEntity({
    required this.id,
    required this.anilistId,
    required this.name,
  });

  final UuidValue id;
  final int anilistId;

  // @TODO: Change to translatable
  final String name;

  @override
  String toString() {
    return "MediaEntity '$name' { id = '${id.uuid}', anilistId = '$anilistId' }";
  }
}
