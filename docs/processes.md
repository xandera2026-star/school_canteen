# Operational Flows

## School Onboarding Flow
1. **Create school record** via `/owner/schools` with basic address + owner assignment.
2. **Apply default settings**: auto-generate `school_settings` row with trial plan, standard theme, cut-off defaults.
3. **Upload student roster**:
   - Export ERP list to CSV using template in `docs/student_import_template.csv`.
   - School admin uploads through Admin Portal → `/admin/students/import`.
   - System validates columns, upserts parents + parent-child links, records errors for review.
4. **Verify guardians**: Parent profiles receive OTP login instructions; admin spot-checks contact data.
5. **Configure menu**:
   - Create categories (veg/non-veg/snacks/etc.).
   - Upload menu items with pricing, availability windows, allergen metadata, and images (via `/upload-url`).
   - Publish “Special of the Day” and schedule visibility.
6. **Customize school theme**: Update primary/accent colors, logo, and support contacts in Admin Portal.
7. **Invite admins & canteen managers**: Issue email/SMS with portal URLs and role assignments.
8. **Publish parent instructions**: Share download links (Android/iOS), login steps, cut-off time, and payment options.
9. **Dry run**: Place internal test orders before opening to all parents; review dashboards for accuracy.
10. **Go live**: Announce via daily announcement + email; monitor first-day orders via admin dashboard.

## Trial Workflow
1. **Activation**: New school defaults to `plan=trial`, `status=trial`, and `trial_expires_at = created_at + 7 days`.
2. **Limitations**:
   - Max 1 school per owner in trial.
   - Limited storage (50 menu images) and notifications (1k/day).
   - iOS builds disabled (Android only) until upgrade.
   - Reporting exports limited to last 7 days.
3. **Usage Tracking**: Background metrics track order counts, active parents, and payment volume.
4. **Notifications**:
   - Day 4: Email + in-portal banner reminding about trial end.
   - Day 6: FCM + SMS to school owner with upgrade CTA.
   - Day 7 morning: Final notice that trial expires tonight.
5. **Expiry Handling**:
   - After `trial_expires_at`, switch `school_settings.subscription_plan` to `expired`.
   - New order placements blocked; parents see banner instructing admin to upgrade.
   - Admin portal remains read-only for historical data.
6. **Upgrade Path**:
   - Owner chooses Standard or Premium via `/owner/subscriptions`.
   - Payment captured offline initially; status updated to `active` and restrictions lifted immediately.
7. **Auto-Disable Features**:
   - iOS toggles remain off until Premium.
   - Attendance sync + advanced analytics stay hidden during trial and Standard by default.
8. **Reactivation**: If trial lapses for >30 days without upgrade, school flagged as inactive for platform owner review.
