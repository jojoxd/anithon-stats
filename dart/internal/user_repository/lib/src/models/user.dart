import 'package:equatable/equatable.dart';

class User extends Equatable {
  const User(this.id);

  final String id;

  // TODO Not hardcoded
  String get avatar {
    return 'https://s4.anilist.co/file/anilistcdn/user/avatar/large/b141428-e3ZauYztX2tf.gif';
  }

  @override
  List<Object?> get props => [id];

  // TODO I dislike using id = '-'
  static const empty = User('-');
}
