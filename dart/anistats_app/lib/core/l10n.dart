import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/l10n.dart';

export 'package:flutter_gen/gen_l10n/l10n.dart' show L10n;

extension L10nX on BuildContext {
  L10n get l10n => L10n.of(this)!;
}
