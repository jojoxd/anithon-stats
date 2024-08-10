//
//  Generated code. Do not modify.
//  source: test_service.proto
//
// @dart = 2.12

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:convert' as $convert;
import 'dart:core' as $core;
import 'dart:typed_data' as $typed_data;

import 'test.pbjson.dart' as $0;

const $core.Map<$core.String, $core.dynamic> TestServiceBase$json = {
  '1': 'Test',
  '2': [
    {'1': 'Hello', '2': '.test.HelloRequest', '3': '.test.HelloReply'},
  ],
};

@$core.Deprecated('Use testServiceDescriptor instead')
const $core.Map<$core.String, $core.Map<$core.String, $core.dynamic>> TestServiceBase$messageJson = {
  '.test.HelloRequest': $0.HelloRequest$json,
  '.test.HelloReply': $0.HelloReply$json,
};

/// Descriptor for `Test`. Decode as a `google.protobuf.ServiceDescriptorProto`.
final $typed_data.Uint8List testServiceDescriptor = $convert.base64Decode(
    'CgRUZXN0Ei0KBUhlbGxvEhIudGVzdC5IZWxsb1JlcXVlc3QaEC50ZXN0LkhlbGxvUmVwbHk=');

