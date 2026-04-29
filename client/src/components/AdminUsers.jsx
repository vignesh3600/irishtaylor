import { ChevronLeft, ChevronRight, Search, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useGetUsersQuery } from '../services/api.js';
import { EmptyState } from './EmptyState.jsx';
import { Button } from './ui/Button.jsx';
import { Input } from './ui/Input.jsx';

const userPageSize = 5;

export const AdminUsers = ({ enabled }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const params = useMemo(
    () => ({
      page,
      limit: userPageSize,
      search: search || undefined
    }),
    [page, search]
  );
  const { data, isLoading, isFetching } = useGetUsersQuery(params, { skip: !enabled });
  const users = data?.docs || [];
  const currentPage = data?.page || page;
  const totalPages = data?.totalPages || 1;
  const totalUsers = data?.totalDocs || 0;
  const pageStart = totalUsers ? data?.pagingCounter || (currentPage - 1) * userPageSize + 1 : 0;
  const pageEnd = totalUsers ? pageStart + users.length - 1 : 0;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (data?.totalPages && page > data.totalPages) {
      setPage(data.totalPages);
    }
  }, [data?.totalPages, page]);

  if (!enabled) return null;

  return (
    <div className="grid gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search by name or email"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading users...</p>
      ) : users.length ? (
        <>
          <div className="grid max-h-[360px] gap-2 overflow-y-auto pr-1">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-semibold capitalize">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {user.role}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t pt-3 text-sm">
            <p className="text-muted-foreground">
              Showing {pageStart}-{pageEnd} of {totalUsers} users
            </p>
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || isFetching}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <span className="text-xs font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages || isFetching}
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="max-h-[360px] overflow-y-auto">
          <EmptyState
            title={search ? 'No users found' : 'No users yet'}
            description={search ? 'Try a different name or email.' : 'Registered users will appear here.'}
          />
        </div>
      )}
    </div>
  );
};
