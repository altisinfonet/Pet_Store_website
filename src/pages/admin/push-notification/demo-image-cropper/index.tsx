import { useState } from 'react'
import Cropper from 'react-easy-crop'

const DemoImageCropper = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [image, setImage] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [base64Image, setBase64Image] = useState<string | null>(null)

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
    console.log('Cropped area:', croppedArea)
    console.log('Cropped area pixels:', croppedAreaPixels)
  }

  // Handle image file upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        setImage(reader.result as string) // Set the image to be cropped
      }

      reader.readAsDataURL(file) // Read the file as a data URL
    }
  }

  // Function to generate base64 string from the cropped area
  const generateBase64FromCroppedArea = () => {
    if (image && croppedAreaPixels) {
      const imageObj = new Image()
      imageObj.src = image

      imageObj.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (ctx) {
          // Set canvas dimensions based on the cropped area
          canvas.width = croppedAreaPixels.width
          canvas.height = croppedAreaPixels.height

          // Draw the cropped image onto the canvas
          ctx.drawImage(
            imageObj,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
          )

          // Convert the canvas to a base64 string
          const base64String = canvas.toDataURL('image/jpeg')
          setBase64Image(base64String) // Store the base64 image string
          console.log('Generated base64 image string:', base64String)
        }
      }
    }
  }

  // Handle submission after cropping
  const handleSubmit = () => {
    if (base64Image) {
      console.log('Submission - Base64 image:', base64Image)
      // You can now send this base64 image string to the server or use it as needed
    } else {
      console.log('No cropped image yet.')
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: '20px' }}
      />

      {image && (
        <div className='relative h-[400px] w-[100%]'>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={10 / 4}
            onCropChange={setCrop}
            onCropComplete={onCropComplete} // Call onCropComplete and store cropped area pixels
            onZoomChange={setZoom}
          />
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={() => {
          generateBase64FromCroppedArea()
          handleSubmit()
        }}
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Submit
      </button>

      {/* Show the base64 image string */}
      {base64Image && (
        <div>
          <h3>Generated Base64 Image</h3>
          <img src={base64Image} alt="Cropped" style={{ maxWidth: '100%', marginTop: '20px' }} />
          <textarea
            readOnly
            value={base64Image}
            rows={5}
            style={{ width: '100%', marginTop: '10px' }}
          />
        </div>
      )}
    </div>
  )
}

export default DemoImageCropper
