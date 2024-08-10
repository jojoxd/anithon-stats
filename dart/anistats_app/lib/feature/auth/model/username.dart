import 'package:anistats_app/core/l10n.dart';
import 'package:flutter/material.dart';
import 'package:formz/formz.dart';

enum UsernameValidationError { empty }

class Username extends FormzInput<String, UsernameValidationError> {
  const Username.pure() : super.pure('');
  const Username.dirty([super.value = '']) : super.dirty();

  @override
  UsernameValidationError? validator(String value) {
    if (value.isEmpty) return UsernameValidationError.empty;

    return null;
  }
}

extension UsernameValidationErrorL10n on UsernameValidationError {
  String l10n(BuildContext context) {
    switch (this) {
      case UsernameValidationError.empty:
        return context.l10n.errorUsernameEmpty;
    }
  }
}
