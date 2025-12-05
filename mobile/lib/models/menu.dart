class MenuItemModel {
  const MenuItemModel({
    required this.id,
    required this.name,
    required this.price,
    required this.currency,
    required this.categoryId,
    this.description,
    this.allergens = const [],
    this.imageUrl,
  });

  final String id;
  final String name;
  final double price;
  final String currency;
  final String categoryId;
  final String? description;
  final List<String> allergens;
  final String? imageUrl;

  factory MenuItemModel.fromJson(Map<String, dynamic> json, String categoryId) {
    return MenuItemModel(
      id: json['item_id'] as String,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      currency: json['currency'] as String? ?? 'INR',
      description: json['description'] as String?,
      allergens: (json['allergens'] as List<dynamic>? ?? []).cast<String>(),
      imageUrl: json['image_url'] as String?,
      categoryId: categoryId,
    );
  }

  Map<String, dynamic> toJson() => {
        'item_id': id,
        'name': name,
        'price': price,
        'currency': currency,
        'description': description,
        'allergens': allergens,
        'image_url': imageUrl,
        'category_id': categoryId,
      };
}

class MenuCategoryModel {
  const MenuCategoryModel({
    required this.id,
    required this.name,
    required this.type,
    required this.items,
  });

  final String id;
  final String name;
  final String type;
  final List<MenuItemModel> items;

  factory MenuCategoryModel.fromJson(Map<String, dynamic> json) {
    final itemsJson = (json['items'] as List<dynamic>? ?? [])
        .cast<Map<String, dynamic>>();
    return MenuCategoryModel(
      id: json['category_id'] as String,
      name: json['name'] as String,
      type: json['type'] as String? ?? 'veg',
      items: itemsJson
          .map((item) => MenuItemModel.fromJson(item, json['category_id'] as String))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'category_id': id,
        'name': name,
        'type': type,
        'items': items.map((item) => item.toJson()).toList(),
      };
}
