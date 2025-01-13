export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface EventType {
  _id: string;
  name: string;
  description?: string;
  date: Date;
  location: string;
  capacity: number;
  organiser: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrationType {
  _id: string;
  user: UserType;
  event: EventType;
  status: "registered" | "cancelled";
  registeredAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
