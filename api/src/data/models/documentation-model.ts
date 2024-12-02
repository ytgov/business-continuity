export interface Documentation {
  id?: number;
  department_id: number;
  name: string;
  description?: string;
  security_level: DocumentationSecurityLevel;
  is_active: boolean;
  text_value?: string;
  file_value?: Buffer;
  file_name?: string;
  file_type?: string;
}

export enum DocumentationSecurityLevel {
  PUBLIC = "Public",
  YG_LIKELY = "Not authenticated YG Staff",
  YG_LOGIN = "Authenticated YG Staff",
  YG_RESTRICTED = "Authenticated YG Restricted",
}
