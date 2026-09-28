import { useState } from 'react';
import AttestationForm from './components/AttestationForm';
import CompanySettings from './components/CompanySettings';
import { DEFAULT_COMPANY } from './lib/defaultCompany';


export default function App() {
   const [company, setCompany] = useState(DEFAULT_COMPANY);

  const handleCompanySave = async (data) => {
    setCompany(data);
  };

  return (
    <div className="app">

      {/* ---------- Header ---------- */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
          </div>

          <div>
            <h1>
              Attest<span>Pro</span>
            </h1>
            <p>Générateur d'attestations de travail</p>
          </div>
        </div>
      </header>

      {/* ---------- Main ---------- */}
      <main className="main">
        <div className="grid">
          <AttestationForm
            company={company}
            onGenerated={() => {}}
          />

          <CompanySettings
            company={company}
            onSave={handleCompanySave}
          />
        </div>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        AttestPro — React + Supabase + jsPDF • Le PDF est généré dans ton navigateur, aucune
        donnée n’est envoyée à un service tiers d’impression
      </footer>

    </div>
  );
}