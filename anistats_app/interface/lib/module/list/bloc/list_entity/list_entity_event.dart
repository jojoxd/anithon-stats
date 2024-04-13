sealed class ListEntityEvent {}

/// Update the (display) name of a list
final class UpdateNameEvent extends ListEntityEvent {
  UpdateNameEvent({
    required this.name,
  });

  final String name;
}

/// Update the stack size setting of a list
final class UpdateStackSizeEvent extends ListEntityEvent {
  UpdateStackSizeEvent({
    required this.stackSize,
  });

  final int stackSize;
}

/// Update the allow chunk merge setting of a list
final class UpdateAllowChunkMergeEvent extends ListEntityEvent {
  UpdateAllowChunkMergeEvent({
    required this.allowChunkMerge,
  });

  final bool allowChunkMerge;
}

/// Update the max chunk join length setting of a list
final class UpdateMaxChunkJoinLengthEvent extends ListEntityEvent {
  UpdateMaxChunkJoinLengthEvent({
    required this.maxChunkJoinLength,
  });

  final Duration maxChunkJoinLength;
}

/// Update the max chunk length setting of a list
final class UpdateMaxChunkLengthEvent extends ListEntityEvent {
  UpdateMaxChunkLengthEvent({
    required this.maxChunkLength,
  });

  final Duration maxChunkLength;
}
