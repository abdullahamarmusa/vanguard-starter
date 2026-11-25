import { SettingsNav } from '@/components/settings/settings-nav';

export default function PreferencesPage() {
  return <div className="page-content"><div className="page-heading"><div><h1>Preferences</h1><p>Account-level options supported by VANGUARD.</p></div></div><div className="mt-7"><SettingsNav active="/settings/preferences" /></div><section className="panel mt-6 max-w-3xl"><div className="panel-heading"><h2>No saved preferences</h2><p>Account-specific notification, locale, and workflow preferences are not available yet. Display theme controls in the product remain local to this browser.</p></div></section></div>;
}
