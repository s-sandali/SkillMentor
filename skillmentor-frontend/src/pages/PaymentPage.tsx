import { useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";
import { enrollInSession } from "@/lib/api";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sessionId } = useParams();
  const { toast } = useToast();
  const { getToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorModal, setErrorModal] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const date = searchParams.get("date");
  const courseTitle = searchParams.get("courseTitle");
  const mentorId = searchParams.get("mentorId");
  const mentorName = searchParams.get("mentorName");
  const subjectId = searchParams.get("subjectId");
  const durationMinutes = searchParams.get("durationMinutes");
  const sessionDate = date ? new Date(date).toLocaleDateString() : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!file || !date || !mentorId || !subjectId || !sessionId) return;

    setIsUploading(true);

    try {
      const token = await getToken({ template: "skillmentor-auth" });
      if (!token) throw new Error("Not authenticated");

      await enrollInSession(token, {
        mentorId: mentorId,
        subjectId: Number(subjectId),
        sessionDateTime: date,
        durationMinutes: durationMinutes ? Number(durationMinutes) : 60,
      });

      toast({
        title: "Payment Confirmed",
        description:
          "Your bank slip has been uploaded and verified. Session scheduled successfully.",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "There was a problem scheduling your session. Please try again.";
      setErrorModal({ open: true, message });
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="container max-w-md py-10">
        <Card>
          <CardHeader>
            <CardTitle>Upload Bank Transfer Slip</CardTitle>
          </CardHeader>
          <form onSubmit={handleUpload}>
            <CardContent className="space-y-4">
              {mentorName && (
                <div className="text-sm font-medium">
                  Session with: {mentorName}
                </div>
              )}
              {courseTitle && (
                <div className="text-sm text-muted-foreground">{courseTitle}</div>
              )}
              {sessionDate && (
                <div className="text-sm">
                  <strong>Session Date:</strong> {sessionDate}
                </div>
              )}
              {durationMinutes && (
                <div className="text-sm">
                  <strong>Duration:</strong> {durationMinutes} minutes
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="slip">Bank Transfer Slip</Label>
                <Input
                  id="slip"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Please upload a clear image of your bank transfer slip to confirm
                your payment.
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!file || isUploading}
              >
                {isUploading ? "Verifying..." : "Confirm Payment"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Booking error modal */}
      <Dialog
        open={errorModal.open}
        onOpenChange={(open) => {
          if (!open) setErrorModal({ open: false, message: "" });
        }}
      >
        <DialogContent className="sm:max-w-105">
          <DialogHeader>
            <DialogTitle>Booking Failed</DialogTitle>
          </DialogHeader>
          <div className="flex items-start gap-3 py-2">
            <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {errorModal.message}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button onClick={() => setErrorModal({ open: false, message: "" })}>
              Try Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
