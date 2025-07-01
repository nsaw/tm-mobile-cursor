import Foundation

struct Thoughtmark: Identifiable, Codable {
    let id: Int
    var title: String
    var content: String
    var tags: [String]
    var binId: Int?
    var isPinned: Bool
    var isTask: Bool
    var isCompleted: Bool
    var dueDate: Date?
    var priority: Priority?
    let createdAt: Date
    let updatedAt: Date
    
    enum Priority: String, CaseIterable, Codable {
        case low = "low"
        case medium = "medium"
        case high = "high"
    }
}

extension Thoughtmark {
    static let example = Thoughtmark(
        id: 1,
        title: "Example Thoughtmark",
        content: "This is an example thoughtmark for previews",
        tags: ["example", "preview"],
        binId: nil,
        isPinned: false,
        isTask: false,
        isCompleted: false,
        dueDate: nil,
        priority: .medium,
        createdAt: Date(),
        updatedAt: Date()
    )
}