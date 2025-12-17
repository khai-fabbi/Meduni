import * as z from 'zod'

export const profileSchema = z.object({
  goal: z.string().optional(),
  shortDescription: z.string().optional(),
  fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
  dateOfBirth: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  phone: z
    .string()
    .optional()
    .refine(
      val => !val || /^[0-9]{8,11}$/.test(val),
      'Số điện thoại không hợp lệ'
    ),
  email: z.string().email('Email không hợp lệ'),
  country: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional()
})

export const changePasswordWithOldSchema = z
  .object({
    oldPassword: z.string().min(1, 'Mật khẩu cũ là bắt buộc'),
    newPassword: z.string().regex(PASSWORD_REGEX, 'Mật khẩu không hợp lệ'),
    confirmPassword: z.string()
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  })

export type ChangePasswordWithOldSchema = z.infer<
  typeof changePasswordWithOldSchema
>
export type ProfileSchema = z.infer<typeof profileSchema>
