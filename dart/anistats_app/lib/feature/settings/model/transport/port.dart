import 'package:anistats_app/core/l10n.dart';
import 'package:flutter/material.dart';
import 'package:formz/formz.dart';

enum PortValidationError {
  empty,
  invalid,
  invalidNumber,
}

class Port extends FormzInput<String, PortValidationError> {
  const Port.pure(String? initial) : super.pure(initial ?? '8008');
  const Port.dirty([super.value = '8008']) : super.dirty();

  @override
  PortValidationError? validator(String value) {
    if (value.isEmpty) return PortValidationError.empty;

    var intval = int.tryParse(value);

    if (intval == null) return PortValidationError.invalidNumber;
    if (intval <= 0) return PortValidationError.invalid;
    if (intval > 65536) return PortValidationError.invalid;

    return null;
  }
}

extension PortValidationErrorL10n on PortValidationError {
  String l10n(BuildContext context) {
    switch(this) {
      case PortValidationError.empty:
        return context.l10n.errorPortEmpty;

      case PortValidationError.invalid:
        return context.l10n.errorPortInvalid;

      case PortValidationError.invalidNumber:
        return context.l10n.errorPortNotANumber;
    }
  }
}