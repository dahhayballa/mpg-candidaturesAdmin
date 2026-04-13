import React, { useState, useEffect } from 'react'
import { X, Save, UserPlus, ChevronRight, ChevronLeft, Check, ClipboardList, User, FileText, BarChart, Info } from 'lucide-react'
import type { Candidate } from '../types'

interface CandidateModalProps {
  candidate: Candidate | null
  onSave: (data: Partial<Candidate>) => void
  onClose: () => void
  loading: boolean
}

const SPECIALTIES = [
  "Tuyauterie industrielle",
  "Électricité industrielle",
  "Opérations pétrolières et gazières",
  "HSE",
  "Techniques minières",
  "Maintenance industrielle",
  "Construction métallique et soudure"
]

const ETATS = [
  { value: 'selectionne', label: 'Sélectionné' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'rejet', label: 'Rejeté / Refusé' },
]

const STATUS_OPTIONS = [
  "Complet",
  "Incomplet",
  "Partiel",
  "Vide"
]

const MENTION_OPTIONS = [
  "Non retenu",
  "Moyen",
  "Bon",
  "Excellent"
]

const STEPS = [
  { id: 1, label: 'Identité', icon: User },
  { id: 2, label: 'Dossier', icon: FileText },
  { id: 3, label: 'Évaluation', icon: BarChart },
  { id: 4, label: 'Notes', icon: ClipboardList }
]

