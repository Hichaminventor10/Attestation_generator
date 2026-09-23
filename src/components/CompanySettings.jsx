import { useEffect, useState } from 'react';

const FIELDS = [
  ['nom', 'Nom de l’entreprise *'],
  ['adresse', 'Adresse'],
  ['ville', 'Ville'],
  ['telephone', 'Téléphone'],
  ['email', 'Email'],
  ['rc', 'RC (Registre de commerce)'],
  ['ice', 'ICE'],
  ['if', 'IF (Identifiant fiscal)']
];


function CompanySettings() {


return(
    <aside>
        <div className="card-head">
            <h2>Entreprise</h2>
            <p>apparait en tete</p>
        </div>
    </aside>







)


}

export default CompanySettings;