export interface UserProfile {
  id: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: string | null;
  contactNumber: string | null;
}

export interface User {
  userId: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
  contactNumber: string | null;
}
