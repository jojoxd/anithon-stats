//
//  Generated code. Do not modify.
//  source: user.proto
//
// @dart = 2.12

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:convert' as $convert;
import 'dart:core' as $core;
import 'dart:typed_data' as $typed_data;

@$core.Deprecated('Use userDescriptor instead')
const User$json = {
  '1': 'User',
  '2': [
    {'1': 'id', '3': 1, '4': 1, '5': 11, '6': '.anistats.ext.Uuid', '10': 'id'},
    {'1': 'name', '3': 2, '4': 1, '5': 9, '10': 'name'},
    {'1': 'joined_at', '3': 3, '4': 1, '5': 11, '6': '.google.protobuf.Timestamp', '10': 'joinedAt'},
  ],
};

/// Descriptor for `User`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List userDescriptor = $convert.base64Decode(
    'CgRVc2VyEiIKAmlkGAEgASgLMhIuYW5pc3RhdHMuZXh0LlV1aWRSAmlkEhIKBG5hbWUYAiABKA'
    'lSBG5hbWUSNwoJam9pbmVkX2F0GAMgASgLMhouZ29vZ2xlLnByb3RvYnVmLlRpbWVzdGFtcFII'
    'am9pbmVkQXQ=');

@$core.Deprecated('Use userIdentifierDescriptor instead')
const UserIdentifier$json = {
  '1': 'UserIdentifier',
  '2': [
    {'1': 'id', '3': 1, '4': 1, '5': 11, '6': '.anistats.ext.Uuid', '10': 'id'},
  ],
};

/// Descriptor for `UserIdentifier`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List userIdentifierDescriptor = $convert.base64Decode(
    'Cg5Vc2VySWRlbnRpZmllchIiCgJpZBgBIAEoCzISLmFuaXN0YXRzLmV4dC5VdWlkUgJpZA==');

@$core.Deprecated('Use profileDescriptor instead')
const Profile$json = {
  '1': 'Profile',
  '2': [
    {'1': 'user', '3': 1, '4': 1, '5': 11, '6': '.anistats.user.User', '10': 'user'},
  ],
};

/// Descriptor for `Profile`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List profileDescriptor = $convert.base64Decode(
    'CgdQcm9maWxlEicKBHVzZXIYASABKAsyEy5hbmlzdGF0cy51c2VyLlVzZXJSBHVzZXI=');

@$core.Deprecated('Use usersDescriptor instead')
const Users$json = {
  '1': 'Users',
  '2': [
    {'1': 'users', '3': 1, '4': 3, '5': 11, '6': '.anistats.user.User', '10': 'users'},
  ],
};

/// Descriptor for `Users`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List usersDescriptor = $convert.base64Decode(
    'CgVVc2VycxIpCgV1c2VycxgBIAMoCzITLmFuaXN0YXRzLnVzZXIuVXNlclIFdXNlcnM=');

@$core.Deprecated('Use searchRequestDescriptor instead')
const SearchRequest$json = {
  '1': 'SearchRequest',
  '2': [
    {'1': 'query', '3': 1, '4': 1, '5': 9, '10': 'query'},
  ],
};

/// Descriptor for `SearchRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List searchRequestDescriptor = $convert.base64Decode(
    'Cg1TZWFyY2hSZXF1ZXN0EhQKBXF1ZXJ5GAEgASgJUgVxdWVyeQ==');

@$core.Deprecated('Use searchResponseDescriptor instead')
const SearchResponse$json = {
  '1': 'SearchResponse',
  '2': [
    {'1': 'users', '3': 1, '4': 1, '5': 11, '6': '.anistats.user.Users', '10': 'users'},
  ],
};

/// Descriptor for `SearchResponse`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List searchResponseDescriptor = $convert.base64Decode(
    'Cg5TZWFyY2hSZXNwb25zZRIqCgV1c2VycxgBIAEoCzIULmFuaXN0YXRzLnVzZXIuVXNlcnNSBX'
    'VzZXJz');

