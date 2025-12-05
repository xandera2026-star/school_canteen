import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../state/auth_controller.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _mobileController = TextEditingController();
  final _otpController = TextEditingController();
  final _schoolController = TextEditingController();
  bool _otpRequested = false;
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _mobileController.dispose();
    _otpController.dispose();
    _schoolController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthController>();
    _mobileController.text = auth.lastMobile ?? _mobileController.text;
    _schoolController.text = auth.lastSchoolId ?? _schoolController.text;

    return Scaffold(
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 40),
                Text('Welcome back', style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 8),
                const Text('Sign in with your registered mobile number.'),
                const SizedBox(height: 32),
                TextFormField(
                  controller: _mobileController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(labelText: 'Mobile number'),
                  validator: (value) {
                    if (value == null || value.length < 10) {
                      return 'Enter a valid mobile number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _schoolController,
                  decoration: const InputDecoration(labelText: 'School ID (UUID)'),
                ),
                const SizedBox(height: 12),
                if (_otpRequested)
                  TextFormField(
                    controller: _otpController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'OTP'),
                  ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: auth.isLoading ? null : () => _handleSubmit(auth),
                  child: auth.isLoading
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : Text(_otpRequested ? 'Verify OTP' : 'Send OTP'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _handleSubmit(AuthController auth) async {
    if (!_formKey.currentState!.validate()) return;
    final mobile = _mobileController.text.trim();
    final schoolId = _schoolController.text.trim().isEmpty ? null : _schoolController.text.trim();
    if (!_otpRequested) {
      await auth.requestOtp(mobile: mobile, countryCode: '+91', schoolId: schoolId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('OTP sent. Please check your SMS.')),
        );
        setState(() {
          _otpRequested = true;
        });
      }
    } else {
      final otp = _otpController.text.trim();
      await auth.verifyOtp(mobile: mobile, otp: otp, schoolId: schoolId);
    }
  }
}
