
/**
 *  cest juste des Valeurs par defaut de lentreprise 
 * utilise quand la base ne contient aucune information 
 */


export const  DEFAULT_COMPANY = {
      nom: 'SOCIÉTÉ IT TARMIZ',
  adresse: '12, Boulevard Moulay slimane ',
  ville: 'Tanger',
  telephone: '+212 638-898188',
  email: 'contact@Tarmiz.ma',
  rc: 'RC 0000',
  ice: 'ICE 003456789012345',
  if: 'IF 40567890'

}

{/*normaliser les infos de lentrepriser  
    fonction de securite pour eviter les undefined
    */}



export function normalizeCompany(raw) { /* recoit les donnes */
  const c = raw || {};
  const filled = Object.fromEntries(
    Object.keys(DEFAULT_COMPANY).map((k) => [k, (c[k] ?? '').toString()])
  );
  // Si l'entreprise n'a pas encore été renseignée en base → valeurs par défaut
  const isEmpty = Object.keys(DEFAULT_COMPANY).every((k) => !filled[k].trim());
  return isEmpty ? { ...DEFAULT_COMPANY } : filled;
}
