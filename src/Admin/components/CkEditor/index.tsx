import React, { useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
}) as unknown as React.ComponentType<any>;
// import 'react-quill/dist/quill.snow.css';
// import 'quill/dist/quill.snow.css';
// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CkEditor = ({ value, handleChange }: Props) => {


    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
    ];

    return (
        <div>
            <ReactQuill theme="snow" value={value} onChange={handleChange} className='ReactQuill_root' modules={{ toolbar: toolbarOptions }} />
        </div>
    )
}

interface Props {
    handleChange?: any,
    value?: any
}

export default CkEditor