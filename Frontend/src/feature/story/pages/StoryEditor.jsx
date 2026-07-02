import { useState, useRef, useEffect } from "react";
import '../style/storyeditor.scss'
import EmojiPicker from "emoji-picker-react";
import { burnTextOnVideo } from "../../../Componenet/burnTextOnVideo";

const StoryEditor = ({ file, onClose, onShare }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [textItems, setTextItems] = useState([]);
    const [activeTextInput, setActiveTextInput] = useState(false);
    const [draftText, setDraftText] = useState("");
    const [isSharing, setIsSharing] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    const dragInfoRef = useRef(null);
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const stageRef = useRef(null);

    useEffect(() => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setMediaType(file.type.startsWith("video") ? "video" : "image");
        return () => URL.revokeObjectURL(url);
    }, [file]);
    async function burnTextOnImage() {
        return new Promise((resolve, reject) => {
            const img = imageRef.current;
            const canvas = canvasRef.current;

            if (!img || !canvas) {
                reject(new Error("Image ya canvas ref nahi mila"));
                return;
            }

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            textItems.forEach((item) => {
                ctx.save();
                const posX = (item.x / 100) * canvas.width;
                const posY = (item.y / 100) * canvas.height;
                ctx.translate(posX, posY);
                ctx.font = `${item.fontSize || 32}px sans-serif`;
                ctx.fillStyle = item.color || "#ffffff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(item.value, 0, 0);
                ctx.restore();
            });

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Canvas se blob banane mein fail ho gaya"));
                    return;
                }
                const finalFile = new File(
                    [blob],
                    `story_image_${Date.now()}.png`,
                    { type: "image/png" }
                );
                resolve(finalFile);
            }, "image/png");
        });
    }

    function handleAddTextClick() {
        setEditingId(null);     // naya text add ho raha hai, edit nahi
        setDraftText("");
        setActiveTextInput(true);
    }

    function confirmDraftText() {

        if (draftText.trim() === "") {
            setActiveTextInput(false);
            setEditingId(null);
            return;
        }

        if (editingId) {
            setTextItems((prev) =>
                prev.map((t) =>
                    t.id === editingId ? { ...t, value: draftText } : t
                )
            );
        } else {
            setTextItems((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    value: draftText,
                    x: 50,
                    y: 50,
                },
            ]);
        }

        setActiveTextInput(false);
        setDraftText("");
        setEditingId(null);
    }

    function removeTextItem(id) {
        setTextItems((prev) => prev.filter((t) => t.id !== id));
        setActiveMenuId(null);
    }

    function startEditTextItem(item) {
        setEditingId(item.id);
        setDraftText(item.value);
        setActiveTextInput(true);
        setActiveMenuId(null);
    }

    // ---------- TEXT DRAG (FIXED WITH IMAGE BOUNDS) ----------
    function handleTextPointerDown(e, item) {
        e.stopPropagation();

        const mediaEl = stageRef.current.querySelector(".story-editor-media");
        if (!mediaEl) return;

        const mediaRect = mediaEl.getBoundingClientRect();

        dragInfoRef.current = {
            id: item.id,
            element: e.currentTarget,
            startX: e.clientX,
            startY: e.clientY,
            origX: item.x,
            origY: item.y,
            mediaWidth: mediaRect.width,
            mediaHeight: mediaRect.height,
            moved: false, // 👈 naya — track karega ki drag hua ya nahi
        };

        window.addEventListener("pointermove", handleTextPointerMove);
        window.addEventListener("pointerup", handleTextPointerUp);
    }

    function handleTextPointerMove(e) {
        const info = dragInfoRef.current;
        if (!info) return;

        const dx = e.clientX - info.startX;
        const dy = e.clientY - info.startY;

        // Agar 4px se zyada move hua to "drag" maano, "click" nahi
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
            info.moved = true;
        }

        const dxPercent = (dx / info.mediaWidth) * 100;
        const dyPercent = (dy / info.mediaHeight) * 100;

        let newX = info.origX + dxPercent;
        let newY = info.origY + dyPercent;

        const textEl = info.element;
        let minX = 5, maxX = 95;
        let minY = 5, maxY = 95;

        if (textEl) {
            const textRect = textEl.getBoundingClientRect();
            const halfWidthPercent = ((textRect.width / 2) / info.mediaWidth) * 100;
            const halfHeightPercent = ((textRect.height / 2) / info.mediaHeight) * 100;

            minX = halfWidthPercent + 2;
            maxX = 100 - halfWidthPercent - 2;
            minY = halfHeightPercent + 2;
            maxY = 100 - halfHeightPercent - 2;
        }

        if (minX > maxX) { minX = 5; maxX = 95; }
        if (minY > maxY) { minY = 5; maxY = 95; }

        newX = Math.min(maxX, Math.max(minX, newX));
        newY = Math.min(maxY, Math.max(minY, newY));

        setTextItems((prev) =>
            prev.map((t) => (t.id === info.id ? { ...t, x: newX, y: newY } : t))
        );
    }

    function handleTextPointerUp() {
        const info = dragInfoRef.current;
        window.removeEventListener("pointermove", handleTextPointerMove);
        window.removeEventListener("pointerup", handleTextPointerUp);

        // Agar drag nahi hua (sirf tap/click hua), to Edit/Delete menu dikhao
        if (info && !info.moved) {
            setActiveMenuId(info.id);
        }

        dragInfoRef.current = null;
    }
    async function handleShare() {
        setIsSharing(true);
        try {
            let finalFile;
            if (mediaType === "image") {
                finalFile = await burnTextOnImage();
            } else {
                finalFile = await burnTextOnVideo(file, textItems);
            }
            await onShare(finalFile, textItems);
        } catch (err) {
            console.error("Story share karne mein error:", err);
            alert("Error: " + (err?.message || err));
            return; // 👈 yahan return zaroori hai
        } finally {
            setIsSharing(false);
        }
    }

    function wrapTextIntoLines(ctx, text, maxWidth) {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";

        words.forEach((word) => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine) lines.push(currentLine);
        return lines;
    }



    if (!previewUrl) return null;

    return (
        <div className="story-editor-overlay">
            <div className="story-editor-content">
                <div className="story-editor-topbar">
                    <button
                        className="story-editor-cancel"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                    <div className="story-editor-tools">

                        <button
                            className="story-editor-tool-btn"
                            onClick={() => setShowEmojiPicker(prev => !prev)}
                        >
                            😊
                        </button>

                        <button
                            className="story-editor-add-text"
                            onClick={handleAddTextClick}
                        >
                            Aa
                        </button>

                    </div>
                </div>
                {showEmojiPicker && (
                    <div className="story-editor-emoji-picker">
                        <EmojiPicker
                            onEmojiClick={(emojiData) => {
                                if (activeTextInput) {

                                    setDraftText((prev) => prev + emojiData.emoji);
                                } else {

                                    setTextItems((prev) => [
                                        ...prev,
                                        {
                                            id: Date.now(),
                                            value: emojiData.emoji,
                                            x: 50,
                                            y: 50,
                                        },
                                    ]);
                                }
                                setShowEmojiPicker(false);
                            }}
                        />
                    </div>
                )}
                <div className="story-editor-stage" ref={stageRef}>
                    {mediaType === "image" ? (
                        <img
                            ref={imageRef}
                            className="story-editor-media"
                            src={previewUrl}
                            alt="story preview"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <video
                            className="story-editor-media"
                            src={previewUrl}
                            autoPlay
                            loop
                            muted
                            crossOrigin="anonymous"
                        />
                    )}

                    {textItems.map((item) => (
                        <div
                            key={item.id}
                            className="story-editor-text-item"
                            style={{ left: `${item.x}%`, top: `${item.y}%` }}
                            onPointerDown={(e) => handleTextPointerDown(e, item)}
                        >
                            {item.value}

                            {activeMenuId === item.id && (
                                <div className="story-editor-text-actions">
                                    <button onClick={() => startEditTextItem(item)}>Edit</button>
                                    <button onClick={() => removeTextItem(item.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {activeTextInput && (
                    <div className="story-editor-text-modal">
                        <input
                            autoFocus
                            type="text"
                            value={draftText}
                            placeholder="Text likhein..."
                            onChange={(e) => setDraftText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && confirmDraftText()}
                        />
                        <button onClick={confirmDraftText}>
                            {editingId ? "Update" : "Done"}
                        </button>
                    </div>
                )}
                <div className="story-editor-bottombar">
                    <button
                        className="story-editor-share-btn"
                        onClick={handleShare}
                        disabled={isSharing}
                    >
                        {isSharing ? "Upload ho raha hai..." : "Apni Story"}
                    </button>
                </div>
                <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
        </div>
    );
};

export default StoryEditor;