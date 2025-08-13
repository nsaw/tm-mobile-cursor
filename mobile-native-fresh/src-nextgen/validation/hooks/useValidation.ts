import { useState, useEffect } from 'react';
import { validationService } from '../services/validationService';
import { ValidationReport } from '../types/validation';

export const useValidation = () => {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runValidation = async () => {
    try {
      setLoading(true);
      setError(null);
      const validationReport = await validationService.runAllValidations();
      setReport(validationReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    report,
    loading,
    error,
    runValidation,
  };
};
