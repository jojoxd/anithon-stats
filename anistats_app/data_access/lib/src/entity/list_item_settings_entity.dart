import 'package:copy_with_extension/copy_with_extension.dart';

part 'list_item_settings_entity.g.dart';

@CopyWith()
class ListItemSettingsEntity {
  const ListItemSettingsEntity({
    required this.durationMultiplier,
    required this.listOrder,
    required this.splitSequelEntry,
    this.startAtEpisode,
    this.customChunkCount,
  });

  final double durationMultiplier;

  final int listOrder;

  final bool splitSequelEntry;

  final int? startAtEpisode;

  final int? customChunkCount;
}
