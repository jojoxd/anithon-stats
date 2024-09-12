import 'package:formz/formz.dart';

enum InsecureValidationError {
  none,
}

class Insecure extends FormzInput<bool, InsecureValidationError> {
  const Insecure.pure(bool? initial) : super.pure(initial ?? false);
  const Insecure.dirty([super.value = false]) : super.dirty();

  @override
  InsecureValidationError? validator(bool value) {
    return null;
  }
}