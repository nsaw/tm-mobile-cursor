import { useUserSettings } from '@/hooks/useUserSettings';
import DashboardRecallLayout from '../variants/DashboardRecallLayout';
import DashboardOrganizeLayout from '../variants/DashboardOrganizeLayout';

const DashboardScreen = () => {
  const { layoutPreference } = useUserSettings();
  return layoutPreference === 'recall'
    ? <DashboardRecallLayout />
    : <DashboardOrganizeLayout />;
};
