import * as yup from 'yup';

export const authSchema = (mode) =>
  yup.object({
    name:
      mode === 'register'
        ? yup.string().trim().min(2, 'Name must be at least 2 characters').max(60).required('Name is required')
        : yup.string().strip(),
    email: yup.string().trim().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
  });

export const productSchema = yup.object({
  name: yup.string().trim().min(2).max(120).required('Name is required'),
  description: yup.string().trim().min(10).max(1000).required('Description is required'),
  brand: yup.string().trim().max(80).required('Brand is required'),
  category: yup.string().oneOf(['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories']).required(),
  size: yup.string().oneOf(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']).required(),
  color: yup.string().trim().max(40).required('Color is required'),
  price: yup.number().typeError('Price must be a number').min(1).max(100000).required('Price is required'),
  stock: yup.number().typeError('Stock must be a number').integer().min(0).max(10000).required('Stock is required'),
  imageUrl: yup.string().trim().required('Image is required'),
  isFeatured: yup.boolean()
});
