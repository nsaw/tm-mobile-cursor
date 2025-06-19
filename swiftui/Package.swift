// swift-tools-version: 5.8
import PackageDescription

let package = Package(
    name: "Thoughtmarks",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(name: "Thoughtmarks", targets: ["Thoughtmarks"]),
    ],
    dependencies: [
        .package(url: "https://github.com/firebase/firebase-ios-sdk.git", from: "10.0.0"),
        .package(url: "https://github.com/airbnb/lottie-ios.git", from: "4.0.0"),
    ],
    targets: [
        .target(
            name: "Thoughtmarks",
            dependencies: [
                .product(name: "FirebaseAuth", package: "firebase-ios-sdk"),
                .product(name: "FirebaseFirestore", package: "firebase-ios-sdk"),
                .product(name: "Lottie", package: "lottie-ios"),
            ]
        ),
        .testTarget(
            name: "ThoughtmarksTests",
            dependencies: ["Thoughtmarks"]
        ),
    ]
)