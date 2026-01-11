
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  ABA_PAY = 'ABA PAY',
  STRIPE = 'STRIPE',
  CREDIT_CARD = 'CREDIT CARD',
  PAY_LATER = 'PAY AT COUNTER'
}

export enum RecurrencePattern {
  NONE = 'NONE',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY'
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  timezone: string;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  timezone: string;
  createdAt: string;
  assignedLocationId?: string; // For Staff tied to a branch
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  depositAmount: number;
  bufferMinutes: number;
  maxCapacity: number;
  isActive: boolean;
  category: string;
  imageUrl?: string;
  allowedRecurrence: RecurrencePattern[];
  locationIds: string[]; // Services available at these locations
}

export interface Staff {
  id: string;
  userId: string;
  fullName: string;
  specialties: string[];
  assignedServices: string[]; // Service IDs
  locationIds: string[]; // Locations where this staff works
}

export interface Booking {
  id: string;
  locationId: string; // The branch for this booking
  serviceId: string;
  staffId: string;
  customerId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  totalPrice: number;
  paidAmount: number;
  notes?: string;
  recurrencePattern: RecurrencePattern;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
}

export interface AvailabilityRule {
  id: string;
  staffId: string;
  locationId: string; // Staff might have different hours at different locations
  dayOfWeek: number; // 0-6
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
}

export interface Review {
  id: string;
  bookingId: string;
  serviceId: string;
  rating: number;
  comment: string;
  createdAt: string;
}