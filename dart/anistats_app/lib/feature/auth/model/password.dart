import 'package:anistats_app/core/l10n.dart';
import 'package:flutter/material.dart';
import 'package:formz/formz.dart';

enum PasswordValidationError { empty }

class Password extends FormzInput<String, PasswordValidationError> {
  const Password.pure() : super.pure('');
  const Password.dirty([super.value = '']) : super.dirty();

  @override
  PasswordValidationError? validator(String value) {
    if (value.isEmpty) return PasswordValidationError.empty;

    return null;
  }
}

extension PasswordValidationErrorL10n on PasswordValidationError {
  String l10n(BuildContext context) {
    switch (this) {
      case PasswordValidationError.empty:
        return context.l10n.errorPasswordEmpty;
    }
  }
}
