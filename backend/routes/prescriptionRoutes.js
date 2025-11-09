import express from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/prescriptions';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Helper function to convert image to base64
const imageToBase64 = (filePath) => {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString('base64');
};

// Helper function to clean up uploaded file
const cleanupFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
};

// Test endpoint to verify API key
router.get('/test-api', async (req, res) => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Google API key not configured'
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      message: 'API key is working',
      response: text
    });
  } catch (error) {
    console.error('API test error:', error);
    res.status(500).json({
      success: false,
      message: 'API key test failed',
      error: error.message
    });
  }
});

// Prescription analysis route
router.post('/read-prescription', upload.single('prescription'), async (req, res) => {
  let uploadedFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No prescription image uploaded'
      });
    }

    uploadedFilePath = req.file.path;
    
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Google API key not configured'
      });
    }

    // Convert image to base64
    const imageBase64 = imageToBase64(uploadedFilePath);
    const mimeType = req.file.mimetype;

    // Get the generative model - use Gemini 1.5 Pro for image analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Create the prompt for prescription analysis
    const prompt = `
    Analyze this prescription image and extract the following information in JSON format:
    
    {
      "medicines": [
        {
          "name": "Medicine name",
          "dosage": "Dosage amount (e.g., 500mg, 10ml)",
          "frequency": "How often to take (e.g., Twice daily, Every 8 hours)",
          "duration": "How long to take (e.g., 7 days, 2 weeks)",
          "instructions": "Special instructions (e.g., Take after meals, Take on empty stomach)"
        }
      ],
      "doctorName": "Doctor's name if visible",
      "patientName": "Patient's name if visible", 
      "date": "Prescription date if visible (YYYY-MM-DD format)"
    }
    
    Instructions:
    - Extract all medicines mentioned in the prescription
    - If any field is not clearly visible or mentioned, use "Not specified" as the value
    - Ensure the JSON is valid and properly formatted
    - Focus on accuracy - only extract information that is clearly visible
    - For dosage, include both strength and form (e.g., "500mg tablet", "10ml syrup")
    - For frequency, be specific (e.g., "Once daily", "Twice daily", "Every 6 hours")
    - For duration, extract the exact period mentioned (e.g., "7 days", "2 weeks", "1 month")
    `;

    // Generate content with the image using Gemini 1.5 Pro
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean up the uploaded file
    cleanupFile(uploadedFilePath);

    // Parse the JSON response
    let parsedData;
    try {
      // Extract JSON from the response (remove any markdown formatting)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return res.status(500).json({
        success: false,
        message: 'Failed to parse prescription analysis results',
        error: parseError.message
      });
    }

    // Validate the parsed data structure
    if (!parsedData.medicines || !Array.isArray(parsedData.medicines)) {
      return res.status(500).json({
        success: false,
        message: 'Invalid prescription analysis format'
      });
    }

    // Return successful response
    res.json({
      success: true,
      data: parsedData,
      message: 'Prescription analyzed successfully'
    });

  } catch (error) {
    console.error('Prescription analysis error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      stack: error.stack
    });
    
    // Clean up the uploaded file in case of error
    if (uploadedFilePath) {
      cleanupFile(uploadedFilePath);
    }

    // Handle specific error types
    if (error.message.includes('API key') || error.status === 403) {
      return res.status(500).json({
        success: false,
        message: 'Invalid or missing Google API key. Please check your GOOGLE_API_KEY in environment variables.'
      });
    }

    if (error.status === 404) {
      return res.status(500).json({
        success: false,
        message: 'Gemini model not found. The API key might not have access to vision models.'
      });
    }

    if (error.message.includes('quota') || error.message.includes('limit') || error.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'API quota exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to analyze prescription',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;