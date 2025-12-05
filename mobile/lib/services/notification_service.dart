import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';

import '../firebase_options.dart';

class NotificationService {
  NotificationService._();

  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;

  static Future<void> init() async {
    if (Firebase.apps.isEmpty) {
      await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    }
    final settings = await _messaging.requestPermission();
    debugPrint('FCM permission: ${settings.authorizationStatus}');
    final token = await _messaging.getToken();
    debugPrint('FCM token: $token');
    FirebaseMessaging.onMessage.listen((message) {
      debugPrint('Push notification: ${message.notification?.title}');
    });
  }
}
