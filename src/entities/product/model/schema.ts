import { z } from 'zod';

/**
 * Схема валидации товара с помощью Zod
 */
export const productSchema = z.object({
    name: z
        .string()
        .min(1, 'Название обязательно для заполнения')
        .max(100, 'Название не должно превышать 100 символов'),

    description: z
        .string()
        .min(1, 'Описание обязательно для заполнения')
        .max(1000, 'Описание не должно превышать 1000 символов'),

    price: z
        .number({
            invalid_type_error: 'Цена должна быть числом',
        })
        .min(0.01, 'Цена должна быть больше 0')
        .max(999999.99, 'Цена не должна превышать 999999.99')
        .refine((val) => val !== undefined && val !== null, {
            message: 'Цена обязательна для заполнения',
        }),

    imageUrl: z
        .string()
        .url('Введите корректный URL изображения')
        .optional()
        .or(z.literal('')),
});

/**
 * Тип данных формы на основе схемы
 * Используется в React Hook Form
 */
export type ProductFormData = z.infer<typeof productSchema>;