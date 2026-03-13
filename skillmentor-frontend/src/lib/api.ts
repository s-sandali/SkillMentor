import type {
  CreateMentorRequest,
  CreateSubjectRequest,
  Enrollment,
  Mentor,
  MentorResponse,
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
    mentorId: number;
    subjectId: number;
    sessionAt: string;
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

export async function createSubject(
  token: string,
  data: {
    subjectName: string;
    description: string;
    mentorId: number;
    courseImageUrl?: string;
  },
): Promise<Subject> {
  const res = await fetchWithAuth("/api/v1/subjects", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
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

