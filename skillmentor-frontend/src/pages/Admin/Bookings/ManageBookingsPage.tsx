import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, ArrowUpDown, Link2, BadgeCheck, CircleCheckBig } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

import {
  completeAdminSession,
  confirmAdminSessionPayment,
  getAdminSessions,
  updateAdminSessionMeetingLink,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { AdminSession } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortKey =
  | "sessionAt"
  | "durationMinutes"
  | "student.firstName"
  | "mentor.firstName"
  | "subject.name";

const PAGE_SIZE = 10;

const paymentFilterOptions = [
  { label: "All payments", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const sessionFilterOptions = [
  { label: "All sessions", value: "all" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function getPaymentBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case "accepted":
    case "completed":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "cancelled":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

function getSessionBadgeVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "success" as const;
    case "IN_PROGRESS":
      return "warning" as const;
    case "CANCELLED":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

export default function ManageBookingsPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<AdminSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [sessionStatus, setSessionStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState("sessionAt,desc");
  const [selectedBooking, setSelectedBooking] = useState<AdminSession | null>(null);
  const [meetingLinkDraft, setMeetingLinkDraft] = useState("");
  const [activeDialog, setActiveDialog] = useState<"payment" | "complete" | "meeting-link" | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        const token = await getToken({ template: "skillmentor-auth" });

        if (!token) {
          throw new Error("You must be signed in to manage bookings.");
        }

        const response = await getAdminSessions(token, {
          page,
          size: PAGE_SIZE,
          search: search || undefined,
          paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
          sessionStatus: sessionStatus === "all" ? undefined : sessionStatus,
          sort,
        });

        setBookings(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        toast({
          title: "Failed to load bookings",
          description:
            error instanceof Error ? error.message : "Unable to fetch admin bookings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [getToken, page, paymentStatus, search, sessionStatus, sort, toast]);

  const summary = useMemo(() => {
    if (totalElements === 0) {
      return "No bookings found";
    }

    const start = page * PAGE_SIZE + 1;
    const end = Math.min((page + 1) * PAGE_SIZE, totalElements);
    return `Showing ${start}-${end} of ${totalElements} bookings`;
  }, [page, totalElements]);

  const openDialog = (type: "payment" | "complete" | "meeting-link", booking: AdminSession) => {
    setSelectedBooking(booking);
    setMeetingLinkDraft(booking.meetingLink ?? "");
    setActiveDialog(type);
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setSelectedBooking(null);
    setMeetingLinkDraft("");
  };

  const updateBooking = (updatedBooking: AdminSession) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.sessionId === updatedBooking.sessionId ? updatedBooking : booking,
      ),
    );
  };

  const withToken = async () => {
    const token = await getToken({ template: "skillmentor-auth" });
    if (!token) {
      throw new Error("You must be signed in to perform this action.");
    }
    return token;
  };

  const handleConfirmPayment = async () => {
    if (!selectedBooking) {
      return;
    }

    try {
      setIsActionLoading(true);
      const updated = await confirmAdminSessionPayment(
        await withToken(),
        selectedBooking.sessionId,
      );
      updateBooking(updated);
      toast({
        title: "Payment confirmed",
        description: `Session ${updated.sessionId} payment status updated.`,
      });
      closeDialog();
    } catch (error) {
      toast({
        title: "Failed to confirm payment",
        description:
          error instanceof Error ? error.message : "Unable to update payment status.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!selectedBooking) {
      return;
    }

    try {
      setIsActionLoading(true);
      const updated = await completeAdminSession(await withToken(), selectedBooking.sessionId);
      updateBooking(updated);
      toast({
        title: "Session completed",
        description: `Session ${updated.sessionId} marked as completed.`,
      });
      closeDialog();
    } catch (error) {
      toast({
        title: "Failed to complete session",
        description:
          error instanceof Error ? error.message : "Unable to complete the session.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleUpdateMeetingLink = async () => {
    if (!selectedBooking) {
      return;
    }

    try {
      setIsActionLoading(true);
      const updated = await updateAdminSessionMeetingLink(
        await withToken(),
        selectedBooking.sessionId,
        meetingLinkDraft.trim(),
      );
      updateBooking(updated);
      toast({
        title: "Meeting link saved",
        description: `Session ${updated.sessionId} meeting link updated.`,
      });
      closeDialog();
    } catch (error) {
      toast({
        title: "Failed to update meeting link",
        description:
          error instanceof Error ? error.message : "Unable to save the meeting link.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleSort = (key: SortKey) => {
    setPage(0);
    setSort((current) => {
      const [currentKey, currentDirection] = current.split(",");
      if (currentKey === key) {
        return `${key},${currentDirection === "asc" ? "desc" : "asc"}`;
      }
      return `${key},asc`;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manage Bookings</h2>
        <p className="text-muted-foreground">
          Monitor and manage all platform bookings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings Data Table</CardTitle>
          <CardDescription>
            Search, filter, sort, and update booking records from one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_220px_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by session, student, mentor, or subject"
                className="pl-9"
              />
            </div>
            <Select
              value={paymentStatus}
              onValueChange={(value) => {
                setPaymentStatus(value);
                setPage(0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter payment status" />
              </SelectTrigger>
              <SelectContent>
                {paymentFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sessionStatus}
              onValueChange={(value) => {
                setSessionStatus(value);
                setPage(0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter session status" />
              </SelectTrigger>
              <SelectContent>
                {sessionFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("student.firstName")}
                      className="inline-flex items-center gap-1"
                    >
                      Student Name
                      <ArrowUpDown className="size-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("mentor.firstName")}
                      className="inline-flex items-center gap-1"
                    >
                      Mentor
                      <ArrowUpDown className="size-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("subject.name")}
                      className="inline-flex items-center gap-1"
                    >
                      Subject
                      <ArrowUpDown className="size-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("sessionAt")}
                      className="inline-flex items-center gap-1"
                    >
                      Date
                      <ArrowUpDown className="size-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      type="button"
                      onClick={() => toggleSort("durationMinutes")}
                      className="inline-flex items-center gap-1"
                    >
                      Duration
                      <ArrowUpDown className="size-4" />
                    </button>
                  </TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Session Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-28 text-center text-muted-foreground">
                      Loading bookings...
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-28 text-center text-muted-foreground">
                      No bookings match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.sessionId}>
                      <TableCell className="font-medium">#{booking.sessionId}</TableCell>
                      <TableCell>{booking.studentName}</TableCell>
                      <TableCell>{booking.mentorName}</TableCell>
                      <TableCell>{booking.subjectName}</TableCell>
                      <TableCell>{format(new Date(booking.date), "PPp")}</TableCell>
                      <TableCell>{booking.duration} min</TableCell>
                      <TableCell>
                        <Badge variant={getPaymentBadgeVariant(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSessionBadgeVariant(booking.sessionStatus)}>
                          {booking.sessionStatus.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog("payment", booking)}
                          >
                            <BadgeCheck className="mr-1 size-4" />
                            Confirm Payment
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog("complete", booking)}
                          >
                            <CircleCheckBig className="mr-1 size-4" />
                            Mark Complete
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog("meeting-link", booking)}
                          >
                            <Link2 className="mr-1 size-4" />
                            Add Meeting Link
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">{summary}</p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPage((current) => Math.max(current - 1, 0))}
                disabled={page === 0 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPage((current) => current + 1)}
                disabled={isLoading || totalPages === 0 || page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={activeDialog === "payment"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Mark session #{selectedBooking?.sessionId} payment as accepted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmPayment} disabled={isActionLoading}>
              {isActionLoading ? "Saving..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "complete"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Session Complete</DialogTitle>
            <DialogDescription>
              Update session #{selectedBooking?.sessionId} to completed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCompleteSession} disabled={isActionLoading}>
              {isActionLoading ? "Saving..." : "Mark Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "meeting-link"} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Meeting Link</DialogTitle>
            <DialogDescription>
              Save or replace the meeting link for session #{selectedBooking?.sessionId}.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={meetingLinkDraft}
            onChange={(event) => setMeetingLinkDraft(event.target.value)}
            placeholder="https://meet.google.com/..."
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateMeetingLink}
              disabled={isActionLoading || meetingLinkDraft.trim().length === 0}
            >
              {isActionLoading ? "Saving..." : "Save Meeting Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
