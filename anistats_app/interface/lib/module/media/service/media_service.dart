import 'package:data_access/data_access.dart';

class MediaService {
  MediaService({
    required mediaRepository,
  }) : _mediaRepository = mediaRepository;

  final MediaRepository _mediaRepository;

  Future<MediaEntity?> get(String mediaId) {
    return _mediaRepository.get(mediaId);
  }

  Future<MediaEntityList> search(String query) {
    return _mediaRepository.search(query);
  }

  // @TODO: Add more business logic here
}
