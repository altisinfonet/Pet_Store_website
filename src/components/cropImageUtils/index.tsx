
export const getCroppedImg = (imageUrl: string, crop: any, zoom: number) => {
    return new Promise<Blob>((resolve, reject) => {
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = crop.width;
                canvas.height = crop.height;
                ctx.drawImage(
                    image,
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height,
                    0,
                    0,
                    crop.width,
                    crop.height
                );

                // Convert to Blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        console.log("CroppedBlob", blob); // Log the Blob to ensure it’s correct
                        resolve(blob);
                    } else {
                        reject('Failed to convert canvas to Blob');
                    }
                }, 'image/jpeg');
            } else {
                reject('Canvas context is not available');
            }
        };
        image.onerror = () => reject('Failed to load image');
    });
};

