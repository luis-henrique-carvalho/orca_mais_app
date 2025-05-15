export interface User {
  id: string;
  avatar?: {
    id: string | null;
    attachment_id: string | null;
    content_type: string | null;
    url: string | null;
  };
  cpf?: string;
  email: string;
  full_name: string;
}
