try {
    var trackCode = "PASTE_YOUR_FULL_BASE64_STRING_HERE"; // Replace with your actual Base64
    var trackData = JSON.parse(atob(trackCode));

    if (typeof window.GameManager !== "undefined" && typeof GameManager.loadTrackFromSettings === "function") {
        GameManager.settings.track = trackData; // Set track data
        GameManager.loadTrackFromSettings(); // Load the track
        console.log("✅ Track successfully loaded using GameManager.loadTrackFromSettings!");
    } else {
        console.error("❌ Error: GameManager.loadTrackFromSettings() is not available.");
    }
} catch (error) {
    console.error("❌ Error decoding track:", error);
}
