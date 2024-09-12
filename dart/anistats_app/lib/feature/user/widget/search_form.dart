import 'package:anistats_app/core/l10n.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:formz/formz.dart';

import '../bloc/search_bloc.dart';
import '../model/model.dart';

class SearchForm extends StatelessWidget {
  const SearchForm({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocListener<SearchBloc, SearchState>(
      listener: (context, state) {
        switch(state.status) {
          case FormzSubmissionStatus.failure:
            _searchFailureMessage(context);

          default: // noop
        }
      },
      child: Align(
        alignment: const Alignment(0, -1 / 3),
        child: Column(
          children: [
            _QueryInput(
              suffixIcon: BlocBuilder<SearchBloc, SearchState>(
                builder: (ctx, state) {
                  if (state.status == FormzSubmissionStatus.inProgress) {
                    return const CircularProgressIndicator();
                  }

                  return IconButton(
                    onPressed: () {
                      context.read<SearchBloc>().add(const SearchSubmitted());
                    },
                    icon: const Icon(Icons.search),
                  );
                },
              ),
            ),
          ],
        ),
      )
    );
  }

  void _searchFailureMessage(BuildContext context) {
    var messenger = ScaffoldMessenger.of(context);

    messenger.hideCurrentSnackBar();

    var snackBar = SnackBar(
      content: Text(context.l10n.searchFailure),
    );
    messenger.showSnackBar(snackBar);
  }
}

class _QueryInput extends StatelessWidget {
  const _QueryInput({
    this.suffixIcon
  });

  final Widget? suffixIcon;

  @override
  Widget build(BuildContext context) {
    final displayError = context.select(
        (SearchBloc bloc) => bloc.state.query.displayError,
    );

    return TextField(
      key: const Key('searchForm_queryInput_textField'),
      onChanged: (value) {
        context.read<SearchBloc>().add(SearchQueryChanged(value));

        // try to submit the search
        context.read<SearchBloc>().add(const SearchSubmitted());
      },
      decoration: InputDecoration(
        labelText: context.l10n.search,
        errorText: displayError?.l10n(context),
        suffixIcon: suffixIcon,
      ),
    );
  }
}