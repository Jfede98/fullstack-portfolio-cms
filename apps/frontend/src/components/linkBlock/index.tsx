"use client";

import type { FC } from "react";
import { Link, Button } from "@sitio-publico/shared-ui";

interface LinkBlockProps {
  title?: string;
  description?: string;
  links: Array<{
    label: string;
    url: string;
    isExternal: boolean;
    isButton: boolean;
  }>;
}

export const LinkBlock: FC<LinkBlockProps> = ({
  title,
  description,
  links
}) => {
  return (
    <section className="w-full py-12">
      <div className="max-w-container mx-auto px-4 text-center">
        {title && (
          <h2 className="text-primary-700 mb-4 text-2xl font-bold">
            {title}
          </h2>
        )}

        {description && (
          <p className="text-gray-500 mb-8">
            {description}
          </p>
        )}

        <div className="flex flex-col items-center gap-4">
          {links.map((link, index) => {
            if (link.isButton) {
              return (
                <Button
                  key={index}
                  type="link"
                  href={link.url}
                  target={link.isExternal ? "_blank" : "_self"}
                  color="outline"
                  size="fit"
                >
                  {link.label}
                </Button>
              );
            }
            
            return (
              <Link
                key={index}
                href={link.url}
                target={link.isExternal ? "_blank" : "_self"}
                className={{ 
                  base: "text-primary-500 underline underline-offset-2 hover:text-primary-600 transition-colors" 
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
