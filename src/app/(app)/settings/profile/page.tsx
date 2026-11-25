import { SettingsNav } from '@/components/settings/settings-nav';
import { PrototypeProfileForm } from '@/components/settings/prototype-settings';
import { ILLUSTRATIVE_USER } from '@/mocks/organization.mock';

export default function ProfileSettingsPage() {
  return <div className="page-content"><div className="page-heading"><div><h1>Profile settings</h1><p>Illustrative profile information for the public product preview.</p></div></div><div className="mt-7"><SettingsNav active="/settings/profile" /></div><PrototypeProfileForm name={ILLUSTRATIVE_USER.name} email={ILLUSTRATIVE_USER.email} /><p className="text-text-muted mt-8 text-xs">No account is created and changes are not saved in V1.</p></div>;
}
