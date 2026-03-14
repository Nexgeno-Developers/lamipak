import { fetchCompanyData } from '@/lib/api';
import VisionMission from './VisionMission';

/**
 * Vision & Mission Server Component
 * 
 * Fetches vision & mission data server-side and passes it to the component.
 */
export default async function VisionMissionServer() {
  const companyData = await fetchCompanyData();

  if (!companyData.visionMission) {
    return null;
  }

  return <VisionMission data={companyData.visionMission} />;
}
