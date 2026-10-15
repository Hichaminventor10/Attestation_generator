import { jsPDF } from 'jspdf';

export function formatDateFr(iso) {
    if(!iso) return '' ;
    const [y, m, d] = String(iso).split('-');
    return `${d}/${m}/${y}` ;

}
/*Date complete */
export function formatDateFrFull(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}
const FEM = (e) => String(e.civilite) === 'Mme' ; 

function buildBody(e) {
     const nom = `${(e.nom || '').toUpperCase()} ${(e.prenom || '').trim()}` ;
     let s = `Nous soussignés, représentant de l'entreprise, attestons que ${e.civilite || 'M.'} ${nom}`;


     const birth = [] ;

     if (e.dateNaissance) 
        birth.push(`né${FEM(e) ? 'e' : ''} le ${formatDateFr(e.dateNaissance)}`) ;

     if (e.lieuNaissance) 
        birth.push(`à ${e.lieuNaissance}`) ;

     if (birth.length) 
        s += `, ${birth.join(', ')}`;

     if (e.cin)
        s += `, titulaire de la CIN n° ${e.cin}`;

     if (e.adresse) 
        s += `, demeurant${FEM(e) ? 'e' : ''} à ${e.adresse}`;

     s += `,` ;

     const poste = e.fonction ? `au poste de ${e.fonction}` : `au sein de notre société` ;

     const service = e.service ? ` au sein du service ${e.service}` : '';



  if (e.dateEntree && e.dateSortie) {
    s += ` a occupé ${poste}${service} du ${formatDateFr(e.dateEntree)} au ${formatDateFr(e.dateSortie)}.`;
  } else if (e.dateEntree) {
    s += ` occupe actuellement ${poste}${service} et est en service dans notre société depuis le ${formatDateFr(e.dateEntree)}.`;
  } else {
    s += ` occupe ${poste}${service}.`;
  }

 if (e.matricule)
  s += ` Matricule n° ${e.matricule}.`;

    s += ` La présente attestation est délivrée à l'intéressé${FEM(e) ? 'e' : ''} pour servir et valoir ce que de droit.`;


  return s;

}

  /**
 * Génère le PDF A4 de l'attestation.
 * @param {object} employee   Données du salarié
 * @param {object} company    Données de l'entreprise (en-tête)
 * @param {string} numero     N° d'attestation (ex: AT-2026-0001)
 * @param {string} dateGenerationIso  Date de génération (ISO)
 */


  export function generateAttestationPdf(employee, company, numero, dateGenerationIso) {


 const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const cx = W / 2;
  const navy = [30, 58, 110];

    /*pour un  Cadre double */
  doc.setDrawColor(...navy);
  doc.setLineWidth(1);
  doc.rect(10, 10, 190, 277);
  doc.setLineWidth(0.3);
  doc.rect(12.5, 12.5, 185, 272);

    /* En-tête entreprise */
  let y = 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...navy);
  doc.text((company.nom || '').toUpperCase(), cx, y, { align: 'center' });
  y += 7;


    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
        if (company.adresse) {
    doc.text(company.adresse, cx, y, { align: 'center' });
    y += 5;
        }
        const contact = [company.telephone, company.email].filter(Boolean).join('   •   ');
        if (contact) {
            doc.text(contact, cx, y, { align : 'center'});
            y += 5 ;
        }

        const ids = [company.rc, company.ice, company.if].filter(Boolean).join('   •   ');
        if (ids) {
            doc.text(ids, cx, y, { align : 'center'})
            y += 5 ;
        }

        y +=2 ;

  doc.setDrawColor(...navy);
  doc.setLineWidth(0.6);
  doc.line(25, y, 185, y);
  y += 7;

    doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  if (numero) doc.text(`N° ${numero}`, 185, y, { align: 'right' });
  y += 12;

    /*le Titre */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(...navy);
  doc.text('ATTESTATION DE TRAVAIL', cx, y, { align: 'center', charSpace: 1 });
  y += 6;
  doc.setLineWidth(0.5);
  doc.line(55, y, 155, y);
  y += 14;

   /* Corps du document */
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);

const body = buildBody(employee);
const lines = doc.splitTextToSize(body, 160);

    doc.text(body, 25, y, { maxWidth: 160, align: 'justify', lineHeightFactor: 1.7 });
  y += lines.length * 7.2 + 12;

   /* Signature */


  y = Math.max(y, 208);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);

    const ville = company.ville || '____________';
    const dateGen = formatDateFrFull(dateGenerationIso) || '____________';

      doc.text(`Fait à ${ville}, le ${dateGen}`, 25, y);

        /* Signature */

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text("L'EMPLOYEUR", 150, y - 1, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  doc.text('Signature et cachet', 150, y + 7, { align: 'center' });


    /* Pied de page */
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text(
    `Document généré le ${dateGen} — Référence ${numero || '—'}`,
    cx,
    283,
    { align: 'center' }
  );

  return doc ;

}



