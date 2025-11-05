import React, { useState, useRef } from 'react';
import { FiUpload, FiCamera, FiX, FiEye, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import usePrescriptionReader from '../hooks/usePrescriptionReader';

const PrescriptionReader = () => {
  const { analyzePrescription, loading, error } = usePrescriptionReader();
  const [result, setResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    try {
      const response = await analyzePrescription(selectedImage);
      setResult(response.data);
      toast.success('Prescription analyzed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to analyze prescription');
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadResults = () => {
    if (!result) return;
    
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Prescription Reader
        </h1>
        <p className="text-gray-600">
          Upload a prescription image to extract medicine details using AI
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          {!imagePreview ? (
            <div>
              <FiCamera className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Select a prescription image to analyze
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={loading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors disabled:opacity-50"
              >
                <FiUpload />
                Choose Image
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Supports JPEG, PNG, GIF, WebP (max 10MB)
              </p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Prescription preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <button
                onClick={clearSelection}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>

        {selectedImage && !loading && (
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={handleAnalyze}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiEye />
              Analyze Prescription
            </button>
            <button
              onClick={clearSelection}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Analyzing prescription...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
            <button
              onClick={downloadResults}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FiDownload />
              Download
            </button>
          </div>

          {/* Patient & Doctor Info */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {result.patientName && (
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Patient</h3>
                <p className="text-gray-600">{result.patientName}</p>
              </div>
            )}
            {result.doctorName && (
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Doctor</h3>
                <p className="text-gray-600">{result.doctorName}</p>
              </div>
            )}
            {result.date && (
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Date</h3>
                <p className="text-gray-600">{result.date}</p>
              </div>
            )}
          </div>

          {/* Medicines */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Prescribed Medicines ({result.medicines?.length || 0})
            </h3>
            <div className="space-y-4">
              {result.medicines?.map((medicine, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-semibold text-lg text-blue-600 mb-2">
                        {medicine.name}
                      </h4>
                      <p className="text-sm text-gray-500">Medicine Name</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{medicine.dosage}</p>
                      <p className="text-sm text-gray-500">Dosage</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{medicine.frequency}</p>
                      <p className="text-sm text-gray-500">Frequency</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{medicine.duration}</p>
                      <p className="text-sm text-gray-500">Duration</p>
                    </div>
                  </div>
                  {medicine.instructions && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-700">
                        <span className="font-medium">Instructions:</span> {medicine.instructions}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionReader;