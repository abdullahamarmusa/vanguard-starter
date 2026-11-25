'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { finishOnboarding } from '@/app/actions/onboarding';

const goals = ['Find companies that fit my offer', 'Build an ideal customer profile', 'Qualify and prioritize prospects', 'Prepare personalized outreach', 'Improve my prospecting workflow'];

export function OnboardingForm({ initialName }: { initialName: string }) {
  const [step, setStep] = useState(0);
  const [review, setReview] = useState({ organization: '', role: '', goals: [] as string[] });
  const [state, action, pending] = useActionState(finishOnboarding, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const saved = sessionStorage.getItem('vanguard.onboarding.progress');
    if (!saved || !formRef.current) return;
    try {
      const values = JSON.parse(saved) as { step?: number; fields?: Record<string, string[]> };
      for (const [name, entries] of Object.entries(values.fields ?? {})) {
        for (const control of Array.from(formRef.current.elements).filter((element): element is HTMLInputElement | HTMLSelectElement => (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) && element.name === name)) {
          if (control instanceof HTMLInputElement && control.type === 'checkbox') control.checked = entries.includes(control.value);
          else control.value = entries[0] ?? '';
        }
      }
      window.requestAnimationFrame(() => {
        setStep(Math.max(0, Math.min(3, values.step ?? 0)));
        setReview({ organization: values.fields?.organizationName?.[0] ?? '', role: values.fields?.role?.[0] ?? '', goals: values.fields?.goals ?? [] });
      });
    } catch { sessionStorage.removeItem('vanguard.onboarding.progress'); }
  }, []);
  function saveProgress(nextStep = step) {
    if (!formRef.current) return;
    const fields: Record<string, string[]> = {};
    for (const element of Array.from(formRef.current.elements)) {
      if ((element instanceof HTMLInputElement || element instanceof HTMLSelectElement) && element.name) {
        if (!fields[element.name]) fields[element.name] = [];
        if (element instanceof HTMLInputElement && element.type === 'checkbox') { if (element.checked) fields[element.name].push(element.value); }
        else fields[element.name].push(element.value);
      }
    }
    sessionStorage.setItem('vanguard.onboarding.progress', JSON.stringify({ step: nextStep, fields }));
  }
  return <main className="bg-app text-text-primary min-h-screen px-4 py-8 sm:px-8 sm:py-12">
    <div className="mx-auto max-w-2xl">
      <Link href="/" className="font-display text-sm font-bold tracking-[.16em]">VANGUARD</Link>
      <div className="mt-10 flex items-center justify-between"><p className="text-text-muted font-mono text-xs tracking-widest">WORKSPACE SETUP</p><p className="text-text-muted text-xs">Step {step + 1} of 4</p></div>
      <div className="bg-surface mt-3 h-1 rounded-full"><div className="bg-brand h-1 rounded-full transition-[width]" style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
      <form ref={formRef} action={action} onChange={() => saveProgress()} className="bg-surface border-border-subtle mt-8 rounded-2xl border p-6 sm:p-9">
        <section hidden={step !== 0} aria-labelledby="welcome-title">
          <p className="text-teal-brand font-mono text-xs tracking-widest uppercase">A clearer view of opportunity</p><h1 id="welcome-title" className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Let’s build your intelligence workspace.</h1><p className="text-text-secondary mt-3 max-w-xl text-sm leading-relaxed">Set up your organization so VANGUARD can organize your commercial intelligence, qualification workflows, and team activity.</p>
          <div className="mt-8 grid gap-4"><TextField name="name" label="Your name" defaultValue={initialName} /><TextField name="organizationName" label="Organization name" placeholder="Acme, Inc." /><TextField name="website" label="Organization website (optional)" placeholder="https://example.com" /></div>
        </section>
        <section hidden={step !== 1} aria-labelledby="profile-title">
          <p className="text-teal-brand font-mono text-xs tracking-widest uppercase">Organization profile</p><h2 id="profile-title" className="font-display mt-3 text-3xl font-semibold tracking-tight">A little context helps.</h2><p className="text-text-secondary mt-2 text-sm">Optional details help keep your workspace organized.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2"><SelectField name="industry" label="Industry" options={['Software & technology','Professional services','Financial services','Healthcare','Manufacturing','Other']} /><SelectField name="companySize" label="Company size" options={['1–10','11–50','51–200','201–1,000','1,001+','Prefer not to say']} /><TextField name="region" label="Country or region" placeholder="United States" /><SelectField name="organizationType" label="Organization type" options={['B2B company','Agency or consultancy','Nonprofit','Other']} /></div>
        </section>
        <section hidden={step !== 2} aria-labelledby="goals-title">
          <p className="text-teal-brand font-mono text-xs tracking-widest uppercase">Your role & objectives</p><h2 id="goals-title" className="font-display mt-3 text-3xl font-semibold tracking-tight">What would you like to accomplish?</h2><p className="text-text-secondary mt-2 text-sm">Choose any that fit. You can change your direction later.</p>
          <label htmlFor="role" className="text-text-secondary mt-6 mb-2 block text-sm font-medium">Your role</label><select id="role" name="role" defaultValue="" className="bg-app border-border-strong min-h-12 w-full rounded-lg border px-3 text-sm"><option value="">Choose a role (optional)</option>{['Founder / CEO','Sales leader','Business development','Revenue operations','Marketing','Consultant / Agency','Other'].map((item) => <option key={item}>{item}</option>)}</select>
          <fieldset className="mt-6 grid gap-2"><legend className="text-text-secondary mb-2 text-sm font-medium">Primary objective</legend>{goals.map((goal, index) => <label key={goal} className="border-border-subtle bg-app flex min-h-12 items-center gap-3 rounded-lg border px-3 text-sm"><input type="checkbox" name="goals" value={goal} defaultChecked={index === 0} className="accent-amber-500 h-4 w-4" />{goal}</label>)}</fieldset>
        </section>
        <section hidden={step !== 3} aria-labelledby="review-title">
          <p className="text-teal-brand font-mono text-xs tracking-widest uppercase">Review</p><h2 id="review-title" className="font-display mt-3 text-3xl font-semibold tracking-tight">Your workspace is ready to take shape.</h2><p className="text-text-secondary mt-2 text-sm">Confirm the organization context before creating your private workspace.</p>
          <dl className="border-border-subtle mt-7 divide-y rounded-xl border px-4"><ReviewRow label="Organization" value={review.organization || 'Organization name not entered'} /><ReviewRow label="Workspace" value={`${review.organization || 'Organization'} workspace`} /><ReviewRow label="Your role" value={review.role || 'Not specified'} /><ReviewRow label="Objective" value={review.goals[0] || 'Not specified'} /></dl>
        </section>
        {state?.error && <p role="alert" className="text-danger mt-5 text-sm">{state.error}</p>}
        <div className="border-border-subtle mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
          {step > 0 ? <button type="button" onClick={() => { saveProgress(step - 1); setStep(step - 1); }} className="border-border-strong min-h-12 rounded-lg border px-5 text-sm font-medium">Back</button> : <span />}
          {step < 3 ? <button type="button" onClick={() => { const values = new FormData(formRef.current!); if (step === 2) setReview({ organization: String(values.get('organizationName') || ''), role: String(values.get('role') || ''), goals: values.getAll('goals').map(String) }); saveProgress(step + 1); setStep(step + 1); }} className="bg-brand text-app min-h-12 rounded-lg px-6 text-sm font-semibold">{step === 2 ? 'Review workspace' : 'Continue'}</button> : <button disabled={pending} onClick={() => saveProgress()} className="bg-brand text-app min-h-12 rounded-lg px-6 text-sm font-semibold disabled:opacity-60">{pending ? 'Creating workspace…' : 'Create workspace'}</button>}
        </div>
      </form>
      <p className="text-text-muted mt-5 text-center text-xs">Your organization belongs to the account that creates it. Team access can be managed later.</p>
    </div>
  </main>;
}

function TextField({ name, label, defaultValue, placeholder }: { name: string; label: string; defaultValue?: string; placeholder?: string }) {
  return <div><label htmlFor={name} className="text-text-secondary mb-1.5 block text-sm font-medium">{label}</label><input id={name} name={name} defaultValue={defaultValue} placeholder={placeholder} className="bg-app border-border-strong min-h-12 w-full rounded-lg border px-3.5 text-sm" /></div>;
}
function SelectField({ name, label, options }: { name: string; label: string; options: string[] }) {
  return <div><label htmlFor={name} className="text-text-secondary mb-1.5 block text-sm font-medium">{label}</label><select id={name} name={name} defaultValue="" className="bg-app border-border-strong min-h-12 w-full rounded-lg border px-3 text-sm"><option value="">Select an option</option>{options.map((item) => <option key={item}>{item}</option>)}</select></div>;
}
function ReviewRow({ label, value }: { label: string; value: string }) { return <div className="grid gap-1 py-3 sm:grid-cols-[130px_minmax(0,1fr)]"><dt className="text-text-muted text-xs">{label}</dt><dd className="text-sm">{value}</dd></div>; }
