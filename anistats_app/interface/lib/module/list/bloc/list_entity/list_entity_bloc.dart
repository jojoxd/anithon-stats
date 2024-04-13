import 'package:anistats_app/module/list/service/list_service.dart';
import 'package:bloc/bloc.dart';
import 'package:data_access/data_access.dart';

import 'list_entity_event.dart';
import 'list_entity_state.dart';

class ListEntityBloc extends Bloc<ListEntityEvent, ListEntityState> {
  ListEntityBloc({
    required ListEntity listEntity,
    required this.listService,
  }) : super(ListEntityState.initial(listEntity)) {
    on<UpdateNameEvent>(_onUpdateName);
    on<UpdateStackSizeEvent>(_onUpdateStackSize);
    on<UpdateAllowChunkMergeEvent>(_onUpdateAllowChunkMergeEvent);
    on<UpdateMaxChunkJoinLengthEvent>(_onUpdateMaxChunkJoinLengthEvent);
    on<UpdateMaxChunkLengthEvent>(_onUpdateMaxChunkLengthEvent);
  }

  final ListService listService;

  void _onUpdateName(UpdateNameEvent event, Emitter<ListEntityState> emit) {
    emit(
      ListEntityState.dirty(
        listEntity: state.listEntity.copyWith(
          name: event.name,

          // Also copy settings so references are updated
          settings: state.listEntity.settings.copyWith(),
        ),
        originalListEntity: state.listEntity,
      ),
    );
  }

  void _onUpdateStackSize(
    UpdateStackSizeEvent event,
    Emitter<ListEntityState> emit,
  ) {
    emit(
      ListEntityState.dirty(
        listEntity: state.listEntity.copyWith(
          settings: state.listEntity.settings.copyWith(
            stackSize: event.stackSize,
          ),
        ),
        originalListEntity: state.listEntity,
      ),
    );
  }

  void _onUpdateAllowChunkMergeEvent(
    UpdateAllowChunkMergeEvent event,
    Emitter<ListEntityState> emit,
  ) {
    emit(
      ListEntityState.dirty(
        listEntity: state.listEntity.copyWith(
          settings: state.listEntity.settings.copyWith(
            allowChunkMerge: event.allowChunkMerge,
          ),
        ),
        originalListEntity: state.listEntity,
      ),
    );
  }

  void _onUpdateMaxChunkJoinLengthEvent(
    UpdateMaxChunkJoinLengthEvent event,
    Emitter<ListEntityState> emit,
  ) {
    emit(
      ListEntityState.dirty(
        listEntity: state.listEntity.copyWith(
          settings: state.listEntity.settings.copyWith(
            maxChunkJoinLength: event.maxChunkJoinLength,
          ),
        ),
        originalListEntity: state.listEntity,
      ),
    );
  }

  void _onUpdateMaxChunkLengthEvent(
    UpdateMaxChunkLengthEvent event,
    Emitter<ListEntityState> emit,
  ) {
    emit(
      ListEntityState.dirty(
        listEntity: state.listEntity.copyWith(
          settings: state.listEntity.settings.copyWith(
            maxChunkLength: event.maxChunkLength,
          ),
        ),
        originalListEntity: state.listEntity,
      ),
    );
  }
}
