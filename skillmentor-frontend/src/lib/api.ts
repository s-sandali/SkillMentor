import type {
  AdminSession,
  CreateMentorRequest,
  CreateSubjectRequest,
  DashboardResponse,
  Enrollment,
  Mentor,
  MentorProfile,
  MentorResponse,
  MentorReviewsResponse,
  Subject,
  SubjectResponse,
} from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

async function fetchWithAuth(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res;
}

// Public route without auth
export async function getPublicMentors(
  page = 0,
  size = 10,
): Promise<{ content: Mentor[]; totalElements: number; totalPages: number }> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/mentors?page=${page}&size=${size}`,
  );
  if (!res.ok) throw new Error("Failed to fetch mentors");
  return res.json();
}

export async function getMentors(
  token: string,
  page = 0,
  size = 100,
): Promise<{ content: Mentor[]; totalElements: number; totalPages: number }> {
  const res = await fetchWithAuth(`/api/v1/mentors?page=${page}&size=${size}`, token);
  return res.json();
}

export async function deleteMentor(token: string, id: number): Promise<void> {
  await fetchWithAuth(`/api/v1/mentors/${id}`, token, { method: "DELETE" });
}

export async function createAdminMentor(
  token: string,
  data: CreateMentorRequest,
): Promise<MentorResponse> {
  const res = await fetchWithAuth("/api/v1/admin/mentors", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

// Enrollments
export async function enrollInSession(
  token: string,
  data: {
    mentorId: string;
    subjectId: number;
    sessionDateTime: string;
    durationMinutes?: number;
  },
): Promise<Enrollment> {
  const res = await fetchWithAuth("/api/v1/sessions/enroll", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMyEnrollments(token: string): Promise<Enrollment[]> {
  const res = await fetchWithAuth("/api/v1/sessions/my-sessions", token);
  const data = await res.json();
  // Backend returns paginated response: { content: [...], ... }
  return data.content || [];
}

export async function getAdminSessions(
  token: string,
  params: {
    page?: number;
    size?: number;
    search?: string;
    paymentStatus?: string;
    sessionStatus?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  } = {},
): Promise<{ content: AdminSession[]; totalElements: number; totalPages: number; number: number }> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 0));
  searchParams.set("size", String(params.size ?? 10));

  if (params.search) searchParams.set("search", params.search);
  if (params.paymentStatus) searchParams.set("paymentStatus", params.paymentStatus);
  if (params.sessionStatus) searchParams.set("sessionStatus", params.sessionStatus);
  if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) searchParams.set("dateTo", params.dateTo);
  if (params.sort) searchParams.set("sort", params.sort);

  const res = await fetchWithAuth(`/api/v1/admin/sessions?${searchParams.toString()}`, token);
  return res.json();
}

export async function confirmAdminSessionPayment(
  token: string,
  sessionId: number,
): Promise<AdminSession> {
  const res = await fetchWithAuth(`/api/v1/admin/sessions/${sessionId}/confirm-payment`, token, {
    method: "PATCH",
  });
  return res.json();
}

export async function completeAdminSession(
  token: string,
  sessionId: number,
): Promise<AdminSession> {
  const res = await fetchWithAuth(`/api/v1/admin/sessions/${sessionId}/complete`, token, {
    method: "PATCH",
  });
  return res.json();
}

export async function updateAdminSessionMeetingLink(
  token: string,
  sessionId: number,
  meetingLink: string,
): Promise<AdminSession> {
  const res = await fetchWithAuth(`/api/v1/admin/sessions/${sessionId}/meeting-link`, token, {
    method: "PATCH",
    body: JSON.stringify({ meetingLink }),
  });
  return res.json();
}

// --------------------------------
// Admin Subject Management API
// --------------------------------

export async function getAdminSubjects(
  token: string,
  page = 0,
  size = 10,
): Promise<{ content: Subject[]; totalElements: number; totalPages: number }> {
  const res = await fetchWithAuth(`/api/v1/subjects?page=${page}&size=${size}`, token);
  return res.json();
}

export async function createAdminSubject(
  token: string,
  data: CreateSubjectRequest,
): Promise<SubjectResponse> {
  const res = await fetchWithAuth("/api/v1/admin/subjects", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateSubject(
  token: string,
  id: number,
  data: {
    subjectName: string;
    description: string;
    mentorId: number;
    courseImageUrl?: string;
  },
): Promise<Subject> {
  const res = await fetchWithAuth(`/api/v1/subjects/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteSubject(token: string, id: number): Promise<void> {
  await fetchWithAuth(`/api/v1/subjects/${id}`, token, {
    method: "DELETE",
  });
}

// --------------------------------
// Mentor Profile (public)
// --------------------------------

export async function getMentorProfile(mentorId: number): Promise<MentorProfile> {
  const res = await fetch(`${API_BASE_URL}/api/v1/mentors/${mentorId}/profile`);
  if (!res.ok) throw new Error("Failed to fetch mentor profile");
  return res.json();
}

export async function getMentorReviews(mentorId: number): Promise<MentorReviewsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/mentors/${mentorId}/reviews`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

// --------------------------------
// Reviews
// --------------------------------

export async function submitReview(
  token: string,
  data: { sessionId: number; rating: number; reviewText?: string },
): Promise<void> {
  await fetchWithAuth("/api/v1/reviews", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --------------------------------
// Admin Dashboard API
// --------------------------------

export async function getAdminDashboard(token: string): Promise<DashboardResponse> {
  const res = await fetchWithAuth("/api/v1/admin/dashboard", token);
  return res.json();
}
