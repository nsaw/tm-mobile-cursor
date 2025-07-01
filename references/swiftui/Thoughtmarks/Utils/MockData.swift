import Foundation

struct MockData {
    static let thoughtmarks = [
        Thoughtmark(
            id: 1,
            title: "Welcome to Thoughtmarks",
            content: "This is your first thoughtmark! Use this app to capture and organize your ideas.",
            tags: ["welcome", "getting-started"],
            binId: 1,
            isPinned: true,
            isTask: false,
            isCompleted: false,
            dueDate: nil,
            priority: .medium,
            createdAt: Date(),
            updatedAt: Date()
        ),
        Thoughtmark(
            id: 2,
            title: "Project Ideas",
            content: "Build a personal knowledge management system with AI-powered categorization.",
            tags: ["project", "ai", "development"],
            binId: 2,
            isPinned: false,
            isTask: true,
            isCompleted: false,
            dueDate: Calendar.current.date(byAdding: .day, value: 7, to: Date()),
            priority: .high,
            createdAt: Date(),
            updatedAt: Date()
        )
    ]
    
    static let bins = [
        Bin(
            id: 1,
            name: "Quick Notes",
            description: "Fast captures and random thoughts",
            color: "#3B82F6",
            icon: "note.text",
            userId: 1,
            createdAt: Date()
        ),
        Bin(
            id: 2,
            name: "Projects",
            description: "Long-term projects and goals",
            color: "#10B981",
            icon: "folder",
            userId: 1,
            createdAt: Date()
        )
    ]
}