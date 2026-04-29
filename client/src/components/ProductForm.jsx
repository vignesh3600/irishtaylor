import { yupResolver } from '@hookform/resolvers/yup';
import { ImagePlus, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { productSchema } from '../validation/schemas.js';
import { Button } from './ui/Button.jsx';
import { Field } from './ui/Field.jsx';
import { Input } from './ui/Input.jsx';
import { Select } from './ui/Select.jsx';
import { Textarea } from './ui/Textarea.jsx';

const defaults = {
  name: '',
  description: '',
  brand: '',
  category: 'shirts',
  size: 'M',
  color: '',
  price: 1,
  stock: 0,
  imageUrl: '',
  isFeatured: false
};

export const ProductForm = ({ product, onSubmit, isLoading }) => {
  const [preview, setPreview] = useState(product?.imageUrl || '');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(productSchema),
    defaultValues: product || defaults
  });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setValue('imageFile', file || null, { shouldValidate: true });

    if (!file) {
      setPreview(product?.imageUrl || '');
      setValue('imageUrl', product?.imageUrl || '', { shouldValidate: true });
      return;
    }

    setPreview(URL.createObjectURL(file));
    setValue('imageUrl', product?.imageUrl || 'pending-upload', { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:grid-cols-2">
      <Field label="Name" error={errors.name?.message}>
        <Input error={errors.name} {...register('name')} />
      </Field>
      <Field label="Brand" error={errors.brand?.message}>
        <Input error={errors.brand} {...register('brand')} />
      </Field>
      <Field label="Category" error={errors.category?.message}>
        <Select error={errors.category} {...register('category')}>
          {['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories'].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Size" error={errors.size?.message}>
        <Select error={errors.size} {...register('size')}>
          {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Color" error={errors.color?.message}>
        <Input error={errors.color} {...register('color')} />
      </Field>
      <Field label="Price" error={errors.price?.message}>
        <Input type="number" min="1" error={errors.price} {...register('price')} />
      </Field>
      <Field label="Stock" error={errors.stock?.message}>
        <Input type="number" min="0" error={errors.stock} {...register('stock')} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Product image" error={errors.imageUrl?.message}>
          <div className="grid gap-3 rounded-lg border border-dashed p-3 sm:grid-cols-[160px_1fr]">
            <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-md bg-muted">
              {preview ? (
                <img src={preview} alt="Selected product" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="grid content-center gap-2">
              <Input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageChange} />
              <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, or GIF. Max size 2 MB.</p>
            </div>
          </div>
          <input type="hidden" {...register('imageUrl')} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Description" error={errors.description?.message}>
          <Textarea error={errors.description} {...register('description')} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
        <input type="checkbox" className="h-4 w-4 accent-accent" {...register('isFeatured')} />
        Featured product
      </label>
      <Button type="submit" className="sm:col-span-2" disabled={!isValid || isLoading}>
        <Save className="h-4 w-4" />
        Save product
      </Button>
    </form>
  );
};
