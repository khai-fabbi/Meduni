import * as z from 'zod'

export const contactSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
  phone: z
    .string()
    .min(1, 'Số điện thoại là bắt buộc')
    .refine(
      val => /^[0-9]{8,11}$/.test(val),
      'Số điện thoại không hợp lệ'
    ),
  email: z
    .string()
    .optional()
    .refine(
      val => !val || val.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Email không hợp lệ'
    ),
  reason: z.number().optional(),
  message: z.string().min(1, 'Lời nhắn là bắt buộc')
}).superRefine((data, ctx) => {
  if (data.reason === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Yêu cầu là bắt buộc'
    })
  }
})

export type ContactSchema = z.infer<typeof contactSchema>
