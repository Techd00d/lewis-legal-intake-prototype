export type FormAudience = "prospect" | "client" | "staff";

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "number"
  | "currency"
  | "select"
  | "yesno"
  | "textarea"
  | "checkboxes"
  | "acknowledgment"
  | "notice"
  | "table"
  | "matrix"
  | "upload";

export interface FieldCondition {
  fieldId: string;
  equals?: string | boolean;
  includes?: string;
}

export interface IntakeField {
  id: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  columns?: string[];
  rows?: string[];
  initialRows?: number;
  fullWidth?: boolean;
  sensitive?: boolean;
  deferred?: boolean;
  source?: string;
  mycaseTarget?: string;
  condition?: FieldCondition;
}

export interface IntakeSection {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  fields: IntakeField[];
}

export interface IntakeFormDefinition {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  audience: FormAudience;
  stage: string;
  estimatedMinutes: string;
  sourceDocuments: string[];
  accent: "teal" | "blue" | "gold" | "plum" | "slate";
  safeguards: string[];
  sections: IntakeSection[];
}

export type FieldValue = string | boolean | string[];
export type IntakeValues = Record<string, FieldValue>;
