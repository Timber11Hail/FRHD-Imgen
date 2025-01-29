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
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const edges = applySobelEdgeDetection(imageData);

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

function applySobelEdgeDetection(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const grayData = new Uint8Array(width * height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        let avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        grayData[i / 4] = avg;
    }

    const sobelData = new Uint8Array(width * height);
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0, gy = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let pixelVal = grayData[(y + i) * width + (x + j)];
                    gx += sobelX[(i + 1) * 3 + (j + 1)] * pixelVal;
                    gy += sobelY[(i + 1) * 3 + (j + 1)] * pixelVal;
                }
            }
            let magnitude = Math.sqrt(gx * gx + gy * gy);
            sobelData[y * width + x] = magnitude > 128 ? 255 : 0;
        }
    }
    return { data: sobelData, width, height };
}
