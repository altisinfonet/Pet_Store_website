import { createImage } from '../createImage';

const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const fileUrl = URL.createObjectURL(blob);
            resolve(fileUrl);
        }, 'image/png');
    });
};

export default getCroppedImg;