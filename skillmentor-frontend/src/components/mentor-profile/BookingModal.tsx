import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Clock } from "lucide-react";
import type { MentorInfo, SubjectWithEnrollment } from "@/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorInfo: MentorInfo;
  subjects: SubjectWithEnrollment[];
  preSelectedSubject?: SubjectWithEnrollment | null;
}

const ALL_TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
];

const DURATION_OPTIONS = [
  { label: "30 minutes", value: 30 },
  { label: "60 minutes", value: 60 },
  { label: "90 minutes", value: 90 },
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function BookingModal({
  isOpen,
  onClose,
  mentorInfo,
  subjects,
  preSelectedSubject,
}: BookingModalProps) {
  const navigate = useNavigate();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [duration, setDuration] = useState<string>("60");

  // Reset all state when the modal opens so each booking starts fresh
  useEffect(() => {
    if (!isOpen) return;
    setDate(undefined);
    setSelectedTime(undefined);
    setDuration("60");
    setSelectedSubjectId(preSelectedSubject ? String(preSelectedSubject.subjectId) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Filter time slots to exclude past hours when the selected date is today
  const availableTimeSlots = useMemo(() => {
    if (!date || !isSameDay(date, new Date())) return ALL_TIME_SLOTS;
    const currentHour = new Date().getHours();
    return ALL_TIME_SLOTS.filter((t) => Number.parseInt(t.split(":")[0]) > currentHour);
  }, [date]);

  // Clear selected time if the date changes and the chosen time is no longer available
  useEffect(() => {
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime(undefined);
    }
  }, [availableTimeSlots, selectedTime]);

  const selectedSubject =
    subjects.find((s) => String(s.subjectId) === selectedSubjectId) ?? null;
  const canBook = !!selectedSubjectId && !!date && !!selectedTime;

  const handleBook = () => {
    if (!canBook) return;
    const sessionDateTime = new Date(date!);
    const [hours, minutes] = selectedTime!.split(":");
    sessionDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0);

    const params = new URLSearchParams({
      date: sessionDateTime.toISOString(),
      courseTitle: selectedSubject?.subjectName ?? "",
      mentorName: mentorInfo.name,
      mentorId: mentorInfo.mentorId,
      mentorImg: mentorInfo.profileImage ?? "",
      subjectId: selectedSubjectId,
      durationMinutes: duration,
    });

    navigate(`/payment/${mentorInfo.id}-${Date.now()}?${params.toString()}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a session</DialogTitle>
          <DialogDescription>
            Choose a subject, date, and time for your mentoring session.
          </DialogDescription>
        </DialogHeader>

        {/* Pre-fill info banner — mentor + selected subject */}
        <div className="rounded-lg border bg-muted/30 p-4 flex gap-4">
          {/* Mentor info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {mentorInfo.profileImage ? (
              <img
                src={mentorInfo.profileImage}
                alt={mentorInfo.name}
                className="size-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="size-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white shrink-0">
                {mentorInfo.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Mentor</p>
              <p className="font-medium text-sm truncate">{mentorInfo.name}</p>
            </div>
          </div>

          {/* Subject info — shown only when a subject is selected */}
          {selectedSubject && (
            <>
              <div className="w-px bg-border shrink-0" />
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {selectedSubject.thumbnail ? (
                  <img
                    src={selectedSubject.thumbnail}
                    alt={selectedSubject.subjectName}
                    className="size-10 rounded object-cover shrink-0"
                  />
                ) : (
                  <div className="size-10 rounded bg-muted flex items-center justify-center shrink-0">
                    <BookOpen className="size-5 text-muted-foreground/60" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Subject</p>
                  <p className="font-medium text-sm truncate">
                    {selectedSubject.subjectName}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Subject selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s.subjectId} value={String(s.subjectId)}>
                  {s.subjectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Duration</label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date picker + time slot grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div>
            <p className="text-sm font-medium mb-2">Choose a date</p>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={{ before: new Date() }}
              className="rounded-md border"
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Choose a time</p>

            {!date ? (
              <div className="flex flex-col items-center justify-center h-32 border border-dashed rounded-md text-muted-foreground text-sm text-center px-4 gap-2">
                <Clock className="size-5 opacity-40" />
                Select a date first
              </div>
            ) : availableTimeSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 border border-dashed rounded-md text-muted-foreground text-sm text-center px-4 gap-1">
                <Clock className="size-5 opacity-40" />
                <p>No available slots for today.</p>
                <p className="text-xs">Please select a future date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {availableTimeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBook} disabled={!canBook}>
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
