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
