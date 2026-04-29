import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils.js';
import { useGetCartQuery, useRemoveCartItemMutation, useUpdateCartItemMutation } from '../services/api.js';
import { EmptyState } from './EmptyState.jsx';
import { Button } from './ui/Button.jsx';

export const CartPanel = ({ enabled }) => {
  const { data: cart, isLoading } = useGetCartQuery(undefined, { skip: !enabled });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);

  if (!enabled) return <EmptyState title="Sign in as user" description="User accounts can add products to the cart." />;
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading cart...</p>;
  if (!items.length) return <EmptyState title="Cart is empty" description="Add products from the catalog." />;

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.product.id} className="grid grid-cols-[56px_1fr_auto] gap-3 rounded-lg border p-3">
          <img src={item.product.imageUrl} alt={item.product.name} className="h-14 w-14 rounded-md object-cover" />
          <div>
            <p className="font-medium leading-tight">{item.product.name}</p>
            <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}</p>
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
      ))}
      <div className="flex items-center justify-between rounded-lg bg-muted p-3 font-semibold">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};
