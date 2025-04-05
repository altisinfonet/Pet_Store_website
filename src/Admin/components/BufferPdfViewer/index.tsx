import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';

interface BufferPDFViewerProps {
    buffer: ArrayBuffer | null;
}

const BufferPDFViewer: React.FC<BufferPDFViewerProps> = ({ buffer }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        if (buffer) {
            const blob = new Blob([buffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        }
    }, [buffer]);

    return (
        <div>
            {pdfUrl && (
                <Document file={pdfUrl}>
                    <Page pageNumber={1} />
                </Document>
            )}
        </div>
    );
};

export default BufferPDFViewer;
