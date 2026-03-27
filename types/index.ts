export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  profileImage?: string;
  createdAt: string;
  push_notifications_enabled?: boolean;
  email_notifications_enabled?: boolean;
  level?: number;
  xp?: number;
}

export interface Student extends User {
  role: 'student';
  department: string;
  year: number;
  totalPoints: number;
  achievements: Achievement[];
  badges: Badge[];
  level: number;
  xp: number;
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
  type: 'earned' | 'spent';
  date: string;
  eventId?: string;
  rewardId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  proofUrl?: string;
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

export interface Badge {
  id: string;
  name: string;
  type: string;
  icon?: string;
  img_url?: string;
  image_hash?: string;
  date?: string;
  earnedAt?: string;
  alloted_points: number;
  alloted_berries: number;
  scheduled_date: string;
  venue: string;
  capacity: number;
  category: 'academic' | 'cultural' | 'volunteer' | 'attendance' | 'food' | 'merchandise' | 'discount' | 'fee';
  pointsCost: number;
  availability: number;
  image?: string;
  terms?: string;
  description?: string;
  is_registered?: boolean;
  current_participants?: number;
}

export interface Bounty extends Badge { }

export interface Event extends Bounty {
  location?: string;
  points?: number;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  createdBy?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  category?: string;
  pointsCost: number;
  availability?: number;
  image?: string;
}

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent';
  reason: string;
  date: string;
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