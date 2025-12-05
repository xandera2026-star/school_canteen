# Mobile Release Checklist

1. **Credentials**
   - Configure Google Play Console + Apple App Store Connect.
   - Store signing keys in GitHub secrets (`ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASS`, `APPLE_API_KEY`, etc.).

2. **CI Pipeline**
   - GitHub Actions job builds `flutter build appbundle` and `flutter build ipa --export-options-plist`. Upload artifacts to Play/App Store via Fastlane (`fastlane supply` / `fastlane deliver`).

3. **QA Gates**
   - Smoke test OTP login, offline cache, order placement, payment link and push notifications against staging backend.
   - Run `flutter test` + golden tests; capture backend integration via Postman collection.

4. **Store Assets**
   - Prepare screenshots (5.5", 6.5", 10"), feature graphics, privacy policy url, release notes.

5. **Rollout Strategy**
   - Use closed testing track for Saraswathi Vidyalaya parents → gather feedback.
   - Gradual % rollout in Play Store; enable crash-free target in Crashlytics before wide release.

6. **Reminder**
   - Before tagging v1.0, revisit this checklist. The TODO `remind-mobile-deploy` remains open until the release sprint.
