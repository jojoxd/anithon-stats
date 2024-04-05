import 'package:anistats_app/module/media/service/media_service.dart';
import 'package:anistats_app/shared/layout/page_layout.dart';
import 'package:data_access/data_access.dart';
import 'package:flutter/material.dart';

class DesktopMediaDetailsPage extends StatefulWidget {
  const DesktopMediaDetailsPage({
    super.key,
    required this.mediaId,
    required this.mediaService,
  });

  final String mediaId;

  final MediaService mediaService;

  @override
  State<DesktopMediaDetailsPage> createState() =>
      _DesktopMediaDetailsPageState();
}

class _DesktopMediaDetailsPageState extends State<DesktopMediaDetailsPage> {
  late Future<MediaEntity?> mediaEntity;

  @override
  void initState() {
    super.initState();

    mediaEntity = widget.mediaService.get(widget.mediaId);
  }

  @override
  Widget build(BuildContext context) {
    return PageLayout(
      title: Text("TEST"),
      body: FutureBuilder(
        future: mediaEntity,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            var mediaEntity = snapshot.data!;
            return Text(mediaEntity.name);
          }

          return Text("Loading");
        },
      ),
    );
  }
}
