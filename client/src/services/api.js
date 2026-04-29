import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL || '/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    }
  }),

  tagTypes: ['Auth', 'Product', 'Cart', 'User'],

  endpoints: (builder) => ({

    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: (response) => response.result,
      invalidatesTags: ['Auth']
    }),

    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (response) => response.result,
      invalidatesTags: ['Auth']
    }),

    getProducts: builder.query({
      query: (params = {}) => ({ url: '/products', params }),
      transformResponse: (response) => response.result,
      providesTags: (result) =>
        result?.docs
          ? [...result.docs.map((product) => ({ type: 'Product', id: product.id })), 'Product']
          : ['Product']
    }),

    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => response.result,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }]
    }),

    createProduct: builder.mutation({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      transformResponse: (response) => response.result,
      invalidatesTags: ['Product']
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: 'PATCH', body }),
      transformResponse: (response) => response.result,
      invalidatesTags: (_result, _error, arg) => [{ type: 'Product', id: arg.id }, 'Product']
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      transformResponse: (response) => response.result,
      invalidatesTags: ['Product']
    }),

    uploadProductImage: builder.mutation({
      query: (file) => {
        const body = new FormData();
        body.append('image', file);
        return { url: '/upload/product-image', method: 'POST', body };
      },
      transformResponse: (response) => response.result
    }),

    getCart: builder.query({
      query: () => '/cart',
      transformResponse: (response) => response.result,
      providesTags: ['Cart']
    }),
    
    addCartItem: builder.mutation({
      query: (body) => ({ url: '/cart/items', method: 'POST', body }),
      transformResponse: (response) => response.result,
      invalidatesTags: ['Cart']
    }),
    
    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: 'PATCH',
        body: { quantity }
      }),
      transformResponse: (response) => response.result,
      invalidatesTags: ['Cart']
    }),

    removeCartItem: builder.mutation({
      query: (productId) => ({ url: `/cart/items/${productId}`, method: 'DELETE' }),
      transformResponse: (response) => response.result,
      invalidatesTags: ['Cart']
    }),

    getUsers: builder.query({
      query: () => '/admin/users',
      transformResponse: (response) => response.result,
      providesTags: ['User']
    })
    
  })
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useGetUsersQuery
} = api;
