
import {useState} from 'react'



const Empty = {
    civilite: 'M.',
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    cin: '',
    adresse: '',
    fonction: '',
    service: '',
    matricule: '',
    dateEntree: '',
    dateSortie: ''

};






function AttestationForm() {


return(<>

<section className="Card">
    <div>
        <h2>Données du Salarié</h2>
        <p>Saisissez les informations, puis cliquez sur « Générer l'attestation ».</p>
    </div>

    <form>
        <h3 className='group-title'>Identité</h3>
        <div className='fields'>
            <div className='field half'>
                <label></label>

            </div>
        </div>
    </form>



</section>



</>




)



}

export default AttestationForm