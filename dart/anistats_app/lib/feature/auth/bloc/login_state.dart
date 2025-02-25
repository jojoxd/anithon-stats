part of 'login_bloc.dart';

final class LoginState extends Equatable {
  const LoginState({
    this.status = FormzSubmissionStatus.initial,
    this.username = const Username.pure(),
    this.password = const Password.pure(),
  });

  final FormzSubmissionStatus status;
  final Username username;
  final Password password;

  bool get isValid => Formz.validate([username, password]);

  LoginState copyWith({
    FormzSubmissionStatus? status,
    Username? username,
    Password? password,
  }) {
    return LoginState(
      status: status ?? this.status,
      username: username ?? this.username,
      password: password ?? this.password,
    );
  }

  @override
  List<Object?> get props => [username, password, status];
}
