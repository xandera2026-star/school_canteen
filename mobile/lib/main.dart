import 'package:flutter/material.dart';

void main() {
  runApp(const XAnderaApp());
}

class XAnderaApp extends StatelessWidget {
  const XAnderaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'XAndera Canteen',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2B6CB0),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      home: const ParentHomeScreen(),
    );
  }
}

class ParentHomeScreen extends StatelessWidget {
  const ParentHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final children = [
      StudentCardData('Aarav', 'Class IX - A', ['Nuts']),
      StudentCardData('Diya', 'Class VI - B', ['Gluten']),
    ];

    final menuItems = [
      MenuItemData('Veg Biriyani', 'Special of the Day', '₹80')..
          withTag('Veg'),
      MenuItemData('Lemon Rice', 'South Indian Favourites', '₹60'),
      MenuItemData('Tender Coconut', 'Drinks & Juice', '₹45'),
    ];

    final announcements = [
      AnnouncementData('Kitchen Update', 'Canteen closed on Friday.'),
      AnnouncementData('New Item', 'Mini idli combo now available.'),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Saraswathi Vidyalaya'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            'Your Children',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 170,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemBuilder: (context, index) =>
                  StudentCard(data: children[index]),
              separatorBuilder: (context, _) => const SizedBox(width: 12),
              itemCount: children.length,
            ),
          ),
          const SizedBox(height: 24),
          const SectionHeader(title: 'Today\'s Menu'),
          const SizedBox(height: 12),
          ...menuItems.map(MenuItemTile.new),
          const SizedBox(height: 24),
          const SectionHeader(title: 'Announcements'),
          const SizedBox(height: 12),
          ...announcements.map(AnnouncementCard.new),
          const SizedBox(height: 32),
          FilledButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.shopping_bag_outlined),
            label: const Text('Review Cart & Pay'),
          ),
        ],
      ),
    );
  }
}

class StudentCardData {
  StudentCardData(this.name, this.classDisplay, this.allergies);

  final String name;
  final String classDisplay;
  final List<String> allergies;
}

class StudentCard extends StatelessWidget {
  const StudentCard({required this.data, super.key});

  final StudentCardData data;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 6),
            blurRadius: 12,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            data.name,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 4),
          Text(
            data.classDisplay,
            style: TextStyle(color: Colors.blueGrey.shade600),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 6,
            children: data.allergies
                .map(
                  (flag) => Chip(
                    label: Text(flag),
                    visualDensity: VisualDensity.compact,
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }
}

class MenuItemData {
  MenuItemData(this.name, this.description, this.price);

  final String name;
  final String description;
  final String price;
  String? tag;

  MenuItemData withTag(String label) {
    tag = label;
    return this;
  }
}

class MenuItemTile extends StatelessWidget {
  const MenuItemTile(this.data, {super.key});

  final MenuItemData data;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(data.name, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(data.description),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(data.price, style: const TextStyle(fontWeight: FontWeight.bold)),
            if (data.tag != null)
              Container(
                margin: const EdgeInsets.only(top: 6),
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.green.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  data.tag!,
                  style: const TextStyle(fontSize: 12, color: Colors.green),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class AnnouncementData {
  AnnouncementData(this.title, this.body);

  final String title;
  final String body;
}

class AnnouncementCard extends StatelessWidget {
  const AnnouncementCard(this.data, {super.key});

  final AnnouncementData data;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.amber.shade50,
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: const Icon(Icons.campaign_outlined),
        title: Text(data.title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(data.body),
      ),
    );
  }
}

class SectionHeader extends StatelessWidget {
  const SectionHeader({required this.title, super.key});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
        TextButton(onPressed: () {}, child: const Text('See all')),
      ],
    );
  }
}
