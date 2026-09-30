import { useState } from 'react';
import AttestationForm from './components/AttestationForm';
import CompanySettings from './components/CompanySettings';
import { DEFAULT_COMPANY } from './lib/defaultCompany';
import './App.css'; 

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
            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-plus"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M9 14h6"></path><path d="M12 17v-6"></path></svg>
         
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
        AttestPro — React + Supabase + jsPDF 
      </footer>

    </div>
  );
}