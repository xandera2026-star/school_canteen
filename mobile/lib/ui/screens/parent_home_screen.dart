import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../models/menu.dart';
import '../../models/order.dart';
import '../../state/auth_controller.dart';
import '../../state/dashboard_controller.dart';

class ParentHomeScreen extends StatefulWidget {
  const ParentHomeScreen({super.key});

  @override
  State<ParentHomeScreen> createState() => _ParentHomeScreenState();
}

class _ParentHomeScreenState extends State<ParentHomeScreen> {
  final Map<MenuItemModel, int> _cart = {};
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final dashboard = context.watch<DashboardController>();
    final auth = context.read<AuthController>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('XAndera Canteen'),
        actions: [
          IconButton(
            onPressed: () => auth.logout(),
            icon: const Icon(Icons.logout),
            tooltip: 'Sign out',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          final schoolId = auth.lastSchoolId;
          if (schoolId != null) {
            await dashboard.loadAll(schoolId: schoolId);
          }
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _buildStudentRow(dashboard),
            const SizedBox(height: 24),
            _buildServiceDatePicker(dashboard),
            const SizedBox(height: 24),
            Text('Today\'s Menu', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),
            ...dashboard.menu.map((category) => _MenuCategoryCard(
                  category: category,
                  onAdd: (item) => _addToCart(item),
                )),
            if (_cart.isNotEmpty) ...[
              const SizedBox(height: 24),
              _buildCartSection(dashboard),
            ],
            const SizedBox(height: 24),
            Text('Order History', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),
            ...dashboard.orders.map((order) => Card(
                  child: ListTile(
                    title: Text('Order #${order.id.substring(0, 6)}'),
                    subtitle: Text(
                      '${order.status.toUpperCase()} • ${DateFormat('dd MMM').format(DateTime.parse(order.serviceDate))}',
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('₹${order.totalAmount.toStringAsFixed(0)}'),
                        Text(order.paymentStatus, style: const TextStyle(fontSize: 12)),
                      ],
                    ),
                    onTap: () => _showPaymentSheet(order, dashboard),
                  ),
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentRow(DashboardController dashboard) {
    if (dashboard.students.isEmpty) {
      return const Text('No students found. Import roster in admin portal.');
    }
    return SizedBox(
      height: 120,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: dashboard.students.length,
        separatorBuilder: (context, _) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final student = dashboard.students[index];
          final isActive = dashboard.activeStudentId == student.id;
          return GestureDetector(
            onTap: () => dashboard.selectStudent(student.id),
            child: Container(
              width: 200,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isActive ? Colors.indigo.shade50 : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isActive ? Colors.indigo : Colors.grey.shade200,
                  width: 1.2,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(student.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                  Text('${student.className ?? ''} ${student.section ?? ''}'),
                  const Spacer(),
                  Wrap(
                    spacing: 6,
                    children: student.allergies
                        .map((flag) => Chip(label: Text(flag), visualDensity: VisualDensity.compact))
                        .toList(),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildServiceDatePicker(DashboardController dashboard) {
    return Row(
      children: [
        const Icon(Icons.calendar_today, size: 16),
        const SizedBox(width: 8),
        Text('Delivery date: ${dashboard.serviceDate}'),
        const Spacer(),
        Builder(builder: (context) {
          final schoolId = context.read<AuthController>().lastSchoolId;
          return TextButton(
            onPressed: schoolId == null
                ? null
                : () async {
                    final selected = await showDatePicker(
                      context: context,
                      firstDate: DateTime.now().subtract(const Duration(days: 1)),
                      lastDate: DateTime.now().add(const Duration(days: 30)),
                      initialDate: DateTime.parse(dashboard.serviceDate),
                    );
                    if (selected != null) {
                      dashboard.setServiceDate(selected);
                      await dashboard.refreshMenu(schoolId);
                    }
                  },
            child: const Text('Change'),
          );
        }),
      ],
    );
  }

  Widget _buildCartSection(DashboardController dashboard) {
    final total = _cart.entries.fold<double>(0, (sum, entry) => sum + entry.key.price * entry.value);
    final studentId = dashboard.activeStudentId;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Cart', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ..._cart.entries.map(
              (entry) => ListTile(
                dense: true,
                title: Text(entry.key.name),
                subtitle: Text('₹${entry.key.price.toStringAsFixed(0)}'),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.remove_circle_outline),
                      onPressed: () => _updateCart(entry.key, entry.value - 1),
                    ),
                    Text(entry.value.toString()),
                    IconButton(
                      icon: const Icon(Icons.add_circle_outline),
                      onPressed: () => _updateCart(entry.key, entry.value + 1),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _notesController,
              decoration: const InputDecoration(labelText: 'Special notes'),
            ),
            const SizedBox(height: 12),
            FilledButton.icon(
              onPressed: studentId == null ? null : () => _placeOrder(dashboard, studentId),
              icon: const Icon(Icons.check_circle_outline),
              label: Text('Place order • ₹${total.toStringAsFixed(0)}'),
            ),
          ],
        ),
      ),
    );
  }

  void _addToCart(MenuItemModel item) {
    setState(() {
      _cart.update(item, (value) => value + 1, ifAbsent: () => 1);
    });
  }

  void _updateCart(MenuItemModel item, int quantity) {
    setState(() {
      if (quantity <= 0) {
        _cart.remove(item);
      } else {
        _cart[item] = quantity;
      }
    });
  }

  Future<void> _placeOrder(DashboardController dashboard, String studentId) async {
    final items = _cart.entries
        .map(
          (entry) => OrderItemModel(
            menuItemId: entry.key.id,
            name: entry.key.name,
            quantity: entry.value,
            unitPrice: entry.key.price,
          ),
        )
        .toList();
    try {
      final order = await dashboard.placeOrder(
        studentId: studentId,
        items: items,
        notes: _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Order ${order.id.substring(0, 6)} confirmed.')),
      );
      setState(() {
        _cart.clear();
        _notesController.clear();
      });
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Order failed: $error')),
      );
    }
  }

  void _showPaymentSheet(OrderModel order, DashboardController controller) {
    showModalBottomSheet(
      context: context,
      builder: (_) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Payment for ${order.id.substring(0, 6)}', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            Text('Status: ${order.paymentStatus}'),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: FilledButton(
                    onPressed: () async {
                      await controller.recordPayment(orderId: order.id, useGpay: true);
                      final link = Uri.parse(
                        'upi://pay?pa=xandera@upi&pn=XAndera%20Canteen&tn=Order%20${order.id}&am=${order.totalAmount.toStringAsFixed(2)}&cu=INR',
                      );
                      await launchUrl(link, mode: LaunchMode.externalApplication);
                      if (mounted) Navigator.pop(context);
                    },
                    child: const Text('Pay via Google Pay'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () async {
                      await controller.recordPayment(orderId: order.id, useGpay: false);
                      if (mounted) Navigator.pop(context);
                    },
                    child: const Text('Cash on Delivery'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _MenuCategoryCard extends StatelessWidget {
  const _MenuCategoryCard({required this.category, required this.onAdd});

  final MenuCategoryModel category;
  final ValueChanged<MenuItemModel> onAdd;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(category.name, style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(width: 8),
                Chip(label: Text(category.type.toUpperCase())),
              ],
            ),
            const SizedBox(height: 12),
            ...category.items.map(
              (item) => ListTile(
                title: Text(item.name),
                subtitle: Text('₹${item.price.toStringAsFixed(0)}'),
                trailing: IconButton(
                  icon: const Icon(Icons.add_circle_outline),
                  onPressed: () => onAdd(item),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
