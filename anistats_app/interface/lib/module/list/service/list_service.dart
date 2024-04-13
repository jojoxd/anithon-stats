import 'package:data_access/data_access.dart';

import '../bloc/list_entity/list_entity_bloc.dart';

class ListService {
  ListService({
    required ListRepository listRepository,
  }) : _listRepository = listRepository;

  final ListRepository _listRepository;

  Future<ListEntityBloc?> get(String id) async {
    // @TODO: Caching + invalidation, LRU? Max timeout?

    ListEntity? listEntity = await _listRepository.get(id);

    if (listEntity == null) {
      return null;
    }

    return ListEntityBloc(
      listEntity: listEntity,
      listService: this,
    );
  }

  Future<ListEntityList> getForUser(String userId) {
    return _listRepository.getForUser(userId);
  }
}
