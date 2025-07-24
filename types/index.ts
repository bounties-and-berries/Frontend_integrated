export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  profileImage?: string;
  createdAt: string;
}

export interface Student extends User {
  role: 'student';
  department: string;
  year: number;
  totalPoints: number;
  achievements: Achievement[];
  badges: Badge[];
}

export interface Faculty extends User {
  role: 'faculty';
  department: string;
  subject: string;
  qrCode: string;
}

export interface Admin extends User {
  role: 'admin';
  collegeName: string;
  permissions: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'academic' | 'cultural' | 'volunteer' | 'attendance';
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  proofUrl?: string;
  approvedBy?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'cultural' | 'volunteer' | 'sports';
  date: string;
  location: string;
  points: number;
  registrationDeadline: string;
  maxParticipants: number;
  currentParticipants: number;
  createdBy: string;
  image?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: 'food' | 'merchandise' | 'discount' | 'fee';
  pointsCost: number;
  availability: number;
  image?: string;
  terms?: string;
}

export interface PointTransaction {
  id: string;
  studentId: string;
  points: number;
  type: 'earned' | 'spent';
  description: string;
  date: string;
  category?: string;
  eventId?: string;
  rewardId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: string;
  actionUrl?: string;
}

export interface PublicProfile {
  studentId: string;
  name: string;
  department: string;
  year: number;
  totalPoints: number;
  achievements: Achievement[];
  badges: Badge[];
  rank: number;
}