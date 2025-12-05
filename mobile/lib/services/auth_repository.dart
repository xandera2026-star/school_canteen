import 'package:shared_preferences/shared_preferences.dart';

import '../models/auth_tokens.dart';
import 'api_client.dart';

class AuthRepository {
  AuthRepository(this._apiClient);

  final ApiClient _apiClient;

  static const _kMobileKey = 'auth.mobile';
  static const _kSchoolIdKey = 'auth.school_id';

  Future<void> requestOtp({required String mobile, required String countryCode, String? schoolId}) async {
    await _apiClient.post('/auth/login', data: {
      'mobile': mobile,
      'country_code': countryCode,
      if (schoolId != null) 'school_id': schoolId,
      'user_type': 'parent',
    });
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kMobileKey, mobile);
    if (schoolId != null) {
      await prefs.setString(_kSchoolIdKey, schoolId);
    }
  }

  Future<AuthTokens> verifyOtp({
    required String mobile,
    required String otp,
    String? deviceId,
    String? schoolId,
  }) async {
    final response = await _apiClient.post<Map<String, dynamic>>(
      '/auth/verify-otp',
      data: {
        'mobile': mobile,
        'otp': otp,
        if (schoolId != null) 'school_id': schoolId,
        if (deviceId != null) 'device_id': deviceId,
        'user_type': 'parent',
      },
    );
    final tokens = AuthTokens.fromJson(response.data!);
    await _apiClient.persistTokens(tokens);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kMobileKey, mobile);
    if (schoolId != null) {
      await prefs.setString(_kSchoolIdKey, schoolId);
    }
    return tokens;
  }

  Future<String?> lastUsedMobile() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_kMobileKey);
  }

  Future<String?> lastUsedSchoolId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_kSchoolIdKey);
  }

  Future<void> logout() async {
    await _apiClient.clearTokens();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kMobileKey);
    await prefs.remove(_kSchoolIdKey);
  }
}
