import { isSupabaseConfigured, isAuthRequired, supabaseUrl } from './supabaseClient.js';
import { supabaseAdapter } from './adapters/supabaseAdapter.js';
import { localAdapter, localStoreKind } from './adapters/localAdapter.js';

/**
 
 *   soit  stockage dans le navigateur , ou on configure supabase

 */
export const db = isSupabaseConfigured ? supabaseAdapter : localAdapter;

/** 'supabase' */
export const dbMode = db.mode;

/** 'localStorage'  */
export const demoStorage = isSupabaseConfigured ? null : localStoreKind;

export const config = {
  supabaseUrl,
  authRequired: isAuthRequired
};


export const listAttestations = (...args) => db.listAttestations(...args);
export const createAttestation = (...args) => db.createAttestation(...args);
export const deleteAttestation = (...args) => db.deleteAttestation(...args);
export const getCompany = (...args) => db.getCompany(...args);
export const saveCompany = (...args) => db.saveCompany(...args);

export { supabase } from './supabaseClient.js';
