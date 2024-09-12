import 'package:anistats_api/anistats_api.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../bloc/search_bloc.dart';
import '../widget/search_form.dart';
import '../widget/search_user_list.dart';

class SearchUsersPage extends StatelessWidget {
  const SearchUsersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return UserServiceProvider(
      child: Scaffold(
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: BlocProvider(
            create: (context) => SearchBloc(
              userService: context.read<UserService>(),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Search Users Page'),
                SearchForm(),
                SizedBox( // TODO: Refactor this SizedBox away
                  width: 128,
                  height: 256,
                  child: SearchUserList(),
                ),
              ],
            ),
          ),
        ),
      )
    );
  }
}

class UserServiceProvider extends StatelessWidget {
  const UserServiceProvider({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return RepositoryProvider(
      lazy: true,
      create: (context) {
        return UserService(context.read<ClientChannel>());
      },
      child: child,
    );
  }
}