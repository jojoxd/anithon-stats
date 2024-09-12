import 'package:equatable/equatable.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';

import '../model/onboard_stage.dart';

part 'onboard_state.dart';

class OnboardCubit extends HydratedCubit<OnboardState> {
  OnboardCubit() : super(OnboardState.initial());

  void advanceState() {
    emit(state.copyWith(
      stage: state.stage.next(),
    ));
  }

  @override
  OnboardState? fromJson(Map<String, dynamic> json) {
    return OnboardState.fromJson(json);
  }

  @override
  Map<String, dynamic>? toJson(OnboardState state) {
    return state.toJson();
  }
}
