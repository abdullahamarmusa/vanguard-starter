export function PrototypeNotice() {
  return (
    <aside
      role="note"
      aria-label="VANGUARD prototype status"
      className="border-border-subtle bg-elevated text-text-secondary border-b px-4 py-2 text-center text-xs sm:px-6"
    >
      <span className="text-text-primary font-semibold">Public prototype</span>
      <span>
        {' '}
        · Illustrative data and simulated actions. No account, email, payment,
        or live data provider is connected.
      </span>
    </aside>
  );
}
