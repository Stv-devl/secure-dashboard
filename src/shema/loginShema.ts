import * as Yup from 'yup';

/**
 * Login validation schema
 * @constant
 * @type {Yup.ObjectSchema}
 */
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),
});
