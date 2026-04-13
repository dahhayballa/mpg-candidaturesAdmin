import React from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import type { Toast } from '../hooks/useToast'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: number) => void
}

const CONFIG = {
  success: {
    icon: CheckCircle,
    cls: 'bg-success-50 border-success-100 text-success-700',
    iconCls: 'text-success-700',
  },
  error: {
    icon: XCircle,
    cls: 'bg-danger-50 border-danger-100 text-danger-700',
    iconCls: 'text-danger-700',
  },
  info: {
    icon: Info,
    cls: 'bg-brand-50 border-brand-100 text-brand-700',
    iconCls: 'text-brand-700',
  },
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-72">
      {toasts.map((t) => {
        const cfg = CONFIG[t.type]
        const Icon = cfg.icon
        return (
          <div
            key={t.id}
            className={`flex items-start gap-2.5 p-3 rounded-xl border shadow-md text-sm ${cfg.cls} animate-in slide-in-from-right-4 duration-200`}
          >
            <Icon size={16} className={`flex-shrink-0 mt-0.5 ${cfg.iconCls}`} />
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => onRemove(t.id)}
              className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
