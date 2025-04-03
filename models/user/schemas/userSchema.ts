import { z } from "zod";

export const userSchema = z.object({
  full_name: z.string().min(1, "O nome completo é obrigatório."),
  email: z.string().email("Digite um email válido."),
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos."),
  avatar: z.string().optional(), // Adiciona o campo avatar como opcional
});

export type UserFormData = z.infer<typeof userSchema>;
