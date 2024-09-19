export interface Lab {
  id: number;
  name: string;
  code: string;
  imageURL?: string | null;
}

export interface CreateLab {
  name: string | null;
  code: string | null;
  imageURL?: string | null;
}
