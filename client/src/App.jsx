import { PackagePlus, Search, ShoppingBag, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import { AdminUsers } from './components/AdminUsers.jsx';
import { AuthForm } from './components/AuthForm.jsx';
import { CartPanel } from './components/CartPanel.jsx';
import { EmptyState } from './components/EmptyState.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ProductCard } from './components/ProductCard.jsx';
import { ProductForm } from './components/ProductForm.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import { Button } from './components/ui/Button.jsx';
import { Dialog } from './components/ui/Dialog.jsx';
import { Input } from './components/ui/Input.jsx';
import { logout } from './features/auth/authSlice.js';
import { api, useAddCartItemMutation, useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation, useUploadProductImageMutation } from './services/api.js';
import { createSocket } from './services/socket.js';

const extractError = (error) => error?.data?.message || error?.error || 'Something went wrong';

const AppContent = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [productModal, setProductModal] = useState({ open: false, product: null });
  const role = user?.role;

  const params = useMemo(
    () => ({
      search: search || undefined,
      category: category || undefined,
      limit: 24
    }),
    [category, search]
  );

  const { data, isLoading, isFetching } = useGetProductsQuery(params);
  const [addCartItem, addCartState] = useAddCartItemMutation();
  const [createProduct, createState] = useCreateProductMutation();
  const [updateProduct, updateState] = useUpdateProductMutation();
  const [deleteProduct, deleteState] = useDeleteProductMutation();
  const [uploadProductImage, uploadState] = useUploadProductImageMutation();

  useEffect(() => {
    const socket = createSocket();
    if (role === 'admin') socket.emit('admin:join');

    socket.on('stock:alert', (payload) => {
      setNotice(payload.message);
      dispatch(api.util.invalidateTags(['Product']));
    });
    socket.on('products:changed', () => dispatch(api.util.invalidateTags(['Product'])));

    return () => socket.disconnect();
  }, [dispatch, role]);

  const products = data?.docs || [];

  const handleAddToCart = async (product) => {
    try {
      await addCartItem({ productId: product.id, quantity: 1 }).unwrap();
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(extractError(err), { id: 'cart-error' });
    }
  };

  const handleSaveProduct = async (values) => {
    try {
      const { imageFile, ...productValues } = values;
      let imageUrl = productValues.imageUrl;

      if (imageFile instanceof File) {
        const uploadedImage = await uploadProductImage(imageFile).unwrap();
        imageUrl = uploadedImage.url;
      }

      const payload = { ...productValues, imageUrl };

      if (productModal.product) {
        await updateProduct({ id: productModal.product.id, ...payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      setProductModal({ open: false, product: null });
      toast.success('Product saved');
    } catch (err) {
      toast.error(extractError(err), { id: 'product-error' });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted');
    } catch (err) {
      toast.error(extractError(err), { id: 'delete-error' });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">ClothStack</h1>
              <p className="text-xs text-muted-foreground">MERN product operations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden items-center gap-2 rounded-md border px-3 py-2 text-sm sm:flex">
                <UserRound className="h-4 w-4" />
                <span>{user.name}</span>
                <span className="text-muted-foreground">({user.role})</span>
              </div>
            )}
            <ThemeToggle />
            {user && (
              <Button type="button" variant="outline" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-4">
          <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Product catalog</h2>
              <p className="text-sm text-muted-foreground">Browse, filter, and manage clothing inventory.</p>
            </div>
            {role === 'admin' && (
              <Button type="button" onClick={() => setProductModal({ open: true, product: null })}>
                <PackagePlus className="h-4 w-4" />
                Add product
              </Button>
            )}
          </div>

          <div className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search products, brands, descriptions" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <select className="h-10 rounded-md border bg-background px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All categories</option>
              {['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories'].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : products.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  role={role}
                  busy={addCartState.isLoading || deleteState.isLoading}
                  onAddToCart={handleAddToCart}
                  onEdit={(item) => setProductModal({ open: true, product: item })}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No products found" description="Try a different search or add a product as admin." />
          )}
          {isFetching && !isLoading && <p className="text-xs text-muted-foreground">Refreshing catalog...</p>}
        </section>

        <aside className="grid content-start gap-4">
          {!user ? <AuthForm /> : null}

          <section className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="font-semibold">{role === 'admin' ? 'Registered users' : 'Cart'}</h2>
            {role === 'admin' ? <AdminUsers enabled /> : <CartPanel enabled={role === 'user'} />}
          </section>
        </aside>
      </div>

      <Dialog
        open={productModal.open}
        title={productModal.product ? 'Edit product' : 'Add product'}
        onClose={() => setProductModal({ open: false, product: null })}
      >
        <ProductForm
          product={productModal.product}
          isLoading={createState.isLoading || updateState.isLoading || uploadState.isLoading}
          onSubmit={handleSaveProduct}
        />
      </Dialog>
    </main>
  );
};

const App = () => (
  <ErrorBoundary>
    <AppContent />
    <Toaster />
  </ErrorBoundary>
);

export default App;
