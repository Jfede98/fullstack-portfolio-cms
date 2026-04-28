export interface IContactFormField {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  required?: boolean;
  column?: "left" | "right" | "full";
}

export interface IContactFormProps {
  fields: IContactFormField[];
  checkboxLabel: string;
  buttonText: string;
  onSubmit?: (data: Record<string, string>) => void;
  className?: {
    form?: string;
    fieldsGrid?: string;
    fieldWrapper?: string;
    checkboxWrapper?: string;
    buttonWrapper?: string;
  };
}
