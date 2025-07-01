import Foundation

struct Config {
    static let apiBaseURL = "http://localhost:5000/api"
    static let debugMode = true
    
    // Firebase configuration
    struct Firebase {
        static let projectId = "thoughtmarks-app"
        static let storageBucket = "thoughtmarks-app.appspot.com"
    }
    
    // App configuration
    struct App {
        static let version = "1.0.0"
        static let buildNumber = "1"
        static let bundleIdentifier = "com.thoughtmarks.app"
    }
}