'use client';

import { useActionState, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { registerAccount, requestPasswordReset, resendVerification, resetPassword, verifyEmailToken } from '@/app/actions/auth';

function callbackPath(value: string | null) {
  if (!value?.startsWith('/') || value.includes('\\')) return '/onboarding';
  const target = new URL(value, window.location.origin);
  return target.origin === window.location.origin
    ? `${target.pathname}${target.search}${target.hash}`
    : '/onboarding';
}

export function SignInForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  return <form className="mt-6 grid gap-4" onSubmit={(event) => {
    event.preventDefault(); setError(''); const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await signIn('credentials', { email: form.get('email'), password: form.get('password'), redirect: false, callbackUrl: callbackPath(search.get('callbackUrl')) });
      if (result?.error) setError('The email or password could not be verified. Check your details and try again.');
      else router.push(callbackPath(search.get('callbackUrl')));
    });
  }}>
    <h1 className="font-display text-3xl font-semibold tracking-[-.04em]">Welcome back.</h1>
    <p className="text-text-secondary -mt-2 text-sm">Sign in to continue to your workspace.</p>
    <Field label="Work email" name="email" type="email" autoComplete="email" />
    <div><div className="mb-1.5 flex items-center justify-between"><label htmlFor="password" className="text-text-secondary text-sm font-medium">Password</label><Link className="text-teal-brand text-xs hover:underline" href="/forgot-password">Forgot password?</Link></div><SecretInput visible={visible} toggle={() => setVisible(!visible)} autoComplete="current-password" /></div>
    {error && <p role="alert" className="text-danger text-sm">{error}</p>}
    <button disabled={pending} className="bg-brand text-app hover:bg-amber-300 focus-visible:outline-brand mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors disabled:opacity-60">{pending && <LoaderCircle className="h-4 w-4 animate-spin" />}{pending ? 'Signing in…' : 'Sign in'}</button>
    <p className="text-text-secondary pt-1 text-center text-sm">New to VANGUARD? <Link className="text-brand font-semibold hover:underline" href="/sign-up">Create an account</Link></p>
  </form>;
}

export function SignUpForm() {
  const [visible, setVisible] = useState(false); const [error, setError] = useState(''); const [verificationEmail, setVerificationEmail] = useState(''); const [pending, startTransition] = useTransition();
  if (verificationEmail) return <div className="mt-6"><h1 className="font-display text-3xl font-semibold tracking-[-.04em]">Check your inbox.</h1><p className="text-text-secondary mt-3 text-sm leading-relaxed">Your account is created, but sign-in is available after email verification. Follow the link we sent to <strong className="text-text-primary">{verificationEmail}</strong>.</p><p className="text-text-muted mt-4 text-xs">If the message does not arrive, <Link href={`/verify-email?email=${encodeURIComponent(verificationEmail)}`} className="text-teal-brand underline">request another verification email</Link>.</p></div>;
  return <form className="mt-6 grid gap-4" onSubmit={(event) => {
    event.preventDefault(); setError(''); const form = new FormData(event.currentTarget);
    if (!form.get('terms')) { setError('Accept the Terms and Privacy Policy to create an account.'); return; }
    startTransition(async () => {
      const result = await registerAccount(undefined, form);
      if (result.error) { setError(result.error); return; }
      setVerificationEmail(String(form.get('email')));
    });
  }}>
    <h1 className="font-display text-3xl font-semibold tracking-[-.04em]">Create your VANGUARD account.</h1>
    <p className="text-text-secondary -mt-2 text-sm leading-relaxed">Build a clearer path from your offer to qualified business opportunities.</p>
    <Field label="Full name" name="name" autoComplete="name" />
    <Field label="Work email" name="email" type="email" autoComplete="email" />
    <div><label htmlFor="password" className="text-text-secondary mb-1.5 block text-sm font-medium">Password</label><SecretInput visible={visible} toggle={() => setVisible(!visible)} autoComplete="new-password" /><p className="text-text-muted mt-2 text-xs leading-relaxed">At least 12 characters with upper and lowercase letters, a number, and a symbol.</p></div>
    <div className="text-text-secondary flex items-start gap-2.5 text-xs leading-relaxed"><input id="terms" name="terms" aria-label="Agree to the Terms and acknowledge the Privacy Policy" type="checkbox" className="accent-amber-500 mt-0.5 h-4 w-4 shrink-0" /><span>I agree to the <Link className="text-text-primary underline" href="/terms">Terms</Link> and have read the <Link className="text-text-primary underline" href="/privacy">Privacy Policy</Link>.</span></div>
    {error && <p role="alert" className="text-danger text-sm">{error}</p>}
    <button disabled={pending} className="bg-brand text-app hover:bg-amber-300 mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold disabled:opacity-60">{pending && <LoaderCircle className="h-4 w-4 animate-spin" />}{pending ? 'Creating account…' : 'Create account'}</button>
    <p className="text-text-secondary pt-1 text-center text-sm">Already have an account? <Link className="text-brand font-semibold hover:underline" href="/sign-in">Sign in</Link></p>
  </form>;
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  return <form action={action} className="mt-6 grid gap-4"><label htmlFor="email" className="text-text-secondary text-sm font-medium">Work email</label><input required id="email" name="email" type="email" autoComplete="email" className="bg-app border-border-strong min-h-12 rounded-lg border px-3.5 text-sm" /><button disabled={pending} className="bg-brand text-app min-h-12 rounded-lg text-sm font-semibold disabled:opacity-60">{pending ? 'Sending…' : 'Send reset instructions'}</button>{state?.message && <p role="status" className="text-text-secondary text-sm">{state.message}</p>}<Link href="/sign-in" className="text-teal-brand text-sm">Return to sign in</Link></form>;
}

