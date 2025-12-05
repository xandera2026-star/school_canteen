import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'firebase_options.dart';
import 'services/api_client.dart';
import 'services/auth_repository.dart';
import 'services/notification_service.dart';
import 'services/offline_cache.dart';
import 'services/parent_repository.dart';
import 'state/auth_controller.dart';
import 'state/dashboard_controller.dart';
import 'ui/screens/login_screen.dart';
import 'ui/screens/parent_home_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await OfflineCache.init();
  try {
    await NotificationService.init();
  } catch (error) {
    debugPrint('Notification init failed: $error');
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  }
  final apiClient = ApiClient.instance;
  final authRepository = AuthRepository(apiClient);
  final parentRepository = ParentRepository(apiClient);
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthController(authRepository)),
        ChangeNotifierProvider(create: (_) => DashboardController(parentRepository)),
      ],
      child: const XAnderaApp(),
    ),
  );
}

class XAnderaApp extends StatefulWidget {
  const XAnderaApp({super.key, this.bootstrapAuth = true});

  final bool bootstrapAuth;

  @override
  State<XAnderaApp> createState() => _XAnderaAppState();
}

class _XAnderaAppState extends State<XAnderaApp> {
  @override
  void initState() {
    super.initState();
    if (widget.bootstrapAuth) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        context.read<AuthController>().bootstrap();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'XAndera Canteen',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const _AppRouter(),
    );
  }
}

class _AppRouter extends StatelessWidget {
  const _AppRouter();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    if (!auth.isLoggedIn) {
      return const LoginScreen();
    }
    final schoolId = auth.lastSchoolId;
    if (schoolId == null) {
      return const LoginScreen();
    }
    return _DashboardLoader(schoolId: schoolId);
  }
}

class _DashboardLoader extends StatefulWidget {
  const _DashboardLoader({required this.schoolId});

  final String schoolId;

  @override
  State<_DashboardLoader> createState() => _DashboardLoaderState();
}

class _DashboardLoaderState extends State<_DashboardLoader> {
  bool _initialized = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialized) {
      _initialized = true;
      context.read<DashboardController>().loadAll(schoolId: widget.schoolId);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dashboard = context.watch<DashboardController>();
    if (dashboard.isLoading && dashboard.students.isEmpty) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    return const ParentHomeScreen();
  }
}
