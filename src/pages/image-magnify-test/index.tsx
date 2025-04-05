import React from 'react';
import ReactImageMagnify from 'react-image-magnify';

const ImageMagnify = () => {
    // Product image URLs
    const smallImage = 'https://huggingface.co/datasets/huggingfacejs/tasks/resolve/main/image-classification/image-classification-input.jpeg'; // Small image
    const largeImage = 'https://huggingface.co/datasets/huggingfacejs/tasks/resolve/main/image-classification/image-classification-input.jpeg'; // High-resolution image

    return (
        <div style={styles.container}>
            <div style={styles.imageContainer}>
                <ReactImageMagnify
                    {...{
                        smallImage: {
                            alt: 'Smartphone',
                            isFluidWidth: true,
                            src: smallImage,
                        },
                        largeImage: {
                            src: largeImage,
                            width: 1050,
                            height: 1200,
                        },
                        lensStyle: {
                            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Lens overlay color
                            cursor: 'zoom-in', // Cursor style
                        },
                        magnificationLevel: 2.5, // Zoom level
                        zoomPosition: 'right', // Zoomed image appears on the right
                        dragToMove: true, // Allow dragging the zoomed image
                        enlargedImageContainerStyle: {
                            zIndex: 2000, // Ensure the zoomed image appears above other elements
                        },
                        enlargedImageContainerDimensions: {
                            width: '100%', // Width of the zoomed image container
                            height: '250%', // Height of the zoomed image container
                        },
                    }}
                />
            </div>
            <div style={styles.productDetails}>
                <h2 style={styles.productTitle}>Samsung Galaxy S23 Ultra</h2>
                <p style={styles.productDescription}>
                    The Samsung Galaxy S23 Ultra is a premium smartphone with a 200MP camera, 8K video recording, and a 6.8-inch Dynamic AMOLED display.
                </p>
                <p style={styles.productPrice}>₹1,24,999</p>
                <button style={styles.addToCartButton}>Add to Cart</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '1200px',
        margin: '20px auto',
    },
    imageContainer: {
        flex: 1,
        maxWidth: '500px',
        marginRight: '40px',
    },
    productDetails: {
        flex: 1,
        maxWidth: '500px',
    },
    productTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    productDescription: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '20px',
    },
    productPrice: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#B12704',
        marginBottom: '20px',
    },
    addToCartButton: {
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#FFA41C',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};




export default ImageMagnify;