const { z } = require('zod');

const registerSchema = z.object({
    username: z.string()
        .min(6),
    email: z.string()
        .trim()
        .email(),
    password: z.string()
        .min(8),
    phoneNumber: z.string()
        .optional(),
    role: z.enum(["customer","seller"])
})

const loginSchema = z.object({
    email: z.string()
        .trim()
        .email(),
    password: z.string()
        .min(8),
})

module.exports={registerSchema, loginSchema};