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

export interface MaintenanceCreate {
  itemId: number | null;
  startDate: string | null;
  endDate: string | null;
  technicianId: number | null;
  taskDescription: string | null;
}

export interface PendingMaintenance {
  itemId: number;
  itemName: string;
  itemModel: string;
  imageUrl?: string | null;
  itemSerialNumber: string;
  labId: number;
  labName: string;
  lastMaintenanceId: number;
  lastMaintenanceStartDate: string;
  lastMaintenanceEndDate: string;
}
