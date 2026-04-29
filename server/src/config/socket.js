let ioInstance;

export const setSocketServer = (io) => {
  ioInstance = io;
};

export const getSocketServer = () => ioInstance;

export const emitStockAlert = (payload) => {
  if (!ioInstance) return;
  ioInstance.to('admins').emit('stock:alert', payload);
  ioInstance.emit('products:changed', { productId: payload.productId });
};
