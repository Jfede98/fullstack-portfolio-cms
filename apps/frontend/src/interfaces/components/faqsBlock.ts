export interface IFAQItem {
  id?: number;
  title: string;
  description: string;
  category?: string;
  categoryLabel?: string;
  anchor?: string;
  frequently_asked?: boolean;
  order?: number;
}

export interface IFAQCategory {
  value: string;
  label: string;
}

// Interfaz original para compatibilidad
interface OriginalFaqsBlockProps {
  title?: string;
  subtitle?: string;
  questions: Array<{
    title: string;
    description: string;
  }>;
  highlightCard?: any;
  isFirstBlock?: boolean;
}

// Interfaz extendida con nuevas funcionalidades
interface ExtendedFaqsBlockProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  showCategories?: boolean;
  searchScope?: 'faq' | 'global';
  questions: IFAQItem[];
  featuredFAQs?: IFAQItem[];
  categories?: IFAQCategory[];
  highlightCard?: any;
  isFirstBlock?: boolean;
}

// Union type para mantener compatibilidad
export type IFaqsBlockProps = OriginalFaqsBlockProps | ExtendedFaqsBlockProps;