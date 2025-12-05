class StudentModel {
  const StudentModel({
    required this.id,
    required this.name,
    required this.className,
    required this.section,
    required this.rollNumber,
    required this.allergies,
    required this.isActive,
    this.photoUrl,
  });

  final String id;
  final String name;
  final String? className;
  final String? section;
  final String? rollNumber;
  final List<String> allergies;
  final bool isActive;
  final String? photoUrl;

  factory StudentModel.fromJson(Map<String, dynamic> json) {
    return StudentModel(
      id: json['student_id'] as String,
      name: json['name'] as String,
      className: json['class'] as String?,
      section: json['section'] as String?,
      rollNumber: json['roll_number'] as String?,
      allergies: (json['allergies'] as List<dynamic>? ?? []).cast<String>(),
      isActive: json['is_active'] as bool? ?? true,
      photoUrl: json['photo_url'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'student_id': id,
        'name': name,
        'class': className,
        'section': section,
        'roll_number': rollNumber,
        'allergies': allergies,
        'is_active': isActive,
        'photo_url': photoUrl,
      };
}
