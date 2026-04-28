import { mapLeadForm } from "./leadForm";

export const mapContactFormBlock = (data: any) => {
  return {
    title: data.title,
    description: data.description,
    leadForm: data.leadForm ? mapLeadForm(data.leadForm) : undefined
  };
};
