import 'package:anistats_app/core/l10n.dart';
import 'package:flutter/material.dart';
import 'package:formz/formz.dart';

enum HostValidationError {
  empty,
}

class Host extends FormzInput<String, HostValidationError> {
  const Host.pure(String? initial) : super.pure(initial ?? '');
  const Host.dirty([super.value = '']) : super.dirty();

  @override
  HostValidationError? validator(String value) {
    if (value.isEmpty) return HostValidationError.empty;

    return null;
  }
}

extension HostValidationErrorL10n on HostValidationError {
  String l10n(BuildContext context) {
    switch(this) {
      case HostValidationError.empty:
        return context.l10n.errorHostEmpty;
    }
  }
}