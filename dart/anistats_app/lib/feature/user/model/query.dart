import 'package:anistats_app/core/l10n.dart';
import 'package:flutter/material.dart';
import 'package:formz/formz.dart';

enum QueryValidationError { empty }

class Query extends FormzInput<String, QueryValidationError> {
  const Query.pure() : super.pure('');
  const Query.dirty([super.value = '']) : super.dirty();

  @override
  QueryValidationError? validator(String value) {
    if (value.isEmpty) return QueryValidationError.empty;

    return null;
  }
}

extension QueryValidationErrorL10n on QueryValidationError {
  String l10n(BuildContext context) {
    switch(this) {
      case QueryValidationError.empty:
        return context.l10n.errorQueryEmpty;
    }
  }
}
