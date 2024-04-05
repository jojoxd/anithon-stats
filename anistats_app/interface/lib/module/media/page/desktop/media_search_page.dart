import 'package:anistats_app/shared/layout/page_layout.dart';
import 'package:data_access/data_access.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../service/media_service.dart';
import '../../widget/media_entity_grid_view.dart';

class DesktopMediaSearchPage extends StatefulWidget {
  const DesktopMediaSearchPage({
    super.key,
    required this.mediaService,
  });

  final MediaService mediaService;

  @override
  State<StatefulWidget> createState() => _DesktopMediaSearchPageState();
}

class _DesktopMediaSearchPageState extends State<DesktopMediaSearchPage> {
  MediaEntity? _selectedMediaEntity;

  Future<MediaEntityList>? _searchResponse = Future.value(
    MediaEntityList.empty(),
  );

  @override
  Widget build(BuildContext context) {
    return PageLayout(
      body: Column(
        children: [
          Container(
            margin: const EdgeInsets.all(16),
            alignment: Alignment.center,
            child: SearchBar(
              onSubmitted: _onSubmitSearch,
              onChanged: _onSubmitSearch,
              leading: Container(
                margin: EdgeInsets.all(16),
                child: const Icon(Icons.search_rounded),
              ),
              trailing: [
                FutureBuilder(
                  future: _searchResponse,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.done) {
                      return Text("");
                    }

                    var iconSize = Theme.of(context).iconTheme.size ?? 24;

                    return Container(
                      margin: const EdgeInsets.all(16),
                      child: SizedBox(
                        width: iconSize,
                        height: iconSize,
                        child: const CircularProgressIndicator(
                          strokeWidth: 2.0,
                        ),
                      ),
                    );
                  },
                )
              ],
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: FutureBuilder(
                future: _searchResponse,
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    if (snapshot.data!.isEmpty) {
                      return const Text("No Results");
                    }

                    return MediaEntityGridView(
                      items: snapshot.data!,
                      onTapItem: (mediaEntity) {
                        _onSelectMediaEntity(mediaEntity);
                      },
                      onLongPressItem: (mediaEntity) {
                        context.push('/media/${mediaEntity.id}/details');
                      },
                      isSelected: (mediaEntity) =>
                          _selectedMediaEntity?.id == mediaEntity.id,
                    );
                  }

                  return const Text("Loading");
                },
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _onPressedAdd,
        child: const Icon(Icons.add),
      ),
    );
  }

  void _onSubmitSearch(String value) {
    setState(() {
      // Use a little debounce
      _searchResponse = Future.delayed(
        const Duration(milliseconds: 500),
        () => widget.mediaService.search(value),
      );
    });
  }

  void _onPressedAdd() {
    context.pop(_selectedMediaEntity);
  }

  void _onSelectMediaEntity(MediaEntity mediaEntity) {
    setState(() {
      _selectedMediaEntity = mediaEntity;
    });
  }
}
