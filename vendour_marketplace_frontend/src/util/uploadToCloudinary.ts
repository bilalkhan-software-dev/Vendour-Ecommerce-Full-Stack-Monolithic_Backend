import axios from "axios";

const cloud_name = "your-cloud-name";
const upload_preset = "your-upload-preset";

export const uploadToCloudinary = async (
    file: File,
    type: "image" | "video" | string,
    onProgress?: (percentCompleted: number) => void
) => {
    // Validate inputs
    if (!file || !type) {
        console.error("Missing file or type parameter");
        return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset);
    formData.append("cloud_name", cloud_name);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/${type}/upload`,
            formData,
            {
                onUploadProgress: (progressEvent) => {
                    if (onProgress && typeof onProgress === "function") {
                        let percentCompleted = 0;
                        if (progressEvent.total) {
                            percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                        }
                        onProgress(percentCompleted);
                    }
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.secure_url;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error; // Re-throw the error so calling code can handle it
    }
};
