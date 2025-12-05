import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:mobile/services/api_client.dart';
import 'package:mobile/services/auth_repository.dart';
import 'package:mobile/services/parent_repository.dart';
import 'package:mobile/state/auth_controller.dart';
import 'package:mobile/state/dashboard_controller.dart';
import 'package:mobile/ui/screens/login_screen.dart';

void main() {
  testWidgets('renders login screen by default', (tester) async {
    final apiClient = ApiClient.instance;
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AuthController(AuthRepository(apiClient))),
          ChangeNotifierProvider(create: (_) => DashboardController(ParentRepository(apiClient))),
        ],
        child: const MaterialApp(home: LoginScreen()),
      ),
    );

    expect(find.text('Welcome back'), findsOneWidget);
    expect(find.text('Send OTP'), findsOneWidget);
  });
}
