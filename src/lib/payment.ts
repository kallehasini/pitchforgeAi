import type { UserCredits } from '@/types';
import { supabase } from '@/lib/supabase';
import { uid } from '@/lib/utils';

export const FREE_CREDIT_LIMIT = 4;
export const PREMIUM_PRICE = 29;
export const PREMIUM_CURRENCY = 'USDC';

export interface PaymentChallenge {
  status: 402;
  challenge: string;
  amount: number;
  currency: string;
  paymentId: string;
  payTo: string;
  network: string;
}

export class PaymentRequiredError extends Error {
  challenge: PaymentChallenge;
  constructor(challenge: PaymentChallenge) {
    super('Payment required');
    this.name = 'PaymentRequiredError';
    this.challenge = challenge;
  }
}

/**
 * Get or create the user's credit row. New users start with FREE_CREDIT_LIMIT credits.
 */
export async function getUserCredits(): Promise<UserCredits> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in.');

  const { data } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (data) return data as UserCredits;

  const { data: newCredits, error } = await supabase
    .from('user_credits')
    .insert({ user_id: user.id, free_credits: FREE_CREDIT_LIMIT, is_premium: false })
    .select()
    .single();

  if (error || !newCredits) throw new Error('Could not initialize credits.');
  return newCredits as UserCredits;
}

export function canGenerate(credits: UserCredits): boolean {
  return credits.is_premium || credits.free_credits > 0;
}

export function canDownload(credits: UserCredits): boolean {
  return credits.is_premium;
}

/**
 * Decrement a free credit after a successful generation. Premium users are unaffected.
 */
export async function decrementCredit(): Promise<UserCredits> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in.');

  const { data: credits } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!credits) throw new Error('Credit record not found.');
  const current = credits as UserCredits;

  if (current.is_premium) return current;

  if (current.free_credits <= 0) {
    throw new Error('You have no free generations left. Upgrade to Premium.');
  }

  const { data: updated, error } = await supabase
    .from('user_credits')
    .update({ free_credits: current.free_credits - 1, updated_at: new Date().toISOString() })
    .eq('id', current.id)
    .select()
    .single();

  if (error || !updated) throw new Error('Could not update credits.');
  return updated as UserCredits;
}

/**
 * Initiate the x402 premium upgrade flow. Creates a pending payment record
 * and returns a 402-shaped challenge.
 */
export async function requestPremiumUpgrade(): Promise<PaymentChallenge> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in.');

  const challenge = uid('x402');
  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: user.id,
      amount: PREMIUM_PRICE,
      currency: PREMIUM_CURRENCY,
      status: 'pending',
      x402_challenge: challenge,
    })
    .select()
    .single();

  if (error || !data) throw new Error('Could not initiate payment. Please try again.');

  return {
    status: 402,
    challenge,
    amount: PREMIUM_PRICE,
    currency: PREMIUM_CURRENCY,
    paymentId: (data as { id: string }).id,
    payTo: 'PitchForge AI Treasury',
    network: 'Algorand Testnet',
  };
}

/**
 * Complete the mock x402 payment: mark payment as completed and activate premium.
 */
export async function completePremiumUpgrade(paymentId: string): Promise<UserCredits> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in.');

  const { error: payError } = await supabase
    .from('payments')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', paymentId);

  if (payError) throw new Error('Payment could not be confirmed.');

  const { data: credits } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!credits) throw new Error('Credit record not found.');

  const { data: updated, error } = await supabase
    .from('user_credits')
    .update({
      is_premium: true,
      premium_activated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', (credits as UserCredits).id)
    .select()
    .single();

  if (error || !updated) throw new Error('Could not activate premium.');
  return updated as UserCredits;
}
