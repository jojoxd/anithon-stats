enum OnboardStage {
  initial(0),
  transport(1),
  login(2),
  import(3),
  done(4);

  const OnboardStage(this.stageIndex);

  final int stageIndex;

  OnboardStage next() {
    return OnboardStage.values.firstWhere(
      (stage) {
        return stage.stageIndex == (stageIndex + 1);
      },
      orElse: () => OnboardStage.done,
    );
  }
}

