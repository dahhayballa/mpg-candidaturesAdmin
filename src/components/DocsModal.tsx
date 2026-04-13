import React from 'react'
import { X, File, FolderOpen, ChevronRight, ExternalLink, Minus, Plus, RefreshCw, Download } from 'lucide-react'
import type { Candidate } from '../types'

interface DocsModalProps {
  candidate: Candidate
  onClose: () => void
}

export const DocsModal: React.FC<DocsModalProps> = ({ candidate, onClose }) => {
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null)
  const [zoom, setZoom] = React.useState(1)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })

  const email = candidate.email_addr || 'unknown'
  
  // Clean up filenames (handles JSON-like strings, newlines, and quotes)
  const rawAttachments = candidate.attachment_names || ''
  
  const parseAttachments = (raw: string): string[] => {
    try {
      // Try JSON parse first if it looks like an array
      if (raw.trim().startsWith('[')) {
        return (JSON.parse(raw) as string[]).map(s => s.replace(/[\[\]"]/g, '').trim())
      }
    } catch (e) { /* ignore */ }

    // Fallback: Split by newline or comma, then clean up each part
    return raw
      .split(/[\n,]/)
      .map(s => s.replace(/[\[\]"]/g, '').trim())
      .filter(Boolean)
  }

  const attachments = parseAttachments(rawAttachments)

  const folderName = candidate.folder_path 
    ? candidate.folder_path.split(/[\\\/]/).filter(Boolean).pop() 
    : email

  const baseUrl = `http://localhost:8087/${encodeURIComponent(folderName || email)}`

  const getFileUrl = (fileName: string) => `${baseUrl}/${encodeURIComponent(fileName)}`

  const isImage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')
  }

  const isPdf = (fileName: string) => {
    return fileName.toLowerCase().endsWith('.pdf')
  }

  // Reset zoom and position when file changes
  React.useEffect(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [selectedFile])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => setIsDragging(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 transition-all ${selectedFile ? 'max-w-6xl w-full h-[90vh]' : 'max-w-xl w-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
              <FolderOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">Documents du candidat</h2>
              <p className="text-xs text-gray-500 font-medium truncate max-w-[250px]">{candidate.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all border border-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* List Section */}
          <div className={`border-r border-gray-50 overflow-y-auto scrollbar-thin transition-all ${selectedFile ? 'w-80' : 'w-full'}`}>
            <div className="p-6 space-y-3">
              {attachments.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <File size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-bold">Aucun document</p>
                </div>
              ) : (
                attachments.map((file, idx) => {
                  const active = selectedFile === file
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group text-left ${active
                          ? 'border-brand-500 bg-brand-50 shadow-sm'
                          : 'border-gray-100 hover:border-brand-200 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-brand-500 text-white' : 'bg-gray-50 text-gray-400 group-hover:text-brand-500'}`}>
                          <File size={16} />
                        </div>
                        <span className={`text-xs font-bold truncate ${active ? 'text-brand-900' : 'text-gray-700'}`}>
                          {file}
                        </span>
                      </div>
                      <ChevronRight size={14} className={`${active ? 'text-brand-500' : 'text-gray-300'}`} />
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Viewer Section */}
          {selectedFile ? (
            <div className="flex-1 bg-gray-50 relative flex flex-col group/viewer">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {isImage(selectedFile) && (
                  <div className="flex bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 p-1 opacity-100 lg:opacity-0 lg:group-hover/viewer:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
                      title="Zoom -"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="px-2 flex items-center text-[10px] font-bold text-gray-500 min-w-[45px] justify-center">
                      {Math.round(zoom * 100)}%
                    </div>
                    <button 
                      onClick={() => setZoom(z => Math.min(3, z + 0.25))}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
                      title="Zoom +"
                    >
                      <Plus size={16} />
                    </button>
                    <div className="w-px bg-gray-200 mx-1 my-1" />
                    <button 
                      onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }) }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
                      title="Réinitialiser"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setSelectedFile(null)}
                  className="bg-white/90 backdrop-blur p-2.5 rounded-xl shadow-lg border border-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {isPdf(selectedFile) ? (
                <iframe
                  src={getFileUrl(selectedFile)}
                  className="w-full h-full border-none"
                  title="PDF Viewer"
                />
              ) : isImage(selectedFile) ? (
                <div 
                  className="w-full h-full flex items-center justify-center p-8 overflow-hidden cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    src={getFileUrl(selectedFile)}
                    alt={selectedFile}
                    className="max-w-full max-h-full rounded-lg shadow-xl pointer-events-none transition-transform duration-200 ease-out select-none"
                    style={{ 
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-4 text-brand-500">
                    <File size={32} />
                  </div>
                  <h3 className="text-lg font-black text-gray-800 tracking-tight mb-2">Aperçu non disponible</h3>
                  <p className="text-sm text-gray-500 max-w-xs mb-6 font-medium">
                    Ce format de fichier ne peut pas être affiché directement.
                  </p>
                  <a
                    href={getFileUrl(selectedFile)}
                    download
                    className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-black rounded-xl transition-all shadow-lg"
                  >
                    <Download size={16} />
                    Télécharger
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex flex-1 bg-gray-50/50 items-center justify-center text-center p-12">
              <div className="max-w-xs">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-gray-100 mx-auto mb-6 text-gray-200">
                  <File size={40} />
                </div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">Visualiseur</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  Sélectionnez un fichier pour l'afficher.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-8 py-4 bg-white border-t border-gray-100 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connecté (Port 8087)</span>
          </div>
          {selectedFile && (
            <a
              href={getFileUrl(selectedFile)}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest flex items-center gap-1"
            >
              Nouveau onglet <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
