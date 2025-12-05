import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/auth_tokens.dart';
import '../services/api_client.dart';
import '../services/auth_repository.dart';

class AuthController extends ChangeNotifier {
  AuthController(this._repository);

  final AuthRepository _repository;
  AuthTokens? _tokens;
  bool _isLoading = false;
  String? _lastMobile;
  String? _lastSchoolId;

  AuthTokens? get tokens => _tokens;
  bool get isLoggedIn => _tokens != null;
  bool get isLoading => _isLoading;
  String? get lastMobile => _lastMobile;
  String? get lastSchoolId => _lastSchoolId;

  Future<void> bootstrap() async {
    final prefs = await SharedPreferences.getInstance();
    _lastMobile = await _repository.lastUsedMobile();
    _lastSchoolId = await _repository.lastUsedSchoolId();
    _tokens = await ApiClient.instance.loadPersistedTokens();
    notifyListeners();
  }

  Future<void> requestOtp({required String mobile, required String countryCode, String? schoolId}) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _repository.requestOtp(mobile: mobile, countryCode: countryCode, schoolId: schoolId);
      _lastMobile = mobile;
      _lastSchoolId = schoolId;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> verifyOtp({required String mobile, required String otp, String? schoolId}) async {
    _isLoading = true;
    notifyListeners();
    try {
      final tokens = await _repository.verifyOtp(mobile: mobile, otp: otp, schoolId: schoolId);
      _tokens = tokens;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    _tokens = null;
    notifyListeners();
  }
}