export const CandidateModal: React.FC<CandidateModalProps> = ({
  candidate,
  onSave,
  onClose,
  loading,
}) => {
  const isEdit = !!candidate
  const [currentStep, setCurrentStep] = useState(1)
  
  const [form, setForm] = useState<Partial<Candidate>>({
    name: candidate?.name ?? '',
    email_addr: candidate?.email_addr ?? '',
    telephone: candidate?.telephone ?? '',
    nni: candidate?.nni ?? '',
    source: candidate?.source ?? '',
    specialty: candidate?.specialty ?? '',
    etat: candidate?.etat ?? 'en_attente',
    status: candidate?.status ?? '',
    has_cv: candidate?.has_cv ?? 0,
    has_motivation: candidate?.has_motivation ?? 0,
    has_diplomas: candidate?.has_diplomas ?? 0,
    retenu: candidate?.retenu ?? 0,
    score_niveau: candidate?.score_niveau ?? 0,
    score_experience: candidate?.score_experience ?? 0,
    score_motivation: candidate?.score_motivation ?? 0,
    score_adequation: candidate?.score_adequation ?? 0,
    score_dossier: candidate?.score_dossier ?? 0,
    score_disponibilite: candidate?.score_disponibilite ?? 0,
    score_total: candidate?.score_total ?? 0,
    mention: candidate?.mention ?? '',
    note_evaluateur: candidate?.note_evaluateur ?? '',
    note_globale: candidate?.note_globale ?? '',
    rang: candidate?.rang ?? null,
    rang_in_specialty: candidate?.rang_in_specialty ?? null,
  })

  const set = (k: keyof Candidate, v: any) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = () => {
    onSave(form)
  }

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, STEPS.length))
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nom complet *</label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => set('name', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium"
                  placeholder="ex: Ahmed Benali"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={form.email_addr || ''}
                  onChange={(e) => set('email_addr', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Téléphone</label>
                <input
                  type="text"
                  value={form.telephone || ''}
                  onChange={(e) => set('telephone', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium"
                  placeholder="+222 XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">NNI</label>
                <input
                  type="text"
                  value={form.nni || ''}
                  onChange={(e) => set('nni', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium"
                  placeholder="Numéro National d'Identité"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Source</label>
                <input
                  type="text"
                  value={form.source || ''}
                  onChange={(e) => set('source', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium"
                  placeholder="ex: Email, LinkedIn..."
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Spécialité *</label>
                <select
                  value={form.specialty || ''}
                  onChange={(e) => set('specialty', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium appearance-none"
                >
                  <option value="">Sélectionner une spécialité…</option>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">État</label>
                <select
                  value={form.etat || ''}
                  onChange={(e) => set('etat', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium appearance-none"
                >
                  {ETATS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Statut</label>
                <select
                  value={form.status || ''}
                  onChange={(e) => set('status', e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium appearance-none"
                >
                  <option value="">Sélectionner un statut…</option>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Documents & Décision</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'has_cv', label: 'CV reçu' },
                  { key: 'has_motivation', label: 'Lettre motivation' },
                  { key: 'has_diplomas', label: 'Diplômes' },
                  { key: 'retenu', label: 'Retenu pour sélection' },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      (form as any)[key]
                        ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                        : 'border-gray-100 bg-gray-50/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      (form as any)[key] ? 'bg-brand-500 border-brand-500' : 'bg-white border-gray-200'
                    }`}>
                      {(form as any)[key] ? <Check size={12} className="text-white" /> : null}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={!!(form as any)[key]}
                      onChange={(e) => set(key as any, e.target.checked ? 1 : 0)}
                    />
                    <span className={`text-sm font-bold ${ (form as any)[key] ? 'text-brand-900' : 'text-gray-500' }`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'score_niveau', label: 'Score Niveau' },
                  { key: 'score_experience', label: 'Expérience' },
                  { key: 'score_motivation', label: 'Motivation' },
                  { key: 'score_adequation', label: 'Adéquation' },
                  { key: 'score_dossier', label: 'Dossier' },
                  { key: 'score_disponibilite', label: 'Disponibilité' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={(form as any)[key] === null ? '' : (form as any)[key]}
                      onChange={(e) => set(key as any, parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium"
                    />
                  </div>
                ))}
                <div className="col-span-2 pt-2">
                   <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
                           <BarChart size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Score Total Global</p>
                          <p className="text-xl font-black text-brand-900 leading-none mt-0.5">{form.score_total || 0}</p>
                        </div>
                     </div>
                     <input
                      type="number"
                      step="0.1"
                      value={form.score_total === null ? '' : form.score_total}
                      onChange={(e) => set('score_total', parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-2 text-center text-lg font-black bg-white border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                   </div>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-[10px] text-gray-400 font-medium">Les scores sont calculés sur une échelle de 0 à 20 ou 0 à 100 selon le paramétrage.</p>
                </div>
             </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mention</label>
                  <select
                    value={form.mention || ''}
                    onChange={(e) => set('mention', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium appearance-none"
                  >
                    <option value="">Sélectionner…</option>
                    {MENTION_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="col-span-1 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rang G.</label>
                      <input
                        type="number"
                        value={form.rang === null ? '' : form.rang}
                        onChange={(e) => set('rang', parseInt(e.target.value) || null)}
                        className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rang Spé.</label>
                      <input
                        type="number"
                        value={form.rang_in_specialty === null ? '' : form.rang_in_specialty}
                        onChange={(e) => set('rang_in_specialty', parseInt(e.target.value) || null)}
                        className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 font-medium"
                      />
                    </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Note de l'évaluateur</label>
                  <textarea
                    rows={3}
                    value={form.note_evaluateur || ''}
                    onChange={(e) => set('note_evaluateur', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium resize-none shadow-inner"
                    placeholder="Commentaires techniques..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Note globale finale</label>
                  <textarea
                    rows={2}
                    value={form.note_globale || ''}
                    onChange={(e) => set('note_globale', e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all font-medium resize-none shadow-inner"
                    placeholder="Décision du comité..."
                  />
                </div>
             </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isEdit ? 'bg-orange-50 text-orange-600' : 'bg-brand-50 text-brand-600'}`}>
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {isEdit ? 'Modifier le candidat' : 'Ajouter un candidat'}
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                {STEPS.find(s => s.id === currentStep)?.label} — {currentStep} de 4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all border border-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper Indication */}
        <div className="px-8 pt-6">
           <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
              {STEPS.map((step) => {
                const Icon = step.icon
                const isActive = currentStep >= step.id
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className="relative z-10 flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                      isActive 
                      ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-100 scale-110' 
                      : 'bg-white border-gray-200 text-gray-300 group-hover:border-brand-200'
                    }`}>
                       <Icon size={18} />
                    </div>
                  </button>
                )
              })}
           </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-8">
           {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-50 bg-gray-50/30">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all ${
              currentStep === 1 
              ? 'opacity-0 pointer-events-none' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <ChevronLeft size={18} />
            Précédent
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 && !form.name}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-black text-sm shadow-xl disabled:opacity-30"
              >
                Suivant
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !form.name || !form.specialty}
                className="flex items-center gap-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-all font-black text-sm shadow-xl disabled:opacity-50 shadow-brand-200"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <Save size={18} />}
                Terminer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
