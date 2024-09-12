part of 'search_bloc.dart';

sealed class SearchEvent extends Equatable {
  const SearchEvent();

  @override
  // TODO: implement props
  List<Object?> get props => [];
}

final class SearchQueryChanged extends SearchEvent {
  const SearchQueryChanged(this.query);

  final String query;

  @override
  // TODO: implement props
  List<Object?> get props => [query];
}

final class SearchSubmitted extends SearchEvent {
  const SearchSubmitted();
}
