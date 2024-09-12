import 'package:anistats_api/anistats_api.dart';
import 'package:anistats_app/core/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:formz/formz.dart';

import '../bloc/search_bloc.dart';
import '../../routes.dart';

class SearchUserList extends StatelessWidget {
  const SearchUserList({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<SearchBloc, SearchState>(
      builder: (context, state) {
        switch(state.status) {
          case FormzSubmissionStatus.initial:
            return _paddedText(context.l10n.searchInitial);

          case FormzSubmissionStatus.inProgress:
            return _inProgress(context);

          case FormzSubmissionStatus.success:
            return _success(context, state.users);

          default:
            return _noData(context);
        }
      }
    );
  }

  Widget _inProgress(BuildContext context) {
    return const CircularProgressIndicator();
  }

  Widget _success(BuildContext context, List<User> users) {
    if (users.isEmpty) {
      return _noData(context);
    }

    return ListView.builder(
      itemCount: users.length,
      itemBuilder: (context, index) {
        return ListTile(
          title: Text(users[index].name),
          subtitle: Text('Joined at ${users[index].joinedAt.toIso8601String()}'),
          onTap: () {
            UserProfileRoute(
                userId: users[index].id.uuid,
            ).go(context);
          },
        );
      }
    );
  }

  Widget _noData(BuildContext context) {
    return _paddedText(context.l10n.noData);
  }

  Widget _paddedText(String text) {
    return Container(
      alignment: Alignment.topCenter,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Text(text),
      ),
    );
  }
}