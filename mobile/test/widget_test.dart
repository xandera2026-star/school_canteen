import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('renders dashboard sections', (tester) async {
    await tester.pumpWidget(const XAnderaApp());
    await tester.pumpAndSettle();

    expect(find.text('Your Children'), findsOneWidget);
    expect(find.text("Today's Menu"), findsOneWidget);

    await tester.scrollUntilVisible(
      find.text('Announcements'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    expect(find.text('Announcements'), findsOneWidget);
  });
}
