export interface Maintenance {
  maintenanceId: number;
  itemId: number;
  itemName: string;
  itemModel: string;
  imageUrl?: string | null;
  itemSerialNumber: string;
  labId: number;
  labName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  status: string;
}

export interface MaintenanceDetailed {
  maintenanceId: number;
  itemId: number;
  itemName: string;
  itemModel: string;
  imageUrl?: string | null;
  itemSerialNumber: string;
  labId: number;
  labName: string;
  startDate: string;
  endDate: string;
  createdClerkId: number;
  createdClerkName: string;
  taskDescription: string;
  createdAt: string;
  technicianId: number;
  technicianName: string;
  submitNote?: string | null;
  submittedAt?: string | null;
  reviewedClerkId?: number | null;
  reviewedClerkName?: string | null;
  reviewNote?: string | null;
  reviewedAt?: string | null;
  cost?: number | null;
  status: string;
}
