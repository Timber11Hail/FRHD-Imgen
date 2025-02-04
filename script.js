document.getElementById("imageInput").addEventListener("change", convertImageToTrack);

async function convertImageToTrack() {
    const fileInput = document.getElementById('imageInput');
    if (!fileInput.files.length) {
        alert("Please select an image");
        return;
    }

    const file = fileInput.files[0];
    const img = new Image();
    img.onload = () => processImage(img);
    img.src = URL.createObjectURL(file);
}

function processImage(img) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Scale image down even further to 6x6 pixels
    canvas.width = 6;
    canvas.height = 6;
    ctx.drawImage(img, 0, 0, 6, 6);

    const imageData = ctx.getImageData(0, 0, 6, 6);
    const edges = applyEdgeDetection(imageData);

    let trackLines = [];
    for (let y = 0; y < edges.height; y++) {
        for (let x = 0; x < edges.width; x++) {
            if (edges.data[y * edges.width + x] === 255) {
                // Add fewer lines by only storing every other pixel
                if (x % 2 === 0 && y % 2 === 0) {
                    trackLines.push({ x1: x, y1: y, x2: x + 1, y2: y + 1 });
                }
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
    document.getElementById("output").textContent = trackCode;
}

function applyEdgeDetection(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    let edges = new Uint8Array(width * height);
    
    for (let i = 0; i < imageData.data.length; i += 4) {
        let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        edges[i / 4] = avg < 100 ? 255 : 0;  // Use a higher threshold to ignore minor details
    }
    
    return { data: edges, width, height };
}

function copyToClipboard() {
    const output = document.getElementById("output").textContent;
    
    if (!output) {
        alert("No Base64 code to copy!");
        return;
    }

    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = output;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);

    alert("✅ Base64 copied to clipboard!");
}
