'use client';

import { useActionState } from 'react';
import { updateOrganization, updateProfile } from '@/app/actions/settings';

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  return <form action={action} className="mt-6 max-w-xl space-y-5"><Field name="name" label="Full name" defaultValue={name} /><ReadOnlyField label="Email address" value={email} /><button disabled={pending} className="bg-brand text-app min-h-11 rounded-lg px-5 text-sm font-semibold">{pending ? 'Saving…' : 'Save profile'}</button><Status state={state} /></form>;
}
export function OrganizationForm({ data, canManage }: { data: { name: string; website: string | null; industry: string | null; companySize: string | null; region: string | null }; canManage: boolean }) {
  const [state, action, pending] = useActionState(updateOrganization, undefined);
  return <form action={action} className="mt-6 max-w-xl space-y-5"><Field name="name" label="Organization name" defaultValue={data.name} disabled={!canManage} /><Field name="website" label="Website" defaultValue={data.website ?? ''} disabled={!canManage} /><Field name="industry" label="Industry" defaultValue={data.industry ?? ''} disabled={!canManage} /><Field name="companySize" label="Company size" defaultValue={data.companySize ?? ''} disabled={!canManage} /><Field name="region" label="Country or region" defaultValue={data.region ?? ''} disabled={!canManage} />{canManage ? <button disabled={pending} className="bg-brand text-app min-h-11 rounded-lg px-5 text-sm font-semibold">{pending ? 'Saving…' : 'Save organization'}</button> : <p className="text-text-muted text-sm">Contact an organization owner or admin to change these details.</p>}<Status state={state} /></form>;
}
function Field({ name, label, defaultValue, disabled }: { name: string; label: string; defaultValue: string; disabled?: boolean }) { return <div><label htmlFor={name} className="text-text-secondary mb-1.5 block text-sm">{label}</label><input id={name} name={name} defaultValue={defaultValue} disabled={disabled} className="bg-app border-border-strong min-h-11 w-full rounded-lg border px-3 text-sm disabled:opacity-60" /></div>; }
function ReadOnlyField({ label, value }: { label: string; value: string }) { return <div><span className="text-text-secondary mb-1.5 block text-sm">{label}</span><p className="bg-app border-border-subtle min-h-11 rounded-lg border px-3 py-3 text-sm">{value || 'Not available'}</p></div>; }
function Status({ state }: { state?: { error?: string; success?: boolean } }) { return state?.error ? <p role="alert" className="text-danger text-sm">{state.error}</p> : state?.success ? <p role="status" className="text-success text-sm">Changes saved.</p> : null; }
