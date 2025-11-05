# Prescription Reader Server

A Node.js/Express server that uses Google's Gemini AI to analyze prescription images and extract medicine information.

## Features

- Image upload handling with multer
- Gemini AI integration for prescription analysis
- Structured JSON response with medicine details
- Error handling and validation
- CORS enabled for frontend integration

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Configure environment variables:
   - Copy `.env` file and add your Gemini API key
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

## API Endpoints

### POST /api/read-prescription

Analyzes a prescription image and returns extracted information.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with 'prescription' field containing the image file

**Response:**
```json
{
  "success": true,
  "data": {
    "medicines": [
      {
        "name": "Medicine Name",
        "dosage": "500mg",
        "frequency": "Twice daily",
        "duration": "7 days",
        "instructions": "Take after meals"
      }
    ],
    "doctorName": "Dr. Name",
    "patientName": "Patient Name",
    "date": "2024-01-01"
  },
  "message": "Prescription analyzed successfully"
}
```

## Supported Image Formats

- JPEG/JPG
- PNG
- GIF
- WebP
- Maximum file size: 10MB