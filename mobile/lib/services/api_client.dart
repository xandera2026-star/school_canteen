import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../config/environment.dart';
import '../models/auth_tokens.dart';

class ApiClient {
  ApiClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: Environment.apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 20),
      ),
    );
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _secureStorage.read(key: _kAccessTokenKey);
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (_shouldAttemptRefresh(error)) {
          final refreshed = await _refreshToken();
          if (refreshed) {
            final retryRequest = await _retry(error.requestOptions);
            handler.resolve(retryRequest);
            return;
          }
        }
        handler.next(error);
      },
    ));
  }

  static final ApiClient instance = ApiClient._internal();

  static const _kAccessTokenKey = 'auth.access';
  static const _kRefreshTokenKey = 'auth.refresh';

  final _secureStorage = const FlutterSecureStorage();
  late final Dio _dio;

  Dio get dio => _dio;

  Future<void> persistTokens(AuthTokens tokens) async {
    await _secureStorage.write(key: _kAccessTokenKey, value: tokens.accessToken);
    await _secureStorage.write(key: _kRefreshTokenKey, value: tokens.refreshToken);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('auth.expires', tokens.expiresIn);
  }

  Future<AuthTokens?> loadPersistedTokens() async {
    final access = await _secureStorage.read(key: _kAccessTokenKey);
    final refresh = await _secureStorage.read(key: _kRefreshTokenKey);
    if (access == null || refresh == null) return null;
    final prefs = await SharedPreferences.getInstance();
    final expires = prefs.getInt('auth.expires') ?? 3600;
    return AuthTokens(accessToken: access, refreshToken: refresh, expiresIn: expires);
  }

  Future<void> clearTokens() async {
    await _secureStorage.deleteAll();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth.expires');
  }

  Future<Response<T>> get<T>(String path, {Map<String, dynamic>? query}) {
    return _dio.get<T>(path, queryParameters: query);
  }

  Future<Response<T>> post<T>(String path, {dynamic data, Map<String, String>? headers}) {
    return _dio.post<T>(path, data: data, options: Options(headers: headers));
  }

  bool _shouldAttemptRefresh(DioException error) {
    if (error.response?.statusCode == 401) {
      final path = error.requestOptions.path;
      if (!path.contains('auth/refresh')) {
        return true;
      }
    }
    return false;
  }

  Future<bool> _refreshToken() async {
    final refreshToken = await _secureStorage.read(key: _kRefreshTokenKey);
    if (refreshToken == null) return false;
    try {
      final response = await Dio(BaseOptions(baseUrl: Environment.apiBaseUrl)).post<Map<String, dynamic>>(
        '/auth/refresh',
        data: {'refresh_token': refreshToken},
      );
      final tokens = AuthTokens.fromJson(response.data!);
      await persistTokens(tokens);
      return true;
    } catch (_) {
      await clearTokens();
      return false;
    }
  }

  Future<Response<dynamic>> _retry(RequestOptions requestOptions) {
    final options = Options(
      method: requestOptions.method,
      headers: requestOptions.headers,
    );
    return _dio.request<dynamic>(
      requestOptions.path,
      data: requestOptions.data,
      queryParameters: requestOptions.queryParameters,
      options: options,
    );
  }
}
