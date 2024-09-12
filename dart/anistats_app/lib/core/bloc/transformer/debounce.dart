import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:stream_transform/stream_transform.dart';

EventTransformer<Event> debounce<Event>(Duration duration) {
  return (events, mapper) {
    return events
        .debounce(duration)
        .switchMap(mapper)
    ;
  };
}