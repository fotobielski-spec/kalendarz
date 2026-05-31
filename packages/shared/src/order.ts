import { z } from 'zod';

export const ProductOptionSchema = z.enum(['email_only', 'email_and_print']);
export type ProductOption = z.infer<typeof ProductOptionSchema>;

export const OrderStatusSchema = z.enum([
  'draft',
  'pending_payment',
  'paid',
  'fulfillment',
  'delivered',
  'abandoned',
  'refunded',
  'failed',
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const PaymentStatusSchema = z.enum([
  'pending',
  'processing',
  'succeeded',
  'failed',
  'canceled',
]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
