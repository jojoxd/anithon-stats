import 'package:copy_with_extension/copy_with_extension.dart';

part 'list_settings_entity.g.dart';

@CopyWith()
class ListSettingsEntity {
  const ListSettingsEntity({
    required this.allowChunkMerge,
    required this.maxChunkLength,
    required this.maxChunkJoinLength,
    required this.stackSize,
  });

  final bool allowChunkMerge;
  final Duration maxChunkLength;
  final Duration maxChunkJoinLength;
  final int stackSize;
}
