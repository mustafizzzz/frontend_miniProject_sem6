import * as Yup from 'yup'

export const loginSchema = Yup.object({
  email: Yup.string().email().required('please enter a valid email'),
  password: Yup.string().min(6).required('password field is required'),
})