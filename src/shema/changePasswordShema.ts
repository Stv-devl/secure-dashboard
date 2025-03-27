import * as Yup from 'yup';

/**
 * New password validation schema
 * @constant
 * @type {Yup.ObjectSchema}
 */
export const newPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),
  repeat: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Password is required'),
});

/**
 * Send link validation schema
 * @constant
 * @type {Yup.ObjectSchema}
 */
export const sendLinkSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});
