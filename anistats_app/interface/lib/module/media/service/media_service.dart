import 'package:anistats_app/module/media/data_access/entity/media_entity.dart';

class MediaService {
  Future<List<MediaEntity>> search(String query) async {
    // @DEBUG: Simulate network activity
    await Future.delayed(const Duration(milliseconds: 800));

    return List<MediaEntity>.generate(
      10,
      (index) {
        return MediaEntity(
          id: index.toString(),
          name: "Media ${index.toString()}",
        );
      },
    );
  }

  Future<MediaEntity?> fetch(String mediaId) async {
    await Future.delayed(const Duration(milliseconds: 650));

    return MediaEntity(
      id: mediaId,
      name: "Media $mediaId",
    );
  }
}
