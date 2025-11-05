import { useState } from 'react';
import axios from 'axios';

const usePrescriptionReader = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzePrescription = async (imageFile) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('prescription', imageFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/read-prescription`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze prescription');
      setLoading(false);
      throw err;
    }
  };

  return { analyzePrescription, loading, error };
};

export default usePrescriptionReader;