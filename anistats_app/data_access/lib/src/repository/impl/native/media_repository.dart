import '../../../entity/media_entity.dart';
import '../../media_repository.dart';

class NativeMediaRepository extends MediaRepository {
  @override
  Future<MediaEntity?> get(String id) async {
    // @TODO: Add native interface to MediaRepository.get
    throw UnimplementedError();
  }

  @override
  Future<MediaEntityList> search(String query) async {
    // @TODO: Add native interface to MediaRepository.search
    throw UnimplementedError();
  }
}
