export interface User {
  id?: number;
  email: string;
  auth_subject: string;
  first_name: string;
  last_name: string;
  display_name: string;
  title: string;
  department: string;
  division: string;
  branch: string;
  unit: string;
  is_active: boolean | string;
  roles?: string;
}
