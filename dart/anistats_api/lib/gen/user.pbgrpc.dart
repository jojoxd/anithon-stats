//
//  Generated code. Do not modify.
//  source: user.proto
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

import 'user.pb.dart' as $1;

export 'user.pb.dart';

@$pb.GrpcServiceName('anistats.user.UserService')
class UserServiceClient extends $grpc.Client {
  static final _$profile = $grpc.ClientMethod<$1.UserIdentifier, $1.Profile>(
      '/anistats.user.UserService/Profile',
      ($1.UserIdentifier value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $1.Profile.fromBuffer(value));
  static final _$search = $grpc.ClientMethod<$1.SearchRequest, $1.SearchResponse>(
      '/anistats.user.UserService/Search',
      ($1.SearchRequest value) => value.writeToBuffer(),
      ($core.List<$core.int> value) => $1.SearchResponse.fromBuffer(value));

  UserServiceClient($grpc.ClientChannel channel,
      {$grpc.CallOptions? options,
      $core.Iterable<$grpc.ClientInterceptor>? interceptors})
      : super(channel, options: options,
        interceptors: interceptors);

  $grpc.ResponseFuture<$1.Profile> profile($1.UserIdentifier request, {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$profile, request, options: options);
  }

  $grpc.ResponseFuture<$1.SearchResponse> search($1.SearchRequest request, {$grpc.CallOptions? options}) {
    return $createUnaryCall(_$search, request, options: options);
  }
}

@$pb.GrpcServiceName('anistats.user.UserService')
abstract class UserServiceBase extends $grpc.Service {
  $core.String get $name => 'anistats.user.UserService';

  UserServiceBase() {
    $addMethod($grpc.ServiceMethod<$1.UserIdentifier, $1.Profile>(
        'Profile',
        profile_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $1.UserIdentifier.fromBuffer(value),
        ($1.Profile value) => value.writeToBuffer()));
    $addMethod($grpc.ServiceMethod<$1.SearchRequest, $1.SearchResponse>(
        'Search',
        search_Pre,
        false,
        false,
        ($core.List<$core.int> value) => $1.SearchRequest.fromBuffer(value),
        ($1.SearchResponse value) => value.writeToBuffer()));
  }

  $async.Future<$1.Profile> profile_Pre($grpc.ServiceCall call, $async.Future<$1.UserIdentifier> request) async {
    return profile(call, await request);
  }

  $async.Future<$1.SearchResponse> search_Pre($grpc.ServiceCall call, $async.Future<$1.SearchRequest> request) async {
    return search(call, await request);
  }

  $async.Future<$1.Profile> profile($grpc.ServiceCall call, $1.UserIdentifier request);
  $async.Future<$1.SearchResponse> search($grpc.ServiceCall call, $1.SearchRequest request);
}
