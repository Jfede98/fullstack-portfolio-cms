import { type FC } from "react";
import { MarkdownStyle } from "./style";
import type { IMarkdownProps } from "@shared-ui/interfaces/markdown";
import clsx from "clsx";

// Función para procesar contenido de navbar (con iconos font-icons y estilos específicos)
const processNavbarContent = (content: string): string => {
  return content
    // Limpiar entidades HTML
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    // Convertir listas con guiones e iconos para navbar
    .replace(/^\s*-\s+`icon:([^`]+)`\s+\[([^\]]+)\]\(([^)]+)\)\s*$/gm, 
      '<li class="flex gap-2 items-center hover:bg-primary-300 px-8"><span class="font-icons fill-current font-light text-[24px] inline-flex items-center justify-center overflow-hidden">$1</span> <div class="w-full"><a class="py-4 block w-full text-caption!" aria-label="enlace" href="$3">$2</a></div></li>')
    // Fallback: convertir listas simples con iconos
    .replace(/^\s*-\s+`icon:([^`]+)`\s+(.+)$/gm, 
      '<li class="flex gap-2 items-center hover:bg-primary-300 px-8"><span class="font-icons fill-current font-light text-[24px] inline-flex items-center justify-center overflow-hidden">$1</span> <div class="w-full"><span class="py-4 block w-full text-caption!">$2</span></div></li>')
    // Envolver listas en ul
    .replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul class="list-inside">$1</ul>')
    // Convertir markdown bold **texto** a HTML <strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Limpiar saltos de línea innecesarios
    .replace(/\n\s*\n/g, '\n')
    .replace(/^\s+|\s+$/g, '');
};

// Función para procesar contenido de footer (con iconos y listas)
const processFooterContent = (content: string): string => {
  return content
    // Limpiar entidades HTML
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    // Convertir markdown links [texto](url) a HTML con clases de footer
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a style="color: white !important; text-decoration: none !important;" class="hover:underline w-full block py-2" target="_blank" rel="noopener noreferrer" aria-label="enlace" href="$2">$1</a>')
    // Convertir listas con guiones a HTML lists
    .replace(/^\s*-\s+(.+)$/gm, '<li><div>$1</div></li>')
    // Envolver listas en ul con clase list-inside y sin bullets
    .replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul class="list-none">$1</ul>')
    // Procesar iconos icon:nombre para footer (material-icons)
    .replace(/`icon:([^`]+)`/g, '<span class="inline-flex items-center justify-center w-6 h-6 mr-2"><i class="material-icons text-current">$1</i></span>')
    // Convertir markdown bold **texto** a HTML <strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Limpiar saltos de línea innecesarios
    .replace(/\n\s*\n/g, '\n')
    .replace(/^\s+|\s+$/g, '');
};

// Función para procesar rich text general (FAQs, contenido)
const processRichTextContent = (content: string): string => {
  return content
    // Limpiar entidades HTML primero
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Convertir markdown bold **texto** a HTML <strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convertir markdown italic *texto* a HTML <em>
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    // Convertir markdown links [texto](url) a HTML
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Convertir saltos de línea a <br> pero mantener párrafos
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    // Envolver en párrafo si no está envuelto
    .replace(/^(?!<p>)/, '<p>')
    .replace(/(?<!<\/p>)$/, '</p>')
    // Limpiar párrafos vacíos
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '');
};

export const MarkdownItem: FC<IMarkdownProps> = ({
  desc,
  className,
  variant = 'default'
}) => {
  const { container } = MarkdownStyle();
  
  // Para navbar, usar procesamiento específico
  if (variant === 'navbar') {
    const processedContent = processNavbarContent(desc || '');
    return (
      <div 
        data-testid="markdown-item"
        className={clsx(
          "leading-6",
          className?.container
        )}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    );
  }
  
  // Para footer, usar procesamiento específico
  if (variant === 'footer') {
    const processedContent = processFooterContent(desc || '');
    return (
      <div 
        data-testid="markdown-item"
        className={clsx(
          "leading-6",
          className?.container
        )}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    );
  }
  
  // Solo para contenido general (FAQs), procesar rich text
  const processedContent = processRichTextContent(desc || '');

  return (
    <div 
      data-testid="markdown-item"
      className={clsx(container(), className?.container)}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};
