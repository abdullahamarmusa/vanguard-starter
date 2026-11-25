'use client';

import { useState } from 'react';
import { usePrototypeStore } from '@/store/prototype-context';

export function PrototypeProfileForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const { pushToast } = usePrototypeStore();
  const [value, setValue] = useState(name);
  return (
    <form
      className="mt-6 max-w-xl space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        pushToast({
          title: 'Preview only',
          description: 'Profile changes are not saved to an account in V1.',
          variant: 'info',
        });
      }}
    >
      <Field
        id="profile-name"
        label="Full name"
        value={value}
        onChange={setValue}
      />
      <ReadOnlyField label="Email address" value={email} />
      <button
        className="bg-brand text-app min-h-11 rounded-lg px-5 text-sm font-semibold"
        type="submit"
      >
        Preview save
      </button>
    </form>
  );
}

export function PrototypeOrganizationForm({ name }: { name: string }) {
  const { pushToast } = usePrototypeStore();
  const [value, setValue] = useState(name);
  return (
    <form
      className="mt-6 max-w-xl space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        pushToast({
          title: 'Preview only',
          description:
            'Organization changes are local to this screen and are not saved.',
          variant: 'info',
        });
      }}
    >
      <Field
        id="organization-name"
        label="Organization name"
        value={value}
        onChange={setValue}
      />
      <ReadOnlyField label="Website" value="https://acme.example" />
      <ReadOnlyField label="Industry" value="B2B software" />
      <ReadOnlyField label="Country or region" value="Bangladesh" />
      <button
        className="bg-brand text-app min-h-11 rounded-lg px-5 text-sm font-semibold"
        type="submit"
      >
        Preview save
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-text-secondary mb-1.5 block text-sm">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-app border-border-strong min-h-11 w-full rounded-lg border px-3 text-sm"
      />
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-text-secondary mb-1.5 block text-sm">{label}</span>
      <p className="bg-app border-border-subtle min-h-11 rounded-lg border px-3 py-3 text-sm">
        {value}
      </p>
    </div>
  );
}
