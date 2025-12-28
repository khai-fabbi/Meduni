import * as z from 'zod'

export const signupSchema = z
  .object({
    username: z.string().min(1, 'Tên người dùng là bắt buộc'),
    phone: z.string().regex(/^[0-9]{8,11}$/, 'Số điện thoại không hợp lệ'),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().regex(PASSWORD_REGEX, 'Mật khẩu không hợp lệ'),
    confirm_password: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    invite_code: z.string().optional()
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirm_password']
  })

export type SignupSchema = z.infer<typeof signupSchema>
