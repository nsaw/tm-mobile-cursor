import { useState, useEffect } from 'react';
import { Organization } from '../types/organization';

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      const mockOrganizations: Organization[] = [
        {
          id: '1',
          name: 'Sample Organization',
          description: 'A sample organization for testing',
          memberCount: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setOrganizations(mockOrganizations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const refreshOrganizations = async () => {
    await fetchOrganizations();
  };

  return {
    organizations,
    loading,
    error,
    refetch: fetchOrganizations,
    refreshOrganizations,
  };
};
