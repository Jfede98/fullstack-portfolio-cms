"use client";
import { type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IAttentionCenterCard } from "@shared-ui/interfaces/cards/attentionCenter";

interface IBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  center: IAttentionCenterCard | null;
  onServicesClick: (services: string[]) => void;
  onDirectionsClick: (href: string) => void;
}

export const BottomSheet: FC<IBottomSheetProps> = ({
  isOpen,
  onClose,
  center,
  onServicesClick,
  onDirectionsClick
}) => {
  if (typeof window === "undefined" || !center) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[60vh] overflow-y-auto z-50 lg:hidden"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300
          }}
          role="dialog"
          aria-modal="true"
        >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            
            <div className="p-6">
              {/* Header con título y botón cerrar */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#6E3279]">
                  {center.title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Cerrar"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              {/* Imagen */}
              {center.image && (
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={center.image.src} 
                    alt={center.image.alt || center.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Información */}
              <div className="space-y-3 mb-6">
                {/* Dirección */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-[#6E3279]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm flex-1">
                    {center.address}
                  </span>
                </div>
                
                {/* Horario */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-[#6E3279]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm flex-1">
                    {center.schedule}
                  </span>
                </div>
              </div>
              
              {/* Botones */}
              <div className="space-y-3">
                {/* Botón Cómo llegar */}
                {center.navigationButton && (
                  <button
                    onClick={() => {
                      if (center.navigationButton?.href) {
                        onDirectionsClick(center.navigationButton.href);
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                      center.navigationButton.color === 'primary' 
                        ? 'bg-[#6E3279] text-white hover:bg-[#5a2a63]'
                        : center.navigationButton.color === 'secondary'
                        ? 'bg-[#FFCF00] text-black hover:bg-[#e6b800]'
                        : 'bg-[#6E3279] text-white hover:bg-[#5a2a63]'
                    }`}
                  >
                    {center.navigationButton.children || "Cómo llegar"}
                  </button>
                )}
                
                {/* Botón Ver servicios */}
                <button
                  onClick={() => onServicesClick(center.services)}
                  className="w-full px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer border border-[#6E3279] text-[#6E3279] bg-white hover:bg-[#6E3279] hover:text-white"
                >
                  {center.servicesButton.children || "Ver servicios disponibles"}
                </button>
              </div>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
};