// Modified to match with backend SubjectResponseDTO
export interface Subject {
  id: number;
  name?: string;
  subjectName?: string;
  description: string;
  courseImageUrl: string;
}

export interface CreateSubjectRequest {
  name: string;
  description: string;
  courseImageUrl?: string;
  mentorId: number;
}

export interface SubjectResponse {
  id: number;
  name: string;
  description: string;
  courseImageUrl?: string;
  mentorId: number;
  mentorName: string;
}

export interface CreateMentorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  title?: string;
  profession: string;
  company: string;
  experienceYears: number;
  bio: string;
  profileImageUrl?: string;
  isCertified: boolean;
  startYear: string;
}

export interface MentorResponse {
  id: number;
  mentorId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  title?: string;
  profession?: string;
  company?: string;
  experienceYears: number;
  bio: string;
  profileImageUrl?: string;
  isCertified: boolean;
  startYear: string;
  positiveReviews: number;
  totalEnrollments: number;
}

export interface AdminSession {
  sessionId: number;
  studentName: string;
  mentorName: string;
  subjectName: string;
  date: string;
  duration: number;
  paymentStatus: string;
  sessionStatus: string;
  meetingLink?: string | null;
}

// Modified to match with backend MentorResponseDTO (from GET /api/v1/mentors)
export interface Mentor {
  id: number;
  mentorId: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  profession: string;
  company: string;
  experienceYears: number;
  bio: string;
  profileImageUrl: string;
  positiveReviews: number;
  totalEnrollments: number;
  isCertified: boolean;
  startYear: string;
  subjects: Subject[];
}

// Modified to match with SessionResponseDTO (from GET /api/v1/sessions/my-sessions)
export interface Enrollment {
  id: number;
  mentorName: string;
  mentorProfileImageUrl: string;
  subjectName: string;
  sessionAt: string;
  durationMinutes: number;
  sessionStatus: string;
  paymentStatus: "pending" | "accepted" | "completed" | "cancelled";
  meetingLink: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Activity {
  type: "booking" | "payment" | "mentor" | "subject";
  message: string;
  timestamp: string;
}

export interface DashboardResponse {
  totalSubjects: number;
  totalMentors: number;
  totalBookings: number;
  recentActivities: Activity[];
}

// --- Mentor Profile (GET /api/v1/mentors/:id/profile) ---

export interface MentorInfo {
  id: number;
  mentorId: string;
  name: string;
  title?: string;
  profession?: string;
  company?: string;
  profileImage?: string;
  bio?: string;
  startYear?: string;
  isCertified?: boolean;
}

export interface MentorStats {
  totalStudents: number;
  yearsExperience: number;
  subjectsCount: number;
  averageRating: number;
  positiveReviewPercentage: number;
}

export interface SubjectWithEnrollment {
  subjectId: number;
  subjectName: string;
  subjectDescription?: string;
  thumbnail?: string;
  enrollmentCount: number;
}

export interface MentorReview {
  reviewId: number;
  studentName: string;
  rating: number;
  reviewText?: string;
  reviewDate: string;
}

export interface MentorProfile {
  mentorInfo: MentorInfo;
  mentorStats: MentorStats;
  subjects: SubjectWithEnrollment[];
  reviews: MentorReview[];
}

// --- Reviews (GET /api/v1/mentors/:id/reviews) ---

export interface MentorReviewsResponse {
  reviews: MentorReview[];
  averageRating: number;
  totalReviews: number;
}
