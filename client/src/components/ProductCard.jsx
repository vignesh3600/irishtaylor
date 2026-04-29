import { Edit, ShoppingCart, Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils.js';
import { Button } from './ui/Button.jsx';

export const ProductCard = ({ product, role, onAddToCart, onEdit, onDelete, busy }) => (
  <article className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="aspect-[4/3] bg-muted">
      <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
    </div>
    <div className="grid gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.brand} · {product.size} · {product.color}
          </p>
        </div>
        <span className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
          {formatCurrency(product.price)}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
      <div className="flex items-center justify-between gap-3">
        <span className={product.stock <= 5 ? 'text-sm font-semibold text-destructive' : 'text-sm text-muted-foreground'}>
          {product.stock} in stock
        </span>
        <span className="rounded-md bg-muted px-2 py-1 text-xs capitalize">{product.category}</span>
      </div>
      {role === 'admin' ? (
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(product)}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(product.id)} disabled={busy}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      ) : (
        <Button type="button" onClick={() => onAddToCart(product)} disabled={busy || product.stock === 0}>
          <ShoppingCart className="h-4 w-4" />
          Add to cart
        </Button>
      )}
    </div>
  </article>
);
