part of 'search_bloc.dart';

final class SearchState extends Equatable {
  SearchState({
    this.status = FormzSubmissionStatus.initial,
    this.query = const Query.pure(),
    List<User>? users,
  }) : users = users ?? List.empty();

  final FormzSubmissionStatus status;
  final Query query;
  final List<User> users;

  bool get isValid => Formz.validate([query]);

  SearchState copyWith({
    FormzSubmissionStatus? status,
    Query? query,
    List<User>? users,
  }) {
    return SearchState(
      status: status ?? this.status,
      query: query ?? this.query,
      users: users ?? this.users,
    );
  }

  @override
  List<Object?> get props => [status, query];
}