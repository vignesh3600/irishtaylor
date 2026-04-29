import { yupResolver } from '@hookform/resolvers/yup';
import { LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setCredentials } from '../features/auth/authSlice.js';
import { useLoginMutation, useRegisterMutation } from '../services/api.js';
import { authSchema } from '../validation/schemas.js';
import { Button } from './ui/Button.jsx';
import { Field } from './ui/Field.jsx';
import { Input } from './ui/Input.jsx';

export const AuthForm = () => {
  const [mode, setMode] = useState('login');
  const dispatch = useDispatch();
  const [login, loginState] = useLoginMutation();
  const [registerUser, registerState] = useRegisterMutation();
  const isRegister = mode === 'register';
  const isLoading = loginState.isLoading || registerState.isLoading;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(authSchema(mode)),
    defaultValues: { name: '', email: '', password: '' }
  });

  const switchMode = () => {
    setMode((value) => (value === 'login' ? 'register' : 'login'));
    reset({ name: '', email: '', password: '' });
  };

  const onSubmit = async (values) => {
    try {
      const result = isRegister ? await registerUser(values).unwrap() : await login(values).unwrap();
      dispatch(setCredentials(result));
    } catch (error) {
      toast.error(error.data?.message || error.error || 'Authentication failed', { id: 'auth-error' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">{isRegister ? 'Create account' : 'Sign in'}</h2>
          <p className="text-sm text-muted-foreground">Use admin credentials for product management.</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={switchMode}>
          {isRegister ? 'Login' : 'Register'}
        </Button>
      </div>

      {isRegister && (
        <Field label="Name" error={errors.name?.message}>
          <Input error={errors.name} {...register('name')} />
        </Field>
      )}

      <Field label="Email" error={errors.email?.message}>
        <Input type="email" error={errors.email} {...register('email')} />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <Input type="password" error={errors.password} {...register('password')} />
      </Field>

      <Button type="submit" disabled={!isValid || isLoading}>
        {isRegister ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
        {isRegister ? 'Register' : 'Login'}
      </Button>
    </form>
  );
};
