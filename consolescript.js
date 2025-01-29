try {
    var trackCode = "PASTE_YOUR_FULL_BASE64_STRING_HERE"; // Replace with actual Base64
    var trackData = JSON.parse(atob(trackCode));

    if (typeof window.GameManager !== "undefined" && typeof GameManager.loadTrack === "function") {
        GameManager.loadTrack(trackData);
        console.log("✅ Track loaded instantly into FreeRiderHD editor!");
    } else {
        console.error("❌ Error: GameManager.loadTrack() is not available.");
    }
} catch (error) {
    console.error("❌ Error importing track:", error);
}
