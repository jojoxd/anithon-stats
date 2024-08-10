import 'package:equatable/equatable.dart';
import 'package:authentication_repository/authentication_repository.dart';
import 'package:logging/logging.dart';
import 'package:user_repository/user_repository.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'authentication_state.dart';
part 'authentication_event.dart';

class AuthenticationBloc
    extends Bloc<AuthenticationEvent, AuthenticationState> {
  AuthenticationBloc({
    required AuthenticationRepository authenticationRepository,
    required UserRepository userRepository,
  })  : _authenticationRepository = authenticationRepository,
        _userRepository = userRepository,
        super(const AuthenticationState.unknown()) {
    on<AuthenticationSubscriptionRequested>(_onSubscriptionRequested);
    on<AuthenticationLogoutRequested>(_onLogoutRequested);
    on<AuthenticationEvent>(_onAuthenticationEvent);
  }

  final Logger log = Logger('AuthenticationBloc');

  final AuthenticationRepository _authenticationRepository;
  final UserRepository _userRepository;

  Future<void> _onSubscriptionRequested(
    AuthenticationSubscriptionRequested event,
    Emitter<AuthenticationState> emit,
  ) async {
    return emit.onEach(
      _authenticationRepository.status,
      onError: addError,
      onData: (status) async {
        switch (status) {
          case AuthenticationStatus.unauthenticated:
            return emit(const AuthenticationState.unauthenticated());

          case AuthenticationStatus.authenticated:
            final user = await _tryGetCurrentUser();

            if (user != null) {
              return emit(AuthenticationState.authenticated(user));
            }

            return emit(const AuthenticationState.unauthenticated());

          case AuthenticationStatus.unknown:
            return emit(const AuthenticationState.unknown());
        }
      },
    );
  }

  void _onLogoutRequested(
    AuthenticationLogoutRequested event,
    Emitter<AuthenticationState> emit,
  ) {
    _authenticationRepository.logOut();
  }

  void _onAuthenticationEvent(
    AuthenticationEvent event,
    Emitter<AuthenticationState> _,
  ) {
    log.finer(event);
  }

  Future<User?> _tryGetCurrentUser() async {
    try {
      final currentUser = await _userRepository.getCurrentUser();
      return currentUser;
    } catch (e, stackTrace) {
      log.info('Failed to get current user', e, stackTrace);
      return null;
    }
  }

  @override
  void onError(Object error, StackTrace stackTrace) {
    log.warning(
      'An error occured inside the authentication bloc',
      error,
      stackTrace,
    );

    super.onError(error, stackTrace);
  }
}