export function VerifyEmailForm({ token = '', initialEmail = '' }: { token?: string; initialEmail?: string }) {
  const [state, action, pending] = useActionState(verifyEmailToken, undefined);
  const [resend, resendAction, resendPending] = useActionState(resendVerification, undefined);
  if (state?.verified) return <div className="mt-6"><h1 className="font-display text-3xl font-semibold">Email verified.</h1><p className="text-text-secondary mt-2 text-sm">Your address is verified. You can now sign in.</p><Link href="/sign-in" className="bg-brand text-app mt-6 flex min-h-12 items-center justify-center rounded-lg text-sm font-semibold">Continue to sign in</Link></div>;
  return <><h1 className="font-display mt-6 text-3xl font-semibold tracking-[-.04em]">Verify your email.</h1><p className="text-text-secondary mt-2 text-sm leading-relaxed">{token ? 'We’ll verify the link with the server before showing success.' : 'Enter the address used to create your account to request a verification link.'}</p>{token && <form action={action} className="mt-5"><input type="hidden" name="token" value={token} /><button disabled={pending} className="bg-brand text-app min-h-12 w-full rounded-lg text-sm font-semibold">{pending ? 'Verifying…' : 'Verify email address'}</button>{state?.error && <p role="alert" className="text-danger mt-3 text-sm">{state.error}</p>}</form>}<form action={resendAction} className="mt-5 grid gap-3"><label htmlFor="resend-email" className="text-text-secondary text-sm font-medium">Resend verification email</label><input id="resend-email" name="email" type="email" required defaultValue={initialEmail} autoComplete="email" className="bg-app border-border-strong min-h-12 rounded-lg border px-3.5 text-sm" /><button disabled={resendPending} className="border-border-strong min-h-11 rounded-lg border text-sm">{resendPending ? 'Requesting…' : 'Resend verification'}</button>{resend?.message && <p role="status" className="text-text-secondary text-sm">{resend.message}</p>}</form><Link href="/sign-in" className="text-teal-brand mt-5 inline-block text-sm">Return to sign in</Link></>;
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [visible, setVisible] = useState(false); const [state, action, pending] = useActionState(resetPassword, undefined);
  if (state?.complete) return <div className="mt-6"><h1 className="font-display text-3xl font-semibold">Password updated.</h1><p className="text-text-secondary mt-2 text-sm">Sign in with your new password.</p><Link href="/sign-in" className="bg-brand text-app mt-6 flex min-h-12 items-center justify-center rounded-lg text-sm font-semibold">Return to sign in</Link></div>;
  return <form action={action} className="mt-6 grid gap-4"><h1 className="font-display text-3xl font-semibold tracking-[-.04em]">Choose a new password.</h1><input type="hidden" name="token" value={token} /><label htmlFor="password" className="text-text-secondary text-sm font-medium">New password</label><SecretInput visible={visible} toggle={() => setVisible(!visible)} autoComplete="new-password" /><p className="text-text-muted text-xs">At least 12 characters with upper and lowercase letters, a number, and a symbol.</p><label htmlFor="confirmPassword" className="text-text-secondary text-sm font-medium">Confirm new password</label><input required id="confirmPassword" name="confirmPassword" type={visible ? 'text' : 'password'} autoComplete="new-password" className="bg-app border-border-strong min-h-12 rounded-lg border px-3.5 text-sm" /><button disabled={pending || token.length < 20} className="bg-brand text-app min-h-12 rounded-lg text-sm font-semibold disabled:opacity-60">{pending ? 'Updating…' : 'Reset password'}</button>{state?.error && <p role="alert" className="text-danger text-sm">{state.error}</p>}</form>;
}

function Field({ label, name, type = 'text', autoComplete }: { label: string; name: string; type?: string; autoComplete?: string }) {
  return <div><label htmlFor={name} className="text-text-secondary mb-1.5 block text-sm font-medium">{label}</label><input required id={name} name={name} type={type} autoComplete={autoComplete} className="bg-app border-border-strong text-text-primary placeholder:text-text-muted focus:border-brand min-h-12 w-full rounded-lg border px-3.5 text-sm outline-none focus:ring-2 focus:ring-amber-500/20" /></div>;
}

function SecretInput({ visible, toggle, autoComplete }: { visible: boolean; toggle: () => void; autoComplete: string }) {
  return <div className="relative"><input required id="password" name="password" type={visible ? 'text' : 'password'} autoComplete={autoComplete} className="bg-app border-border-strong text-text-primary focus:border-brand min-h-12 w-full rounded-lg border px-3.5 pr-12 text-sm outline-none focus:ring-2 focus:ring-amber-500/20" /><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={toggle} className="text-text-muted hover:text-text-primary absolute inset-y-0 right-0 flex w-12 items-center justify-center">{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>;
}
