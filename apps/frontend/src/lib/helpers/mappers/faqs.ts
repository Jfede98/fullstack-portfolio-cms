export const mapFaqs = (data: any) => {
  // Convertir HTML a Markdown (incluyendo HTML de Word)
  const convertHtmlToMarkdown = (html: string) => {
    if (!html) return '';
    return html
      // Limpiar atributos de Word
      .replace(/<span[^>]*data-contrast[^>]*>/g, '')
      .replace(/<span[^>]*data-ccp-props[^>]*>/g, '')
      .replace(/<\/span>/g, '')
      // Convertir elementos básicos
      .replace(/<p[^>]*>/g, '')
      .replace(/<\/p>/g, '\n\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/g, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/g, '*$1*')
      .replace(/<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g, '[$2]($1)')
      // Listas
      .replace(/<ul[^>]*>/g, '')
      .replace(/<\/ul>/g, '')
      .replace(/<li[^>]*>/g, '- ')
      .replace(/<\/li>/g, '\n')
      // Limpiar espacios extra
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  // Generar anchor automático si no existe
  const generateAnchor = (question: string) => {
    return question
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  // Mapear categorías a labels amigables
  const getCategoryLabel = (category: string) => {
    if (!category) return null;
    const categoryLabels: Record<string, string> = {
      'internet': 'Internet',
      'facturacion-pagos': 'Facturación y pagos',
      'telefonia': 'Telefonía',
      'streaming': 'Streaming',
      'solicitudes': 'Solicitudes'
    };
    return categoryLabels[category] || category;
  };

  // Detectar si tiene campos nuevos (formato extendido)
  const hasExtendedFields = data.questions?.some((item: any) => 
    item.category !== undefined || 
    item.anchor !== undefined || 
    item.frequently_asked !== undefined
  );
  
  const hasSearchConfig = data.searchPlaceholder !== undefined || 
                         data.showCategories !== undefined ||
                         data.availableCategories !== undefined;

  // Mapeo básico (compatible con formato original)
  const basicMapping = {
    title: data.title,
    subtitle: data.subtitle,
    questions: data.questions?.map((item: any) => ({
      title: item.question,
      description: convertHtmlToMarkdown(item.answer)
    })) || [],
    highlightCard: data.highlightCard
  };

  // Si no tiene campos extendidos ni configuración de búsqueda, devolver formato básico
  if (!hasExtendedFields && !hasSearchConfig) {
    return basicMapping;
  }

  // Mapeo extendido
  const mappedQuestions = data.questions?.map((item: any) => ({
    id: item.id,
    title: item.question,
    description: convertHtmlToMarkdown(item.answer),
    category: item.category?.name || item.category || null, // Soporte para relación y string
    categoryLabel: getCategoryLabel(item.category?.name || item.category),
    anchor: item.anchor || generateAnchor(item.question),
    frequently_asked: item.frequently_asked || false,
    order: item.order || 0
  })) || [];

  // Separar FAQs destacados
  const featuredFAQs = mappedQuestions
    .filter((faq: any) => faq.frequently_asked)
    .sort((a: any, b: any) => a.order - b.order);

  // Usar availableCategories si está configurado, sino extraer de las preguntas
  let categories = [];
  
  if (data.availableCategories && data.availableCategories.length > 0) {
    // Usar categorías configuradas en el bloque
    categories = data.availableCategories
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .map((cat: any) => ({
        value: cat.name, // Usar name en lugar de slug para que coincida con las FAQs
        label: cat.name
      }));
  } else {
    // Extraer categorías únicas de las preguntas (fallback)
    const uniqueCategories = [...new Set(
      mappedQuestions
        .filter((faq: any) => faq.category)
        .map((faq: any) => faq.category)
    )];
    
    categories = (uniqueCategories as string[]).map((category: string) => ({
      value: category,
      label: getCategoryLabel(category)
    }));
  }

  return {
    ...basicMapping,
    searchPlaceholder: data.searchPlaceholder,
    showCategories: data.showCategories || false,
    searchScope: data.searchScope || 'faq',
    featuredSliderTitle: data.featuredSliderTitle || 'Lo más preguntado',
    questions: mappedQuestions,
    featuredFAQs,
    categories
  };
};