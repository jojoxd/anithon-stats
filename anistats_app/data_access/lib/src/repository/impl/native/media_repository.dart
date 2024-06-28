import 'dart:ffi' as ffi;

import '../../../entity/media_entity.dart';
import '../../media_repository.dart';

typedef ffi_test_media_get = ffi.Void Function();
typedef test_media_get = void Function();

class NativeMediaRepository extends MediaRepository {
  const NativeMediaRepository(this.library);

  final ffi.DynamicLibrary library;

  test_media_get get _ffiTestMediaGet {
    return library
        .lookup<ffi.NativeFunction<ffi_test_media_get>>("ffi_test_get_media")
        .asFunction();
  }

  @override
  Future<MediaEntity?> get(String id) async {
    _ffiTestMediaGet();

    // @TODO: Add native interface to MediaRepository.get
    throw UnimplementedError();
  }

  @override
  Future<MediaEntityList> search(String query) async {
    _ffiTestMediaGet();
    // @TODO: Add native interface to MediaRepository.search
    throw UnimplementedError();
  }
}
