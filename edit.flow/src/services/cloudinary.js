const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (file, resourceType = 'auto', uploadProgressCallback = null) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    if (resourceType === 'raw') {
        const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const safeName = file.name.replace(/[^a-zA-Z0-9]/g, "_");
        formData.append("public_id", `secure_assets/${uniqueId}_${safeName}`);
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`);

        if (uploadProgressCallback) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    uploadProgressCallback(Math.round((event.loaded / event.total) * 100));
                }
            };
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText).secure_url);
            } else {
                reject(new Error("Upload failed"));
            }
        };
        xhr.onerror = () => reject(new Error("Network Error"));
        xhr.send(formData);
    });
};
