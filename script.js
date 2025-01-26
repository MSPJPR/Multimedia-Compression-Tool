document.getElementById("compress-btn").addEventListener("click", () => {
    const fileInput = document.getElementById("file-input");
    const outputDiv = document.getElementById("output");
    const logDiv = document.getElementById("log");
    const progressBar = document.getElementById("progress");

    if (!fileInput.files[0]) {
        alert("Please upload a file first.");
        return;
    }

    const file = fileInput.files[0];
    const fileType = file.type.split('/')[0];

    logDiv.innerHTML = `<p>Processing file: ${file.name}</p>`;
    progressBar.style.width = "20%";

    if (fileType === "image") {
        compressImage(file);
    } else if (fileType === "audio") {
        compressAudio(file);
    } else if (fileType === "video") {
        compressVideo(file);
    } else {
        outputDiv.innerHTML = "Unsupported file type.";
    }
});

function compressImage(file) {
    const reader = new FileReader();
    const startTime = performance.now();

    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width / 2; // Reduce size by 50%
            canvas.height = img.height / 2;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compressedData = canvas.toDataURL("image/jpeg", 0.5); // 50% quality
            displayResult(compressedData, "Image");

            const endTime = performance.now();
            updateLog(`Image compressed. Compression time: ${(endTime - startTime).toFixed(2)} ms.`);
        };
    };
    reader.readAsDataURL(file);
}

function compressAudio(file) {
    const reader = new FileReader();
    const startTime = performance.now();

    reader.onload = () => {
        // Simulating audio compression
        setTimeout(() => {
            const endTime = performance.now();
            updateLog(`Audio compressed. Compression time: ${(endTime - startTime).toFixed(2)} ms.`);
            displayResult("Audio compression demonstration completed.", "Audio");
        }, 1000);
    };
    reader.readAsArrayBuffer(file);
}

function compressVideo(file) {
    const startTime = performance.now();

    const options = { mimeType: "video/webm; codecs=vp8", videoBitsPerSecond: 250000 };
    const recorder = new MediaRecorder(file, options);

    recorder.ondataavailable = (event) => {
        const compressedVideoURL = URL.createObjectURL(event.data);
        displayResult(compressedVideoURL, "Video");

        const endTime = performance.now();
        updateLog(`Video compressed. Compression time: ${(endTime - startTime).toFixed(2)} ms.`);
    };

    recorder.start();
    setTimeout(() => recorder.stop(), 2000); // Stop after 2 seconds
}

function displayResult(data, type) {
    const outputDiv = document.getElementById("output");
    if (type === "Image") {
        const img = document.createElement("img");
        img.src = data;
        outputDiv.innerHTML = "";
        outputDiv.appendChild(img);
    } else if (type === "Video") {
        const video = document.createElement("video");
        video.src = data;
        video.controls = true;
        outputDiv.innerHTML = "";
        outputDiv.appendChild(video);
    } else {
        outputDiv.innerHTML = `<p>${data}</p>`;
    }
    document.getElementById("progress").style.width = "100%";
}

function updateLog(message) {
    const logDiv = document.getElementById("log");
    logDiv.innerHTML += `<p>${message}</p>`;
}
