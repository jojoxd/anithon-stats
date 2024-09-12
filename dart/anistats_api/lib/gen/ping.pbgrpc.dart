//
//  Generated code. Do not modify.
//  source: ping.proto
//
// @dart = 2.12

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:async' as $async;
import 'dart:core' as $core;

import 'package:grpc/service_api.dart' as $grpc;
import 'package:protobuf/protobuf.dart' as $pb;

import 'ping.pb.dart' as $0;

export 'ping.pb.dart';

@$pb.GrpcServiceName('anistats.ping.PingService')
class PingServiceClient extends $grpc.Client {
  static final _$ping = $grpc.ClientMethod<$0.Ping, $0.Pong>(
      '/anistats.ping.PingService/Ping',
      ($0.Ping value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $0.Pong.fromBuffer(value));

  PingServiceClient($grpc.ClientChannel channel,
      {$grpc.CallOptions? options,
      $core.Iterable<$grpc.ClientInterceptor>? interceptors})
      : super(channel, options: options,
        interceptors: interceptors);

  $grpc.ResponseFuture<$0.Pong> ping($0.Ping request, {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$ping, request, options: options);
  }
}

@$pb.GrpcServiceName('anistats.ping.PingService')
abstract class PingServiceBase extends $grpc.Service {
  $core.String get $name => 'anistats.ping.PingService';

  PingServiceBase() {
    $addMethod($grpc.ServiceMethod<$0.Ping, $0.Pong>(
        'Ping',
        ping_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $0.Ping.fromBuffer(value),
        ($0.Pong value) => value.writeToBuffer()));
  }

  $async.Future<$0.Pong> ping_Pre($grpc.ServiceCall call, $async.Future<$0.Ping> request) async {
    return ping(call, await request);
  }

  $async.Future<$0.Pong> ping($grpc.ServiceCall call, $0.Ping request);
}
