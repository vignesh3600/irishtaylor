import { ChevronLeft, ChevronRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '../lib/utils.js';
import { useGetCartQuery, useRemoveCartItemMutation, useUpdateCartItemMutation } from '../services/api.js';
import { EmptyState } from './EmptyState.jsx';
import { Button } from './ui/Button.jsx';

const cartPageSize = 4;

export const CartPanel = ({ enabled }) => {
  const [page, setPage] = useState(1);
  const { data: cart, isLoading } = useGetCartQuery(undefined, { skip: !enabled });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const items = cart?.items || [];
  const totalPages = Math.max(1, Math.ceil(items.length / cartPageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = items.length ? (currentPage - 1) * cartPageSize + 1 : 0;
  const pageEnd = Math.min(currentPage * cartPageSize, items.length);
  const visibleItems = useMemo(
    () => items.slice((currentPage - 1) * cartPageSize, currentPage * cartPageSize),
    [currentPage, items]
  );
  const total = items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  if (!enabled) return <EmptyState title="Sign in as user" description="User accounts can add products to the cart." />;
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading cart...</p>;
  if (!items.length) return <EmptyState title="Cart is empty" description="Add products from the catalog." />;

  return (
    <div className="grid gap-3">
      <div className="grid max-h-[420px] gap-3 overflow-y-auto pr-1">
        {visibleItems.map((item) => {
          const itemTotal = item.quantity * (item.product?.price || 0);

          return (
            <div key={item.product.id} className="grid grid-cols-[56px_1fr_auto] gap-3 rounded-lg border p-3">
              <img src={item.product.imageUrl} alt={item.product.name} className="h-14 w-14 rounded-md object-cover" />
              <div className="min-w-0">
                <p className="truncate font-medium leading-tight">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.product.price)} each
                </p>
                <p className="text-sm font-semibold">{formatCurrency(itemTotal)}</p>
                <div className="mt-2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateCartItem({ productId: item.product.id, quantity: Math.max(1, item.quantity - 1) })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="grid h-8 min-w-10 place-items-center rounded-md border text-sm">{item.quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateCartItem({ productId: item.product.id, quantity: item.quantity + 1 })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeCartItem(item.product.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 border-t pt-3 text-sm">
        <p className="text-muted-foreground">
          Showing {pageStart}-{pageEnd} of {items.length} cart items
        </p>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
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
            disabled={currentPage >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-2 rounded-lg bg-muted p-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Total quantity</span>
          <span>{totalQuantity}</span>
        </div>
        <div className="flex items-center justify-between font-semibold">
          <span>Total price</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};
