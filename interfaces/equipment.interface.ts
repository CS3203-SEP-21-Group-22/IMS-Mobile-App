export interface EquipmentDetailed {
  equipmentId: number;
  name: string;
  model: string;
  imageUrl?: string | null;
  labId: number;
  labName: string;
  specification?: string | null;
  maintenanceIntervalDays?: number | null;
  totalCount: number;
  availableCount: number;
  reservedCount: number;
}

export interface Equipment {
  equipmentId: number;
  name: string;
  model: string;
  imageUrl?: string | null;
  labId: number;
  labName: string;
  specification?: string | null;
  maintenanceIntervalDays?: number | null;
}

export interface CreateEquipment {
  name: string | null;
  model: string | null;
  labId: number | null;
  imageURL?: string | null;
  specification?: string | null;
  maintenanceIntervalDays?: number | null;
}

export interface UpdateEquipment {
  name?: string | null;
  model?: string | null;
  imageURL?: string | null;
  specification?: string | null;
  maintenanceIntervalDays?: number | null;
}
