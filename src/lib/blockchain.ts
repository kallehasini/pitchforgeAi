import type { BlockchainRecord, Deck } from '@/types';

/**
 * Algorand verification utility.
 *
 * For the hackathon demo we generate a real SHA-256 deck hash and simulate
 * an Algorand testnet transaction record (tx ID, generation ID, verification ID).
 * In production this would call the Algorand SDK to submit an atomic transfer
 * with the hash as a note. The verification ID is deterministic from the hash
 * so the verify page can re-derive it.
 */

const ALGO_PREFIX = 'ALGO';

export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function randomAlgoId(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = ALGO_PREFIX;
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export interface VerificationPayload {
  deckHash: string;
  verificationId: string;
  generationId: string;
  txId: string;
  network: string;
}

export async function createVerification(deck: Deck): Promise<VerificationPayload> {
  const canonical = JSON.stringify({
    id: deck.id,
    audience: deck.audience,
    slides: deck.slides,
    notes: deck.presenter_notes,
  });
  const deckHash = await sha256(canonical);
  const verificationId = `${ALGO_PREFIX}-VRF-${deckHash.slice(0, 12).toUpperCase()}`;
  const generationId = `${ALGO_PREFIX}-GEN-${Date.now().toString(36).toUpperCase()}-${deckHash.slice(8, 14).toUpperCase()}`;
  const txId = randomAlgoId(52);

  return {
    deckHash,
    verificationId,
    generationId,
    txId,
    network: 'algorand-testnet',
  };
}

export async function verifyDeck(deck: Deck, record: BlockchainRecord): Promise<{ valid: boolean; computedHash: string }> {
  const canonical = JSON.stringify({
    id: deck.id,
    audience: deck.audience,
    slides: deck.slides,
    notes: deck.presenter_notes,
  });
  const computedHash = await sha256(canonical);
  return { valid: computedHash === record.deck_hash, computedHash };
}
