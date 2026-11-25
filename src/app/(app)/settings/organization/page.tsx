import { SettingsNav } from '@/components/settings/settings-nav';
import { PrototypeOrganizationForm } from '@/components/settings/prototype-settings';
import { ILLUSTRATIVE_ORGANIZATIONS } from '@/mocks/organization.mock';

export default function OrganizationSettingsPage() {
  const organization = ILLUSTRATIVE_ORGANIZATIONS[0];
  return <div className="page-content"><div className="page-heading"><div><h1>Organization settings</h1><p>Illustrative organization profile and operating context.</p></div></div><div className="mt-7"><SettingsNav active="/settings/organization" /></div><PrototypeOrganizationForm name={organization.name} /><p className="text-text-muted mt-8 text-xs">No organization record is created. Changes are not saved in V1.</p></div>;
}
