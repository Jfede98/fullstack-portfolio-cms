"use client";

import type { FC } from "react";
import { useState, useEffect, useMemo } from "react";
import { Accordion, Icon, FAQCardsSlider, MarkdownItem } from "@sitio-publico/shared-ui";
import type { IFaqsBlockProps, IFAQItem } from "@interfaces/components/faqsBlock";
import clsx from "clsx";

export const FaqsBlock: FC<IFaqsBlockProps> = (props) => {
  // Detectar si es el formato original o extendido
  const isExtendedFormat = 'searchPlaceholder' in props || 'showCategories' in props || 'featuredFAQs' in props;
  
  // Props con defaults para compatibilidad
  const {
    title,
    subtitle,
    questions,
    isFirstBlock = false
  } = props;
  
  // Props extendidas (solo si están disponibles)
  const searchPlaceholder = isExtendedFormat ? (props as any).searchPlaceholder || '' : '';
  const showCategories = isExtendedFormat ? (props as any).showCategories || false : false;
  const featuredFAQs = isExtendedFormat ? (props as any).featuredFAQs || [] : [];
  const categories = isExtendedFormat ? (props as any).categories || [] : [];
  const featuredSliderTitle = isExtendedFormat ? (props as any).featuredSliderTitle || 'Lo más preguntado' : 'Lo más preguntado';
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  // Si no es formato extendido, renderizar como antes
  if (!isExtendedFormat) {
    return (
      <section className={clsx("w-full", isFirstBlock ? "pt-36 pb-12" : "py-12")}>
        <div className="max-w-container mx-auto px-4">
          {title && (
            <h2 className="text-primary-700 text-center mb-4 text-2xl font-bold">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-gray-500 text-center mb-8">
              {subtitle}
            </p>
          )}

          <Accordion
            items={questions}
            variant="outline"
            isExclusive={true}
          />
        </div>
      </section>
    );
  }

  // Función para truncar texto de manera inteligente
  const truncateText = (text: string, maxLength: number = 150): string => {
    if (!text) return '';
    
    // Remover markdown básico para el preview
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remover **bold**
      .replace(/\*(.*?)\*/g, '$1')     // Remover *italic*
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remover [links](url)
      .replace(/#{1,6}\s/g, '')        // Remover headers
      .trim();
    
    if (cleanText.length <= maxLength) return cleanText;
    
    // Cortar en la palabra más cercana al límite
    const truncated = cleanText.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    // Si hay un espacio cerca del final, cortar ahí
    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    // Si no, cortar en el límite pero sin puntos suspensivos
    // porque line-clamp-2 ya los agregará
    return truncated;
  };
  // Función para buscar en texto (solo para formato extendido)
  const searchInText = (text: string, term: string): boolean => {
    if (!term) return true;
    
    // Palabras a ignorar (artículos, preposiciones, etc.)
    const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para', 'y', 'o', 'que', 'es', 'se', 'mi', 'tu', 'su'];
    
    // Dividir el término de búsqueda en palabras
    const searchWords = term
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.includes(word)); // Filtrar palabras cortas y stop words
    
    // Si no hay palabras válidas, no buscar
    if (searchWords.length === 0) return true;
    
    const textToSearch = text.toLowerCase();
    
    // Cambiar a OR: al menos una palabra debe estar presente
    return searchWords.some(word => textToSearch.includes(word));
  };

  // Filtrar preguntas basado en búsqueda y categoría
  const filteredQuestions = useMemo(() => {
    let filtered = (questions as IFAQItem[]).filter(q => q && q.title && q.description);

    if (selectedCategory) {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(faq => 
        searchInText(faq.title || '', searchTerm) || 
        searchInText(faq.description || '', searchTerm)
      );
    }

    return filtered;
  }, [questions, selectedCategory, searchTerm]);

  const shouldShowQuestions = selectedCategory || searchTerm;
  const hasResults = filteredQuestions.length > 0;

  // Manejar apertura automática de preguntas basada en URL hash
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && isExtendedFormat) {
      // Buscar la pregunta con ese anchor
      const targetFaq = (questions as IFAQItem[]).find(faq => faq.anchor === hash);
      if (targetFaq) {
        // Seleccionar automáticamente la categoría de la pregunta
        if (targetFaq.category) {
          setSelectedCategory(targetFaq.category);
        }
        
        // Abrir la pregunta
        setOpenQuestionId(hash);
        
        // Scroll suave después de que se abra la pregunta
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [questions, isExtendedFormat]);

  // Manejar cambios en la URL
  const handleQuestionToggle = (questionId: string | null, isOpen: boolean) => {
    if (!isExtendedFormat) return;
    
    if (isOpen && questionId) {
      setOpenQuestionId(questionId);
      // Actualizar URL con el hash
      const newUrl = `${window.location.pathname}#${questionId}`;
      window.history.pushState(null, '', newUrl);
    } else {
      setOpenQuestionId(null);
      // Remover hash de la URL
      const newUrl = window.location.pathname;
      window.history.pushState(null, '', newUrl);
    }
  };

  // Manejar navegación desde el slider
  const handleSliderNavigation = (anchor: string) => {
    // Buscar la pregunta para obtener su categoría
    const targetFaq = (questions as IFAQItem[]).find(faq => faq.anchor === anchor);
    
    // Limpiar término de búsqueda
    setSearchTerm("");
    
    // Si la pregunta tiene categoría, seleccionarla automáticamente
    if (targetFaq?.category) {
      setSelectedCategory(targetFaq.category);
    } else {
      // Si no tiene categoría, limpiar filtros
      setSelectedCategory("");
    }
    
    // Abrir la pregunta específica
    setOpenQuestionId(anchor);
    
    // Actualizar URL
    const newUrl = `${window.location.pathname}#${anchor}`;
    window.history.pushState(null, '', newUrl);
    
    // Scroll suave hacia la pregunta después de un pequeño delay
    setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  };

  // Preparar datos para el slider de destacados
  const featuredSliderData = featuredFAQs
    .filter((faq: IFAQItem) => faq && faq.title && faq.description && faq.anchor)
    .map((faq: IFAQItem) => ({
      question: faq.title,
      description: truncateText(faq.description || ''),
      linkButton: {
        children: "Ver respuesta completa",
        onClick: () => handleSliderNavigation(faq.anchor!)
      }
    }));

  return (
    <section className={clsx("w-full", isFirstBlock ? "pt-36 pb-12" : "py-12")}>
      <div className="max-w-container mx-auto px-4">
        {/* Títulos */}
        {title && (
          <h1 className="text-primary-700 text-center mb-4 text-2xl lg:text-3xl font-bold">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="text-gray-500 text-left md:text-center mb-8">
            {subtitle}
          </p>
        )}

        {/* Buscador */}
        {searchPlaceholder && (
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                <img 
                  src="/assets/svg/Leading Icon.svg" 
                  alt="Buscar" 
                  className="w-5 h-5 text-gray-400"
                />
              </div>
              
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
              />
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity z-10"
                  aria-label="Limpiar búsqueda"
                >
                  <img 
                    src="/assets/svg/cancel.svg" 
                    alt="Limpiar" 
                    className="w-5 h-5 text-gray-400"
                  />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filtros de categorías */}
        {showCategories && categories.length > 0 && (
          <div className="mb-8">
            <div className="w-full max-w-[800px] mx-auto overflow-x-auto">
              <div className="flex justify-center md:flex-wrap gap-3 pb-2 min-w-max md:min-w-0">
                {categories.map((category: any) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.value ? "" : category.value
                    )}
                    className={clsx(
                      "px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer text-sm whitespace-nowrap flex-shrink-0",
                      selectedCategory === category.value
                        ? "border-[#1B263B] text-[#0D1B2A] bg-[#E0E1DD]"
                        : "border-[#DBDBDC] text-[#1B263B] bg-white hover:border-[#1B263B]"
                    )}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lista de preguntas filtradas */}
        {isExtendedFormat && shouldShowQuestions && (
          <div className="mb-12">
            {hasResults ? (
              <div className="transition-all duration-300 ease-in-out flex flex-col gap-4">
                {filteredQuestions.map((faq, index) => {
                  const isOpen = openQuestionId === faq.anchor;
                  return (
                    <div 
                      key={faq.anchor || index} 
                      id={faq.anchor} 
                      className="transition-all duration-300 ease-in-out relative py-2.25 px-5.75 rounded-[10px] border border-gray-200 bg-white cursor-pointer"
                      style={isOpen ? { paddingTop: '1.5625rem', paddingBottom: '1.5625rem' } : {}}
                      onClick={() => handleQuestionToggle(faq.anchor || null, !isOpen)}
                    >
                      <div className="flex gap-2 items-center justify-between w-full">
                        <span className="text-base leading-6 font-medium text-primary-900 flex-1">
                          {faq.title}
                        </span>
                        <Icon
                          name="keyboard_arrow_down"
                          size="sm"
                          type="rounded"
                          className={{ 
                            base: clsx(
                              "transition duration-300 ease-in-out",
                              isOpen ? "rotate-180" : ""
                            )
                          }}
                        />
                      </div>
                      {isOpen && (
                        <div className="mt-1 grid grid-rows-[1fr] opacity-100 overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out">
                          <div className="min-h-0">
                            <div className="pt-4 border-t border-gray-100 mt-4">
                              <MarkdownItem
                                desc={faq.description || ''}
                                className={{
                                  paragraph: "text-body leading-6 text-gray-400 mb-2 last:mb-0"
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <img 
                  src="/assets/svg/search_off.svg" 
                  alt="Sin resultados" 
                  className="w-[106px] h-[106px] mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-[#6E6E73] mb-2">
                  No encontramos resultados
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedCategory && searchTerm ? (
                    <>
                      No hay preguntas en <strong>{categories.find((cat: any) => cat.value === selectedCategory)?.label}</strong><br />
                      relacionadas con <strong>"{searchTerm}"</strong>
                    </>
                  ) : selectedCategory ? (
                    <>
                      No hay preguntas en <strong>{categories.find((cat: any) => cat.value === selectedCategory)?.label}</strong>
                    </>
                  ) : searchTerm ? (
                    <>
                      No hay preguntas relacionadas con <strong>"{searchTerm}"</strong>
                    </>
                  ) : (
                    "Selecciona una categoría o busca una pregunta"
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Slider de FAQs destacados */}
        {featuredSliderData.length > 0 && (
          <div className="mb-12">
            <FAQCardsSlider
              title={featuredSliderTitle}
              cards={featuredSliderData}
            />
          </div>
        )}

        {/* Lista de preguntas para formato original o cuando no hay filtros activos */}
        {(!isExtendedFormat || (!shouldShowQuestions && !featuredSliderData.length)) && (
          <div>
            {isExtendedFormat ? (
              <div className="transition-all duration-300 ease-in-out flex flex-col gap-4">
                {(questions as IFAQItem[]).map((faq, index) => {
                  const isOpen = openQuestionId === faq.anchor;
                  return (
                    <div 
                      key={faq.anchor || index} 
                      id={faq.anchor} 
                      className="transition-all duration-300 ease-in-out relative py-2.25 px-5.75 rounded-[10px] border border-gray-200 bg-white cursor-pointer"
                      style={isOpen ? { paddingTop: '1.5625rem', paddingBottom: '1.5625rem' } : {}}
                      onClick={() => handleQuestionToggle(faq.anchor || null, !isOpen)}
                    >
                      <div className="flex gap-2 items-center justify-between w-full">
                        <span className="text-base leading-6 font-medium text-primary-900 flex-1">
                          {faq.title}
                        </span>
                        <Icon
                          name="keyboard_arrow_down"
                          size="sm"
                          type="rounded"
                          className={{ 
                            base: clsx(
                              "transition duration-300 ease-in-out",
                              isOpen ? "rotate-180" : ""
                            )
                          }}
                        />
                      </div>
                      {isOpen && (
                        <div className="mt-1 grid grid-rows-[1fr] opacity-100 overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-out">
                          <div className="min-h-0">
                            <div className="pt-4 border-t border-gray-100 mt-4">
                              <MarkdownItem
                                desc={faq.description || ''}
                                className={{
                                  paragraph: "text-body leading-6 text-gray-400 mb-2 last:mb-0"
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Accordion
                items={questions}
                variant="outline"
                isExclusive={true}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};
