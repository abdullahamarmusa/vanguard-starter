import { SettingsNav } from '@/components/settings/settings-nav';
import { ILLUSTRATIVE_MEMBERS } from '@/mocks/organization.mock';

export default function TeamSettingsPage() {
  return <div className="page-content"><div className="page-heading"><div><h1>Team members</h1><p>Illustrative people and roles for the public product preview.</p></div></div><div className="mt-7"><SettingsNav active="/settings/team" /></div><section className="panel mt-6 max-w-3xl"><div className="panel-heading"><h2>Sample members</h2><p>These records do not grant access to a real organization.</p></div>{ILLUSTRATIVE_MEMBERS.map((row) => <div key={row.id} className="border-border-subtle flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4"><div><p className="text-sm font-medium">{row.name}</p><p className="text-text-muted mt-1 text-xs">{row.email}</p></div><span className="badge-brand rounded-full px-3 py-1 text-xs capitalize">{row.role}</span></div>)}</section><p className="text-text-muted mt-4 max-w-2xl text-sm">Invitations and role changes are not available in this V1 preview.</p></div>;
}
