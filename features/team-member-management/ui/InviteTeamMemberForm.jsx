"use client";

import { useState } from "react";
import { Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoleSelector } from "./RoleSelector";

export function InviteTeamMemberForm({ onInvite, roles = [] }) {
  const [email, setEmail] = useState("");
  const [roleKey, setRoleKey] = useState("viewer");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("يرجى إدخال بريد إلكتروني صالح");
      return;
    }

    setSubmitting(true);
    const result = await onInvite(trimmedEmail, roleKey);

    if (result.success) {
      setEmail("");
      setRoleKey("viewer");
    } else {
      setError(result.error);
    }

    setSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>دعوة عضو</CardTitle>
        <CardDescription>
          أدخل البريد الإلكتروني لإرسال دعوة. عند تسجيل المستخدم، سيصبح عضوًا في
          الشركة تلقائيًا.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3" dir="rtl">
          <div className="relative flex-1">
            <Mail
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              type="email"
              placeholder="org.member@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              className="pr-10"
              disabled={submitting}
            />
          </div>
          {roles.length > 0 && (
            <div className="w-44">
              <RoleSelector
                roles={roles}
                value={roleKey}
                onChange={setRoleKey}
                disabled={submitting}
              />
            </div>
          )}
          <Button
            type="submit"
            disabled={submitting || !email.trim()}
            className="gap-1.5"
          >
            <Plus size={18} />
            {submitting ? "جارٍ إرسال الدعوة..." : "إرسال الدعوة"}
          </Button>
        </form>

        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
