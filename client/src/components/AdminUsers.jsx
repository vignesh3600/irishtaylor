import { ShieldCheck } from 'lucide-react';
import { useGetUsersQuery } from '../services/api.js';
import { EmptyState } from './EmptyState.jsx';

export const AdminUsers = ({ enabled }) => {
  const { data, isLoading } = useGetUsersQuery(undefined, { skip: !enabled });

  if (!enabled) return null;
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading users...</p>;
  if (!data?.docs?.length) return <EmptyState title="No users yet" description="Registered users will appear here." />;

  return (
    <div className="grid gap-2">
      {data.docs.map((user) => (
        <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold capitalize">
            <ShieldCheck className="h-3.5 w-3.5" />
            {user.role}
          </span>
        </div>
      ))}
    </div>
  );
};
