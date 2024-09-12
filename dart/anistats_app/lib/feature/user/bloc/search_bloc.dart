import 'package:anistats_api/anistats_api.dart';
import 'package:anistats_app/core/bloc/transformer/debounce.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:formz/formz.dart';
import 'package:logging/logging.dart';

import '../model/model.dart';

part 'search_state.dart';
part 'search_event.dart';

class SearchBloc extends Bloc<SearchEvent, SearchState> {
  SearchBloc({
    required UserService userService
  }) : _userService = userService,
       super(SearchState()) {
    on<SearchQueryChanged>(_onQueryChanged);
    on<SearchSubmitted>(
      _onSubmitted,
      transformer: debounce(
          const Duration(milliseconds: 500),
      ),
    );
  }

  final Logger log = Logger('SearchBloc/Users');

  final UserService _userService;

  void _onQueryChanged(
    SearchQueryChanged event,
    Emitter<SearchState> emit,
  ) {
    final query = Query.dirty(event.query);

    return emit(state.copyWith(query: query));
  }

  Future<void> _onSubmitted(
    SearchSubmitted event,
    Emitter<SearchState> emit,
  ) async {
    if (!state.isValid) {
      return;
    }

    emit(state.copyWith(status: FormzSubmissionStatus.inProgress));

    try {
      var users = await _userService.search(state.query.value);

      log.info(users);

      emit(
        state.copyWith(
          status: FormzSubmissionStatus.success,
          users: users,
        ),
      );
    } catch(e) {
      log.warning(e);

      emit(state.copyWith(status: FormzSubmissionStatus.failure));
    }
  }
}