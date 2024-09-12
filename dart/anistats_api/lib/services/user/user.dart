import 'package:anistats_api/gen/user.pbgrpc.dart' as grpc;
import 'package:anistats_api/gen/ext/uuid.pb.dart' as ext;
import 'package:grpc/grpc.dart';
import 'package:uuid/uuid.dart';

import 'models.dart';

class UserService {
  UserService(ClientChannel channel)
      : _client = grpc.UserServiceClient(channel);

  final grpc.UserServiceClient _client;

  Future<Profile> profile(UuidValue id) async {
    var profile = await _client.profile(
      grpc.UserIdentifier(id: ext.Uuid(id: id.uuid)),
    );

    return Profile(
      user: User(
        id: UuidValue.fromString(profile.user.id.id),
        name: profile.user.name,
        joinedAt: profile.user.joinedAt.toDateTime(),
      ),
    );
  }

  Future<List<User>> search(String query) async {
    var req = grpc.SearchRequest(
      query: query,
    );
    
    var res = await _client.search(req);
    
    return res.users.users.map<User>((user) => User(
      id: UuidValue.fromString(user.id.id),
      name: user.name,
      joinedAt: user.joinedAt.toDateTime(),
    )).toList();
  }
}
