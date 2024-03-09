import * as Yup from 'yup'

export const loginSchema = Yup.object({
  email: Yup.string().email().required('please enter a valid email'),
  password: Yup.string().min(6).required('password field is required'),
})
export const registerSchema = Yup.object({
  pid: Yup.number().required('PID is required'),
  role: Yup.string().required('Role is required'),
  username: Yup.string().min(2).required('please enter a valid name'),
  email: Yup.string().email().required('please enter a valid email'),
  password: Yup.string().min(6).required('password field is required'),
})