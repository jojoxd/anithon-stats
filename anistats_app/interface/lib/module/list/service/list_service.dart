import 'package:data_access/data_access.dart';

class ListService {
  ListService({
    required ListRepository listRepository,
  }) : _listRepository = listRepository;

  final ListRepository _listRepository;

  Future<ListEntity?> get(String id) {
    return _listRepository.get(id);
  }

  Future<ListEntityList> getListsForUser(String userId) {
    return _listRepository.getListsForUser(userId);
  }
}
