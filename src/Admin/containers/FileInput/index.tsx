import { Button } from '@mui/material';
import { Upload } from '@mui/icons-material';
import FilterIcon from '@mui/icons-material/Filter';
import React, { useRef, useState } from 'react'

interface ImageFileInputProps {
    onImageSelected: (imageData: string | ArrayBuffer | null) => void;
    btnValue: string;  // Add btnValue here
}

const ImageFileInput: React.FC<ImageFileInputProps> = ({ onImageSelected, btnValue }) => {
    // const inputRef = useRef();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);


    const handleOnChange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.onload = function (e) {
                onImageSelected(reader.result)
            }
        }
    }

    const onChooseImage = () => {
        inputRef.current?.click()
    }
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <input type="file" accept="image/*" ref={inputRef} onChange={handleOnChange} style={{ display: "none" }} />

            <Button
                variant="contained"
                onClick={onChooseImage}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    backgroundColor: isHovered ? "#2271b1" : "transparent",
                    border: isHovered ? "none" : "1px solid #2271b1",
                    color: isHovered ? "#fff" : "#2271b1",
                    fontWeight: "bold",
                    padding: "6px 15px",
                    fontSize: "16px",
                    textTransform: "uppercase",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                }}
            >
                {btnValue === "Update Image" ?
                    <FilterIcon fontSize="small"
                        style={{ color: isHovered ? "#fff" : "#2271b1" }}
                    />
                    :
                    <Upload fontSize="small"
                        style={{ color: isHovered ? "#fff" : "#2271b1" }}
                    />
                }
                {btnValue ? `${btnValue}` : "Choose Image"}
            </Button>
        </div>
    )
}

export default ImageFileInput