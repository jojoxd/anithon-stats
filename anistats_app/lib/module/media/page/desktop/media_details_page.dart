import 'package:anistats_app/module/media/service/media_service.dart';
import 'package:anistats_app/shared/layout/page_layout.dart';
import 'package:flutter/material.dart';

import '../../data_access/entity/media_entity.dart';

class DesktopMediaDetailsPage extends StatefulWidget {
  DesktopMediaDetailsPage({super.key, required this.mediaId});

  final String mediaId;

  final MediaService mediaService = MediaService();

  @override
  State<DesktopMediaDetailsPage> createState() =>
      _DesktopMediaDetailsPageState();
}

class _DesktopMediaDetailsPageState extends State<DesktopMediaDetailsPage> {
  late Future<MediaEntity?> mediaEntity;

  @override
  void initState() {
    super.initState();

    mediaEntity = widget.mediaService.fetch(widget.mediaId);
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
