import { SettingsNav } from '@/components/settings/settings-nav';

export default function SecuritySettingsPage() {
  return <div className="page-content"><div className="page-heading"><div><h1>Security</h1><p>Security screens are illustrative in the public prototype.</p></div></div><div className="mt-7"><SettingsNav active="/settings/security" /></div><section className="panel mt-6 max-w-3xl"><div className="panel-heading"><h2>Account security</h2><p>V1 does not create accounts or sessions. Password, verification, and session controls are part of the V2 platform foundation.</p></div></section><section className="panel mt-5 max-w-3xl"><div className="panel-heading"><h2>Organization access</h2><p>Roles and permissions shown elsewhere are sample data. They do not control access in this public preview.</p></div></section></div>;
}
