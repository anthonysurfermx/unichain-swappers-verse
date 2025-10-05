import { z } from 'zod';

export const walletAddressSchema = z.string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address');

export const tradeSchema = z.object({
  amount: z.number()
    .positive('Amount must be positive')
    .max(1000000, 'Amount too large')
    .finite('Amount must be finite'),
  outcome: z.string().min(1, 'Outcome is required'),
  marketId: z.string().uuid('Invalid market ID')
});

export const marketSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
  outcomes: z.array(z.string().min(1)).min(2, 'At least 2 outcomes required').max(10, 'Maximum 10 outcomes allowed'),
  end_date: z.date().min(new Date(), 'End date must be in the future'),
  creator_address: walletAddressSchema
});

export const userProfileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters').optional(),
  wallet_address: walletAddressSchema
});
