import * as z from "zod";

export const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export const forgotPasswordPhoneSchema = z.object({
  phone: z.string().regex(/^[0-9]{8,11}$/, "Số điện thoại không hợp lệ"),
});

export const changePasswordSchema = z
  .object({
    newPassword: z.string().regex(PASSWORD_REGEX, "Mật khẩu không hợp lệ"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ForgotPasswordEmailSchema = z.infer<
  typeof forgotPasswordEmailSchema
>;
export type ForgotPasswordPhoneSchema = z.infer<
  typeof forgotPasswordPhoneSchema
>;

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
