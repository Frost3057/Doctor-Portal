import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Share the root .env across services

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Helper function to convert file to generative part
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Prescription Reader Server is running!' });
});

// Prescription reader route
app.post('/api/read-prescription', upload.single('prescription'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No image file provided',
        message: 'Please upload a prescription image'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Gemini API key not configured'
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this prescription image and extract the following information:
      1. Medicine names
      2. Dosage for each medicine
      3. Frequency (how often to take)
      4. Duration (how long to take)
      5. Any special instructions

      Please format the response as a JSON object with the following structure:
      {
        "medicines": [
          {
            "name": "medicine name",
            "dosage": "dosage amount",
            "frequency": "frequency of intake",
            "duration": "duration of treatment",
            "instructions": "any special instructions"
          }
        ],
        "doctorName": "doctor name if visible",
        "patientName": "patient name if visible",
        "date": "prescription date if visible"
      }

      If any information is not clearly visible or readable, use "Not clearly visible" as the value.
    `;

    const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Try to parse the JSON response
    let parsedResponse;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      parsedResponse = {
        rawResponse: text,
        error: 'Could not parse structured response',
        medicines: []
      };
    }

    res.json({
      success: true,
      data: parsedResponse,
      message: 'Prescription analyzed successfully'
    });

  } catch (error) {
    console.error('Error processing prescription:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Failed to process prescription',
      message: error.message || 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Please upload an image smaller than 10MB'
      });
    }
  }
  
  res.status(500).json({
    error: 'Server error',
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Prescription reader endpoint: http://localhost:${PORT}/api/read-prescription`);
});