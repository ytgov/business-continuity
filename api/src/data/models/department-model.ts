import { Documentation } from "./documentation-model";

export interface Department {
  id?: number;
  name: string;
  is_active: boolean;

  documents?: Documentation[];
}
