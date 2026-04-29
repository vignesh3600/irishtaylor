export const EmptyState = ({ title, description }) => (
  <div className="rounded-lg border border-dashed p-8 text-center">
    <h3 className="font-semibold">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
  </div>
);
