export interface Reservation {
  reservationId: number;
  equipmentId: number;
  itemName: string;
  itemModel: string;
  imageUrl?: string | null;
  itemId?: number | null;
  itemSerialNumber?: string | null;
  labId: number;
  labName: string;
  startDate: string;
  endDate: string;
  reservedUserId: number;
  reservedUserName: string;
  createdAt: string;
  respondedAt?: string | null;
  borrowedAt?: string | null;
  returnedAt?: string | null;
  cancelledAt?: string | null;
  status: string;
}

export interface ReservationDetailed {
  reservationId: number;
  equipmentId: number;
  itemName: string;
  itemModel: string;
  imageUrl?: string | null;
  itemId?: number | null;
  itemSerialNumber?: string | null;
  labId: number;
  labName: string;
  startDate: string;
  endDate: string;
  reservedUserId: number;
  reservedUserName: string;
  createdAt: string;
  respondedClerkId?: number | null;
  respondedClerkName?: string | null;
  responseNote?: string | null;
  respondedAt?: string | null;
  lentClerkId?: number | null;
  lentClerkName?: string | null;
  borrowedAt?: string | null;
  returnAcceptedClerkId?: number | null;
  returnAcceptedClerkName?: string | null;
  returnedAt?: string | null;
  cancelledAt?: string | null;
  status: string;
}
