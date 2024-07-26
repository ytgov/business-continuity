export interface Documentation {
  id?: number;
  department_id: number;
  name: string;
  description?: string;
  is_active: boolean;
  text_value?: string;
  file_value?: Buffer;
  file_name?: string;
  file_type?: string;
}
