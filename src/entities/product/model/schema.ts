import { z } from 'zod';

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
        .min(0, 'Цена не может быть отрицательной')
        .max(999999.99, 'Цена не должна превышать 999999.99')
        .refine(
            (val) => {
                const str = val.toString();
                const decimalPart = str.split('.')[1];
                return !decimalPart || decimalPart.length <= 2;
            },
            {
                message: 'Цена должна содержать не более 2 знаков после запятой',
            }
        )
        .refine((val) => val !== undefined && val !== null, {
            message: 'Цена обязательна для заполнения',
        }),

    imageUrl: z
        .string()
        .optional()
        .default(''),
});

export type ProductFormData = z.infer<typeof productSchema>;