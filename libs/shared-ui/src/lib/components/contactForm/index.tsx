"use client";

import { type FC, useState, useEffect } from "react";
import { TextField } from "@shared-ui/components/textField";
import { CheckboxCustom } from "@shared-ui/components/checkboxCustom";
import { Button } from "@shared-ui/components/button";
import { ContactFormStyle } from "./style";
import type { IContactFormProps } from "@shared-ui/interfaces/contactForm";
import clsx from "clsx";

export const ContactForm: FC<IContactFormProps> = ({
  fields,
  checkboxLabel,
  buttonText,
  onSubmit,
  className
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [accepted, setAccepted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const { form, fieldsGrid, fieldWrapper, fieldFull, checkboxWrapper, buttonWrapper, button } =
    ContactFormStyle();

  // Validar campos requeridos
  useEffect(() => {
    const requiredFields = fields.filter((f) => f.required);
    const allRequiredFilled = requiredFields.every(
      (field) => formData[field.name]?.trim()
    );
    setIsFormValid(allRequiredFilled && accepted);
  }, [formData, accepted, fields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && isFormValid) {
      onSubmit(formData);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Separar campos por columna
  const leftFields = fields.filter((f) => f.column === "left");
  const rightFields = fields.filter((f) => f.column === "right");
  const fullFields = fields.filter((f) => f.column === "full");

  return (
    <form onSubmit={handleSubmit} className={clsx(form(), className?.form)}>
      <div className={clsx(fieldsGrid(), className?.fieldsGrid)}>
        {/* Columna izquierda */}
        <div className="flex flex-col gap-4">
          {leftFields.map((field) => (
            <div key={field.name} className={clsx(fieldWrapper(), className?.fieldWrapper)}>
              <TextField
                name={field.name}
                label={field.label}
                type={field.type || "text"}
                placeholder={field.placeholder}
                required={field.required}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-4">
          {rightFields.map((field) => (
            <div key={field.name} className={clsx(fieldWrapper(), className?.fieldWrapper)}>
              <TextField
                name={field.name}
                label={field.label}
                type={field.type || "text"}
                placeholder={field.placeholder}
                required={field.required}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Campos full width */}
        {fullFields.map((field) => (
          <div
            key={field.name}
            className={clsx(fieldWrapper(), fieldFull(), className?.fieldWrapper)}
          >
            <TextField
              name={field.name}
              label={field.label}
              type={field.type || "text"}
              placeholder={field.placeholder}
              required={field.required}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className={clsx(checkboxWrapper(), className?.checkboxWrapper)}>
        <CheckboxCustom
          name="terms"
          label={checkboxLabel}
          required
          variant="transparent"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
      </div>

      <div className={clsx(buttonWrapper(), className?.buttonWrapper)}>
        <Button type="submit" color="secondary" disabled={!isFormValid} className={{ base: button() }}>
          {buttonText}
        </Button>
      </div>
    </form>
  );
};
