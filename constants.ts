
import { UserRole, Service, Staff, User, BookingStatus, PaymentStatus, Review, RecurrencePattern, Location } from './types';

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'l1',
    name: 'Downtown HQ',
    address: '123 Elite Plaza, Financial District',
    city: 'Metropolis',
    phone: '+1 (555) 001-1000',
    timezone: 'UTC',
    isActive: true
  },
  {
    id: 'l2',
    name: 'Uptown Wellness Center',
    address: '789 Serenity Blvd, Northside',
    city: 'Metropolis',
    phone: '+1 (555) 002-2000',
    timezone: 'UTC',
    isActive: true
  },
  {
    id: 'l3',
    name: 'Westside Annex',
    address: '456 Commerce St, Industrial Park',
    city: 'Metropolis',
    phone: '+1 (555) 003-3000',
    timezone: 'UTC',
    isActive: true
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'admin@chronobook.com', role: UserRole.ADMIN, fullName: 'Super Admin', timezone: 'UTC', createdAt: new Date().toISOString() },
  { id: 'u2', email: 'jane.doe@staff.com', role: UserRole.STAFF, fullName: 'Jane Doe', phone: '+123456789', timezone: 'UTC', createdAt: new Date().toISOString(), assignedLocationId: 'l1' },
  { id: 'u3', email: 'john.smith@customer.com', role: UserRole.CUSTOMER, fullName: 'John Smith', phone: '+987654321', timezone: 'UTC', createdAt: new Date().toISOString() },
];

export const MOCK_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Executive Health Checkup',
    description: 'Comprehensive physical examination with diagnostic tests.',
    durationMinutes: 60,
    price: 150,
    depositAmount: 50,
    bufferMinutes: 15,
    maxCapacity: 1,
    isActive: true,
    category: 'Medical',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    allowedRecurrence: [RecurrencePattern.NONE],
    locationIds: ['l1', 'l2']
  },
  {
    id: 's2',
    name: 'Teeth Whitening',
    description: 'Professional grade whitening session for a brighter smile.',
    durationMinutes: 45,
    price: 200,
    depositAmount: 100,
    bufferMinutes: 10,
    maxCapacity: 1,
    isActive: true,
    category: 'Dental',
    imageUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
    allowedRecurrence: [RecurrencePattern.NONE, RecurrencePattern.MONTHLY],
    locationIds: ['l1', 'l3']
  },
  {
    id: 's3',
    name: 'Full Body Massage',
    description: 'Relaxing 90-minute aromatherapy massage.',
    durationMinutes: 90,
    price: 120,
    depositAmount: 30,
    bufferMinutes: 20,
    maxCapacity: 1,
    isActive: true,
    category: 'Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ae6ce6db874?auto=format&fit=crop&q=80&w=800',
    allowedRecurrence: [RecurrencePattern.NONE, RecurrencePattern.WEEKLY, RecurrencePattern.BIWEEKLY],
    locationIds: ['l2']
  }
];

export const MOCK_STAFF: Staff[] = [
  {
    id: 'st1',
    userId: 'u2',
    fullName: 'Jane Doe',
    specialties: ['Diagnostics', 'General Health'],
    assignedServices: ['s1', 's3'],
    locationIds: ['l1', 'l2']
  }
];

export const INITIAL_BOOKINGS: any[] = [
  {
    id: 'b1',
    locationId: 'l1',
    serviceId: 's1',
    staffId: 'st1',
    customerId: 'u3',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 60 * 60000).toISOString(),
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    totalPrice: 150,
    paidAmount: 150,
    recurrencePattern: RecurrencePattern.NONE,
    createdAt: new Date().toISOString()
  },
  {
    id: 'b2',
    locationId: 'l2',
    serviceId: 's3',
    staffId: 'st1',
    customerId: 'u3',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 86400000 + 90 * 60000).toISOString(),
    status: BookingStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    totalPrice: 120,
    paidAmount: 120,
    recurrencePattern: RecurrencePattern.WEEKLY,
    createdAt: new Date(Date.now() - 90000000).toISOString()
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    bookingId: 'b2',
    serviceId: 's3',
    rating: 5,
    comment: 'Jane was absolutely amazing! Best massage I have ever had.',
    createdAt: new Date(Date.now() - 80000000).toISOString()
  }
];