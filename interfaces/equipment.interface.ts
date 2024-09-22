export interface Equipment {
  equipmentId: number;
  name: string;
  model: string;
  lab: string;
  imageURL?: string | null;
  labId: number;
  labName: string;
  specification?: string | null;
  maintenanceIntervalDays?: number | null;
  totalCount: number;
  availableCount: number;
  reservedCount: number;
}

export interface CreateEquipment {
  name: string | null;
  model: string | null;
  lab: string | null;
  imageURL?: string | null;
}
