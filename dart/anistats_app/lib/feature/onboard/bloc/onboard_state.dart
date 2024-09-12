part of 'onboard_cubit.dart';

class OnboardState extends Equatable {
  static const _jsonStageKey = 'stage';

  const OnboardState({
    required this.stage,
  });

  factory OnboardState.initial() {
    return const OnboardState(
      stage: OnboardStage.initial,
    );
  }

  factory OnboardState.fromJson(Map<String, dynamic> json) {
    return OnboardState(
      stage: findStage(json[_jsonStageKey]),
    );
  }

  final OnboardStage stage;

  Map<String, dynamic> toJson() {
    return {
      _jsonStageKey: stage.stageIndex,
    };
  }

  OnboardState copyWith({
    OnboardStage? stage
  }) {
    return OnboardState(
      stage: stage ?? this.stage,
    );
  }

  @override
  List<Object?> get props => [stage];
}

OnboardStage findStage(int stageIndex) {
  return OnboardStage.values.firstWhere(
    (stage) {
      return stage.stageIndex == stageIndex;
    },
    orElse: () => OnboardStage.initial,
  );
}