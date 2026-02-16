import { client } from "@/sanity/client";

export async function uploadFileAsset(file, options = {}) {
    return client.assets.upload("file", file, options);
}

export async function uploadImageAsset(imageData, options = {}) {
    return client.assets.upload("image", imageData, options);
}
