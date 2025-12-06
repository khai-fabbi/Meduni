import * as z from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().min(1, "Họ và tên là bắt buộc"),
    phone: z.string().regex(/^[0-9]{8,11}$/, "Số điện thoại không hợp lệ"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().regex(PASSWORD_REGEX, "Mật khẩu không hợp lệ"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;
