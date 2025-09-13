/**
 * Schematy walidacji dla formularzy autoryzacji
 */
import { z } from 'zod';

// Schemat dla rejestracji
export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'E-mail jest wymagany')
      .email('Nieprawidłowy format e-mail'),
    password: z
      .string()
      .min(8, 'Hasło musi mieć co najmniej 8 znaków')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Hasło musi zawierać co najmniej jedną małą literę, jedną wielką literę i jedną cyfrę'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Potwierdzenie hasła jest wymagane'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword'],
  });

// Schemat dla logowania
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail jest wymagany')
    .email('Nieprawidłowy format e-mail'),
  password: z
    .string()
    .min(1, 'Hasło jest wymagane'),
});

// Schemat dla resetowania hasła
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail jest wymagany')
    .email('Nieprawidłowy format e-mail'),
});

// Schemat dla zmiany hasła
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Aktualne hasło jest wymagane'),
    newPassword: z
      .string()
      .min(8, 'Nowe hasło musi mieć co najmniej 8 znaków')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Nowe hasło musi zawierać co najmniej jedną małą literę, jedną wielką literę i jedną cyfrę'
      ),
    confirmNewPassword: z
      .string()
      .min(1, 'Potwierdzenie nowego hasła jest wymagane'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Nowe hasła nie są identyczne',
    path: ['confirmNewPassword'],
  });

// Typy inferred z schematów
export type SignUpForm = z.infer<typeof signUpSchema>;
export type SignInForm = z.infer<typeof signInSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;