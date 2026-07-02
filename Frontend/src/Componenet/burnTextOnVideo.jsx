export async function burnTextOnVideo(videoFile, textItems = []) {
    return new Promise((resolve, reject) => {
        try {
            const videoEl = document.createElement("video");
            videoEl.muted = true;
            videoEl.playsInline = true;
            videoEl.crossOrigin = "anonymous";
            videoEl.src = URL.createObjectURL(videoFile);

            videoEl.onloadedmetadata = async () => {
                const width = videoEl.videoWidth;
                const height = videoEl.videoHeight;

                if (!width || !height) {
                    reject(new Error("Video dimensions nahi mil payi (videoWidth/videoHeight 0 hai)"));
                    return;
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                // ---- Canvas se video stream banao ----
                if (!canvas.captureStream) {
                    reject(new Error("Yeh browser canvas.captureStream support nahi karta"));
                    return;
                }
                const canvasStream = canvas.captureStream(30); // 30 fps

                // ---- Original video ka audio track nikal kar add karo ----
                let combinedStream = canvasStream;
                try {
                    const audioCapture = videoEl.captureStream
                        ? videoEl.captureStream()
                        : videoEl.mozCaptureStream
                            ? videoEl.mozCaptureStream()
                            : null;

                    if (audioCapture) {
                        const audioTracks = audioCapture.getAudioTracks();
                        if (audioTracks.length > 0) {
                            combinedStream = new MediaStream([
                                ...canvasStream.getVideoTracks(),
                                ...audioTracks,
                            ]);
                        }
                    }
                } catch (audioErr) {
                    console.log("Audio capture mein issue, video mute rahega:", audioErr);
                }

                // ---- MediaRecorder setup ----
                if (typeof MediaRecorder === "undefined") {
                    reject(new Error("Yeh browser MediaRecorder support nahi karta"));
                    return;
                }

                const mimeType = getSupportedMimeType();
                const recordedChunks = [];

                let recorder;
                try {
                    recorder = new MediaRecorder(combinedStream, {
                        mimeType,
                        videoBitsPerSecond: 5_000_000,
                    });
                } catch (recErr) {
                    reject(recErr);
                    return;
                }

                recorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) recordedChunks.push(e.data);
                };

                recorder.onstop = () => {
                    URL.revokeObjectURL(videoEl.src);

                    if (recordedChunks.length === 0) {
                        reject(new Error("Koi video data record nahi hua — recordedChunks khali hai"));
                        return;
                    }

                    const baseMimeType = mimeType.split(";")[0].trim();

                    const blob = new Blob(recordedChunks, { type: baseMimeType }); // baseMimeType use karo
                    const extension = baseMimeType.includes("mp4") ? "mp4" : "webm";
                    const finalFile = new File(
                        [blob],
                        `story_video_${Date.now()}.${extension}`,
                        { type: baseMimeType } // yahan bhi
                    );
                    resolve(finalFile);
                };

                recorder.onerror = (err) => {
                    console.error("MediaRecorder error:", err);
                    reject(err);
                };

                // ---- Drawing loop: har frame pe video + text/emoji draw karo ----
                let drawing = true;

                function drawFrame() {
                    if (!drawing) return;

                    ctx.clearRect(0, 0, width, height);
                    try {
                        ctx.drawImage(videoEl, 0, 0, width, height);
                    } catch (drawErr) {
                        console.error("Frame draw karne mein error (canvas tainted ho sakta hai):", drawErr);
                    }

                    // textItems ko draw karo
                    textItems.forEach((item) => {
                        if (!item.value) return; // koi text/emoji nahi to skip

                        ctx.save();

                        // x/y StoryEditor mein PERCENTAGE (0-100) hote hain, isliye /100
                        const posX = ((item.x ?? 50) / 100) * width;
                        const posY = ((item.y ?? 50) / 100) * height;

                        ctx.translate(posX, posY);
                        if (item.rotation) {
                            ctx.rotate((item.rotation * Math.PI) / 180);
                        }

                        ctx.font = `${item.fontSize || 32}px ${item.fontFamily || "sans-serif"
                            }`;
                        ctx.fillStyle = item.color || "#ffffff";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";

                        ctx.fillText(item.value, 0, 0);

                        ctx.restore();
                    });

                    requestAnimationFrame(drawFrame);
                }

                // ---- Video play + record start ----
                videoEl.onplay = () => {
                    recorder.start();
                    drawFrame();
                };

                videoEl.onended = () => {
                    drawing = false;
                    recorder.stop();
                };

                try {
                    await videoEl.play();
                } catch (playErr) {
                    console.error("Video play karne mein error:", playErr);
                    reject(playErr);
                }
            };

            videoEl.onerror = (err) => {
                console.error("Video element load error:", err);
                reject(new Error("Video load nahi ho payi — file corrupt ya unsupported format ho sakta hai"));
            };
        } catch (err) {
            reject(err);
        }
    });
}
function getSupportedMimeType() {
    const types = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
        "video/mp4",
    ];
    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return "video/webm";
}