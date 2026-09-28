import { isMockMode } from "./config";
import { request } from "./apiClient";

export async function uploadImage(file, { avatar = false } = {}) {
  if (
    ![
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/x-ms-bmp",
      "image/webp",
    ].includes(file.type)
  )
    throw new Error("Choose a JPG, PNG, GIF, BMP, or WebP image.");
  if (file.size > 20 * 1024 * 1024)
    throw new Error("Each photo must be 20 MB or smaller.");
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(
          new Error(
            "This image could not be opened. Choose another file or retry.",
          ),
        );
      img.src = objectUrl;
    });
    if (!avatar && (image.width < 600 || image.height < 400))
      throw new Error("Property photos must be at least 600 × 400 pixels.");
    if (!isMockMode) {
      const data = new FormData();
      data.append("file", file);
      data.append("purpose", avatar ? "avatar" : "property");
      return request("/uploads", { method: "POST", data });
    }
    const scale = Math.min(
      1,
      (avatar ? 400 : 1600) / Math.max(image.width, image.height),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("Image processing is unavailable in this browser.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return { url: canvas.toDataURL("image/jpeg", 0.8) };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
