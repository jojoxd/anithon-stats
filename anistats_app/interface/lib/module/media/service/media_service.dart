import 'package:data_access/data_access.dart';
import 'package:logger/logger.dart';

class MediaService {
  MediaService({
    required mediaRepository,
    required logger,
  })  : _mediaRepository = mediaRepository,
        _logger = logger;

  final Logger _logger;
  final MediaRepository _mediaRepository;

  Future<MediaEntity?> get(String mediaId) {
    _logger.i({
      'msg': "Fetch MediaEntity",
      'mediaId': mediaId,
    });

    return _mediaRepository.get(mediaId);
  }

  Future<MediaEntityList> search(String query) {
    _logger.i({
      'msg': "Search MediaEntities",
      'query': query,
    });

    return _mediaRepository.search(query);
  }

  // @TODO: Add more business logic here
}
