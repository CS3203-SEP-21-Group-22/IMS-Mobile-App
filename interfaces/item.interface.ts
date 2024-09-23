export interface Item {
  itemId: number;
  imageUrl?: string | null;
  equipmentId: number;
  serialNumber: string;
  status: string;
}

export interface ItemDetailed {
  itemId: number;
  itemName: string;
  itemModel: string;
  imageUrl?: string | null;
  equipmentId: number;
  labId: number;
  labName: string;
  serialNumber: string;
  lastMaintenanceOn?: string | null;
  lastMaintenanceBy?: string | null;
  status: string;
}

export interface CreateItem {
  equipmentId: number;
  serialNumber?: string | null;
}
