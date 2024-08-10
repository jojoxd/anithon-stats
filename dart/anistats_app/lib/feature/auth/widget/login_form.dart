import 'package:anistats_app/core/l10n.dart';
import 'package:anistats_app/feature/routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:formz/formz.dart';

import '../bloc/login_bloc.dart';
import '../model/model.dart';

class LoginForm extends StatelessWidget {
  const LoginForm({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocListener<LoginBloc, LoginState>(
      listener: (context, state) {
        switch (state.status) {
          case FormzSubmissionStatus.failure:
            _authFailureMessage(context);

          case FormzSubmissionStatus.success:
            return HomeRoute().go(context);

          default: // noop
        }
      },
      child: const Align(
        alignment: Alignment(0, -1 / 3),
        child: Column(
          children: [
            _UsernameInput(),
            Padding(
              padding: EdgeInsets.all(12),
            ),
            _PasswordInput(),
            const Padding(
              padding: EdgeInsets.all(12),
            ),
            _LoginButton(),
          ],
        ),
      ),
    );
  }

  void _authFailureMessage(BuildContext context) {
    var messenger = ScaffoldMessenger.of(context);

    messenger.hideCurrentSnackBar();

    var snackBar = SnackBar(
      content: Text(context.l10n.authenticationFailure),
    );
    messenger.showSnackBar(snackBar);
  }
}

class _UsernameInput extends StatelessWidget {
  const _UsernameInput();

  @override
  Widget build(BuildContext context) {
    final displayError = context.select(
      (LoginBloc bloc) => bloc.state.username.displayError,
    );

    return TextField(
      key: const Key('loginForm_usernameInput_textField'),
      onChanged: (value) {
        context.read<LoginBloc>().add(LoginUsernameChanged(value));
      },
      decoration: InputDecoration(
        labelText: context.l10n.username,
        errorText: displayError?.l10n(context),
      ),
    );
  }
}

class _PasswordInput extends StatelessWidget {
  const _PasswordInput();

  @override
  Widget build(BuildContext context) {
    final displayError = context.select(
      (LoginBloc bloc) => bloc.state.password.displayError,
    );

    return TextField(
      key: const Key('loginForm_passwordInput_textField'),
      onChanged: (value) {
        context.read<LoginBloc>().add(LoginPasswordChanged(value));
      },
      obscureText: true,
      decoration: InputDecoration(
        labelText: context.l10n.password,
        errorText: displayError?.l10n(context),
      ),
    );
  }
}

class _LoginButton extends StatelessWidget {
  const _LoginButton();

  @override
  Widget build(BuildContext context) {
    final LoginState state = context.select(
      (LoginBloc bloc) => bloc.state,
    );

    final isInProgressOrSuccess = state.status.isInProgressOrSuccess;
    final isValid = state.isValid;

    return Row(
      children: [
        const Spacer(),
        if (isInProgressOrSuccess)
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 8.0),
            child: SizedBox.square(
              dimension: 16.0,
              child: CircularProgressIndicator(
                strokeWidth: 2.0,
              ),
            ),
          ),
        ElevatedButton.icon(
          onPressed: !isInProgressOrSuccess && isValid
              ? () => context.read<LoginBloc>().add(const LoginSubmitted())
              : null,
          icon: const Icon(Icons.login),
          label: Text(context.l10n.login),
        ),
      ],
    );
  }
}
