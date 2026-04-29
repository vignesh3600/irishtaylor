let ioInstance;

export const setSocketServer = (io) => {
  ioInstance = io;
};

export const getSocketServer = () => ioInstance;

export const emitProductsChanged = (payload) => {
  if (!ioInstance) return;
  ioInstance.emit('products:changed', payload);
};

export const emitProductCreated = (product) => {
  if (!ioInstance) return;
  ioInstance.emit('product:created', {
    productId: product.id,
    name: product.name,
    message: `New product added: ${product.name}`
  });
  emitProductsChanged({ productId: product.id, action: 'created' });
};

export const emitStockAlert = (payload) => {
  if (!ioInstance) return;
  ioInstance.to('admins').emit('stock:alert', payload);
};
