import 'package:data_access/data_access.dart';

/// The state of a list entity.
///
/// Dirty when edited
class ListEntityState {
  ListEntityState.initial(this.listEntity)
      : isDirty = false,
        originalListEntity = null;

  ListEntityState.dirty({
    required this.listEntity,
    required this.originalListEntity,
  }) : isDirty = true;

  final bool isDirty;

  final ListEntity listEntity;
  final ListEntity? originalListEntity;
}
