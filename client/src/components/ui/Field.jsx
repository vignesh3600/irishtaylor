export const Field = ({ label, error, children }) => (
  <label className="grid gap-1.5 text-sm font-medium">
    <span>{label}</span>
    {children}
    <span className="min-h-5 text-xs font-normal text-destructive">{error || ''}</span>
  </label>
);
