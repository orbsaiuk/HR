
export function getFileUrl(fileRef, projectId, dataset) {
    if (!fileRef || !projectId || !dataset) {
        return null;
    }

    try {
        // Sanity file references follow the pattern: file-{id}-{extension}
        // Example: file-abc123def456-pdf
        const match = fileRef.match(/^file-([a-zA-Z0-9]+)-([a-z0-9]+)$/);

        if (!match) {
            console.warn('Invalid Sanity file reference format:', fileRef);
            return null;
        }

        const [, fileId, extension] = match;

        // Construct the CDN URL
        // Format: https://cdn.sanity.io/files/{projectId}/{dataset}/{fileId}.{extension}
        return `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileId}.${extension}`;
    } catch (error) {
        console.error('Error generating file URL:', error);
        return null;
    }
}

export function getFileUrlFromAnswer(answer) {
    if (!answer?.fileAsset?.asset?._ref) {
        return null;
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

    return getFileUrl(answer.fileAsset.asset._ref, projectId, dataset);
}
