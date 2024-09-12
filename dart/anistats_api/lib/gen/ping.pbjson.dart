//
//  Generated code. Do not modify.
//  source: ping.proto
//
// @dart = 2.12

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:convert' as $convert;
import 'dart:core' as $core;
import 'dart:typed_data' as $typed_data;

@$core.Deprecated('Use pingDescriptor instead')
const Ping$json = {
  '1': 'Ping',
  '2': [
    {'1': 'clientVersion', '3': 1, '4': 1, '5': 9, '10': 'clientVersion'},
  ],
};

/// Descriptor for `Ping`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List pingDescriptor = $convert.base64Decode(
    'CgRQaW5nEiQKDWNsaWVudFZlcnNpb24YASABKAlSDWNsaWVudFZlcnNpb24=');

@$core.Deprecated('Use pongDescriptor instead')
const Pong$json = {
  '1': 'Pong',
  '2': [
    {'1': 'serverVersion', '3': 1, '4': 1, '5': 9, '10': 'serverVersion'},
  ],
};

/// Descriptor for `Pong`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List pongDescriptor = $convert.base64Decode(
    'CgRQb25nEiQKDXNlcnZlclZlcnNpb24YASABKAlSDXNlcnZlclZlcnNpb24=');

