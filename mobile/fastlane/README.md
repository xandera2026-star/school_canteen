# Fastlane setup

1. Set environment variables (see `docs/ops/mobile_release_plan.md`).
2. Decode secrets before running locally:
   ```bash
   export GOOGLE_PLAY_SERVICE_ACCOUNT_JSON=$(cat play-account.json | base64)
   export ANDROID_KEYSTORE_B64=$(cat upload-keystore.jks | base64)
   export ANDROID_KEYSTORE_PASS=***
   export ANDROID_KEY_ALIAS=***
   export ANDROID_KEY_PASS=***
   export APPLE_API_KEY_B64=$(cat AuthKey.p8 | base64)
   export APPLE_API_KEY_ID=***
   export APPLE_API_ISSUER_ID=***
   ```
3. Run `fastlane android release` or `fastlane ios release` from `mobile/` directory.
