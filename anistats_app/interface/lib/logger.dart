import 'package:logger/logger.dart';

class LogfmtWithSourcePrinter extends LogfmtPrinter {
  static final _formatStackTrace = RegExp(r'#[0-9]+\s+(.+) \((\S+)\)');

  final PrettyPrinter _prettyPrinter = PrettyPrinter(
    excludePaths: [
      'package:anistats_app/logger.dart',
    ],
  );

  @override
  List<String> log(LogEvent event) {
    String sourceFrame = _getSourceFrame(StackTrace.current);

    if (event.message is String) {
      // Clone event, but make it a map
      return super.log(
        LogEvent(
          event.level,
          <String, String>{
            'msg': event.message,
            'src': sourceFrame,
            'time': event.time.toIso8601String(),
          },
          error: event.error,
          stackTrace: event.stackTrace,
          time: event.time,
        ),
      );
    } else if (event.message is Map) {
      // Just append to the map
      event.message['src'] = sourceFrame;
      event.message['time'] = event.time.toIso8601String();
    }

    return super.log(event);
  }

  String _getSourceFrame(StackTrace stackTrace) {
    String source = _prettyPrinter.formatStackTrace(StackTrace.current, 1)!;

    var matches = _formatStackTrace.firstMatch(source);

    if (matches == null) {
      return source;
    }

    return matches[2] ?? source;
  }
}
