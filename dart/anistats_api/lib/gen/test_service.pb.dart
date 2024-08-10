//
//  Generated code. Do not modify.
//  source: test_service.proto
//
// @dart = 2.12

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:async' as $async;
import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

import 'test.pb.dart' as $0;

class TestApi {
  $pb.RpcClient _client;
  TestApi(this._client);

  $async.Future<$0.HelloReply> hello($pb.ClientContext? ctx, $0.HelloRequest request) =>
    _client.invoke<$0.HelloReply>(ctx, 'Test', 'Hello', request, $0.HelloReply())
  ;
}

