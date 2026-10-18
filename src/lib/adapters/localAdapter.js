import { DEFAULT_COMPANY, normalizeCompany } from '../defaultCompany.js';


const KEY_ATT = 'attestpro:attestations';
const KEY_COMPANY = 'attestpro:company';

{/* on va stocker les donnes ou ? localstorage : Map en memoire 
    test de fonctionnement*/}
function createStore() {
    try {
    const probe = '__attestpro_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return {
      kind: 'localStorage',
      read(key, fallback) {
        try {
          const raw = window.localStorage.getItem(key);
          return raw ? JSON.parse(raw) : fallback;
        } catch {
          return fallback;
        }
      },
      write(key, value) {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
         
        }
      }
    };
  } catch {
    const memory = new Map();
    return {
      kind: 'memory',
      read: (key, fallback) => (memory.has(key) ? memory.get(key) : fallback),
      write: (key, value) => memory.set(key, value)
    };
  }
}
   
const store = createStore();
export const localStoreKind = store.kind;

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function nextNumero(existing, dateGeneration) {
  const year = new Date(dateGeneration).getFullYear();
  const prefix = `AT-${year}-`;
  const max = existing
    .filter((a) => typeof a.numero === 'string' && a.numero.startsWith(prefix))
    .reduce((m, a) => {
      const seq = parseInt(a.numero.slice(prefix.length), 10);
      return Number.isFinite(seq) ? Math.max(m, seq) : m;
    }, 0);
  return `${prefix}${String(max + 1).padStart(4, '0')}`;
}

export const localAdapter ={

    mode : "local",
    storageKind : store.kind,

    async listAttestations(){
        const items = store.read(KEY_ATT, []);

        return [...items].sort((a,b) => {
             const byDate = String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
      if (byDate !== 0) return byDate;
      return String(b.numero || '').localeCompare(String(a.numero || ''));
        });
    },

    async createAttestation({ employee, companySnapshot, dateGeneration}){
         if (!employee?.nom?.trim() || !employee?.prenom?.trim()) {
      throw new Error('Le nom et le prénom du salarié sont obligatoires.');
    }
     const items = store.read(KEY_ATT, []);
    const dateGen = dateGeneration || new Date().toISOString();
    const record = {
      id: makeId(),
      numero: nextNumero(items, dateGen),
      employee,
      companySnapshot: companySnapshot || null,
      dateGeneration: dateGen,
      createdAt: new Date().toISOString()
    };

      store.write(KEY_ATT, [...items, record]);
    return record;
  },

   async deleteAttestation(id) {
    const items = store.read(KEY_ATT, []);
    store.write(KEY_ATT, items.filter((a) => a.id !== id));
    return { ok: true };
  },

    async getCompany() {
    return normalizeCompany(store.read(KEY_COMPANY, DEFAULT_COMPANY));
  },

    async saveCompany(company) {
    const normalized = normalizeCompany(company);
    store.write(KEY_COMPANY, normalized);
    return normalized;
  }
 

};
