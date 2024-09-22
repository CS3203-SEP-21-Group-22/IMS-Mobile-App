export interface Lab {
  labId: number;
  labName: string;
  labCode: string;
  imageURL?: string | null;
}

export interface CreateLab {
  labName: string | null;
  labCode: string | null;
  imageURL?: string | null;
}

export interface UpdateLab {
  labName?: string | null;
  labCode?: string | null;
  imageURL?: string | null;
}
