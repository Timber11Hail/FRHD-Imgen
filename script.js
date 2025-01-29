async function convertImageToTrack() {
    const fileInput = document.getElementById('imageInput');
    const output = document.getElementById("output");
    if (!fileInput.files.length) {
        alert("Please select an image");
        return;
    }

    const file = fileInput.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function() {
        URL.revokeObjectURL(img.src);
        processImage(img);
    };

    img.onerror = function() {
        output.textContent = "Error loading image. Please try a different file.";
    };
}

function processImage(img) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const edges = applyEdgeDetection(imageData);

    let trackLines = [];
    for (let y = 0; y < edges.height; y++) {
        for (let x = 0; x < edges.width; x++) {
            if (edges.data[y * edges.width + x] === 255) {
                trackLines.push({ x1: x, y1: y, x2: x + 1, y2: y + 1 });
            }
        }
    }

    const trackData = {
        name: "Generated Track",
        lines: trackLines.map(line => ({
            x1: line.x1, y1: line.y1,
            x2: line.x2, y2: line.y2,
            scenery: false
        }))
    };

    const trackCode = btoa(JSON.stringify(trackData));
    document.getElementById("output").textContent = "Generated FreeRiderHD Track Code: " + trackCode;
}
