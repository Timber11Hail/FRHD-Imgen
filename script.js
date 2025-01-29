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
    
    // Scale image down to 8x8 before processing
    canvas.width = 8;
    canvas.height = 8;
    ctx.drawImage(img, 0, 0, 8, 8);

    const imageData = ctx.getImageData(0, 0, 8, 8);
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
    navigator.clipboard.writeText(output).then(() => {
        alert("Base64 copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}
