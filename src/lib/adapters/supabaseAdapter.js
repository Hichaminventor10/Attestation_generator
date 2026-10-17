import { supabase } from '../supabaseClient.js';
import { normalizeCompany } from '../defaultCompany.js';

function friendlyError(error, context) {
  const msg = error?.message || String(error);
  const code = error?.code || '';

  if (code === '42P01' || /relation .* does not exist|schema cache/i.test(msg)) {
    return new Error(
      `${context} : la base Supabase n'est pas prête. Exécute le fichier supabase/schema.sql dans le SQL Editor de Supabase, puis recharge la page.`
    );
  }
  if (/invalid api key|jwt|invalid.*key/i.test(msg)) {
    return new Error(
      `${context} : clé Supabase refusée. Vérifie VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local, puis relance "npm run dev".`
    );
  }
  if (/row-level security|violates row-level security/i.test(msg)) {
    return new Error(
      `${context} : accès refusé par les règles RLS. Vérifie les policies de supabase/schema.sql (et que VITE_AUTH_ENABLED correspond bien à ton mode).`
    );
  }
  if (/failed to fetch|networkerror|network request failed/i.test(msg)) {
    return new Error(
      `${context} : impossible de joindre Supabase. Vérifie ta connexion internet et l'URL du projet.`
    );
  }
  return new Error(`${context} : ${msg}`);
}

function isMissingFunction(error) {
  const code = error?.code || '';
  const msg = error?.message || '';
  return (
    code === 'PGRST202' ||
    code === '42883' ||
    /could not find the function|function .* does not exist/i.test(msg)
  );
}


function rowToRecord(row) {
  return {
    id: row.id,
    numero: row.numero,
    employee: row.employee || {},
    companySnapshot: row.company_snapshot || null,
    dateGeneration: row.date_generation,
    createdAt: row.created_at
  };
}

function rowToCompany(row) {
  return normalizeCompany({
    nom: row.nom,
    adresse: row.adresse,
    ville: row.ville,
    telephone: row.telephone,
    email: row.email,
    rc: row.rc,
    ice: row.ice,
    if: row.num_if
  });
}

function companyToRow(company) {
  const c = normalizeCompany(company);
  return {
    id: 1,
    nom: c.nom,
    adresse: c.adresse,
    ville: c.ville,
    telephone: c.telephone,
    email: c.email,
    rc: c.rc,
    ice: c.ice,
    num_if: c.if,
    updated_at: new Date().toISOString()
  };
}


async function createWithoutRpc({ employee, companySnapshot, dateGeneration }) {
  const dateGen = dateGeneration || new Date().toISOString();
  const year = new Date(dateGen).getFullYear();
  const prefix = `AT-${year}-`;

  const { data: rows, error: readError } = await supabase
    .from('attestations')
    .select('numero')
    .like('numero', `${prefix}%`);

  if (readError) throw friendlyError(readError, 'Création impossible');

  const max = (rows || []).reduce((m, r) => {
    const seq = parseInt(String(r.numero).slice(prefix.length), 10);
    return Number.isFinite(seq) ? Math.max(m, seq) : m;
  }, 0);

  const numero = `${prefix}${String(max + 1).padStart(4, '0')}`;

  const { data, error } = await supabase
    .from('attestations')
    .insert({
      numero,
      employee,
      company_snapshot: companySnapshot || null,
      date_generation: dateGen
    })
    .select()
    .single();

  if (error) throw friendlyError(error, 'Création impossible');
  return rowToRecord(data);
}


/*  L'adaptateur                                                      */

export const supabaseAdapter = {
  mode: 'supabase',

  async listAttestations() {
    const { data, error } = await supabase
      .from('attestations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw friendlyError(error, 'Chargement de l’historique impossible');
    return (data || []).map(rowToRecord);
  },

  async createAttestation({ employee, companySnapshot, dateGeneration }) {
    if (!employee?.nom?.trim() || !employee?.prenom?.trim()) {
      throw new Error('Le nom et le prénom du salarié sont obligatoires.');
    }


    const { data, error } = await supabase.rpc('create_attestation', {
      p_employee: employee,
      p_company: companySnapshot || null,
      p_date_generation: dateGeneration || new Date().toISOString()
    });

    if (!error) {
      const row = Array.isArray(data) ? data[0] : data;
      if (row) return rowToRecord(row);
    }

    if (error && isMissingFunction(error)) {
      console.warn(
        '[AttestPro] Fonction create_attestation absente : numérotation côté client. ' +
          'Exécute supabase/schema.sql pour une numérotation 100 % fiable.'
      );
      return createWithoutRpc({ employee, companySnapshot, dateGeneration });
    }

    throw friendlyError(error, 'Création impossible');
  },

  async deleteAttestation(id) {
    const { error } = await supabase.from('attestations').delete().eq('id', id);
    if (error) throw friendlyError(error, 'Suppression impossible');
    return { ok: true };
  },

  async getCompany() {
    const { data, error } = await supabase
      .from('company')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw friendlyError(error, 'Chargement de l’entreprise impossible');
    if (!data) return normalizeCompany(null); // ligne absente → valeurs par défaut
    return rowToCompany(data);
  },

  async saveCompany(company) {
    const row = companyToRow(company);
    const { data, error } = await supabase
      .from('company')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw friendlyError(error, 'Enregistrement impossible');
    return rowToCompany(data);
  }
};
