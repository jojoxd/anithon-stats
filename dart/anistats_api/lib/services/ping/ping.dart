import 'package:anistats_api/gen/ping.pbgrpc.dart' as grpc;
import 'package:grpc/grpc.dart';

import 'models.dart';

// TODO: Codegen the version into here
const kClientVersion = "develop";

class PingService {
  PingService(ClientChannel channel)
    : _client = grpc.PingServiceClient(channel);

  final grpc.PingServiceClient _client;

  Future<Pong> ping() async {
    var pong = await _client.ping(
      grpc.Ping(
        clientVersion: kClientVersion,
      ),
    );

    return Pong(
      serverVersion: pong.serverVersion,
    );
  }
}
