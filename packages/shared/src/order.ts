import { z } from 'zod';

/**
 * Produkty sklepu internetowego (wyłącznie sprzedaż online).
 * - digital_email: pliki cyfrowe na e-mail po opłaceniu
 * - digital_email_print_shipped: pliki + wydruk wysyłany na adres (bez odbioru w punkcie)
 */
export const ProductOptionSchema = z.enum([
  'digital_email',
  'digital_email_print_shipped',
]);
export type ProductOption = z.infer<typeof ProductOptionSchema>;

/** Sposób realizacji zamówienia po płatności online */
export const FulfillmentTypeSchema = z.enum([
  'digital_email',
  'print_shipment',
]);
export type FulfillmentType = z.infer<typeof FulfillmentTypeSchema>;

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
