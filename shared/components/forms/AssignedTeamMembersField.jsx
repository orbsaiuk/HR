"use client";

import { useState, useEffect } from "react";
import { Users, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/shared/api/client";
import { useCurrentOrg } from "@/shared/hooks/useCurrentOrg";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ADMIN_ROLE_KEY } from "@/shared/lib/permissions";

export function AssignedTeamMembersField({ value = [], onChange }) {
  const { org } = useCurrentOrg();
  const { userId } = useAuth();
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const normalizeMember = (member) => {
    if (!member) return null;

    const user = member.user || member;
    if (!user?._id) return null;

    return {
      _id: user._id,
      clerkId: user.clerkId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      roleKey: member.roleKey,
    };
  };

  const isAutoAccessMember = (member) => {
    if (!member) return false;
    const isOrgAdmin = member.roleKey === ADMIN_ROLE_KEY;
    const isCurrentUser = Boolean(userId && member.clerkId === userId);
    return isOrgAdmin || isCurrentUser;
  };

  // Fetch org members for the dropdown
  useEffect(() => {
    if (!org?._id) return;

    async function fetchMembers() {
      try {
        setLoadingMembers(true);
        const data = await apiClient.get(
          `/api/organizations/${org._id}/members`,
        );
        const normalized = (data || []).map(normalizeMember).filter(Boolean);
        setMembers(normalized);
      } catch {
        setMembers([]);
      } finally {
        setLoadingMembers(false);
      }
    }

    fetchMembers();
  }, [org?._id]);

  const assignedMembers = members.filter((m) => value.includes(m._id));
  const unassignedMembers = members.filter(
    (m) => !value.includes(m._id) && !isAutoAccessMember(m),
  );

  function handleAdd(userId) {
    if (!value.includes(userId)) {
      onChange([...value, userId]);
    }
  }

  function handleRemove(userId) {
    onChange(value.filter((id) => id !== userId));
  }

  function getInitials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          إضافة أعضاء الشركة
        </CardTitle>
        <CardDescription>
          أضف أعضاء الشركة الذين يحتاجون للوصول. منشئ الوظيفة ومدير الشركة لديهم
          وصول تلقائي ولن يظهروا في القائمة.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add member dropdown */}
        {unassignedMembers.length > 0 && (
          <Select
            onValueChange={handleAdd}
            disabled={loadingMembers}
            value=""
            dir="rtl"
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingMembers ? "جاري التحميل..." : "أضف عضو شركة"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {unassignedMembers.map((member) => (
                <SelectItem key={member._id} value={member._id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{member.name || member.email}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Assigned members list */}
        {assignedMembers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {assignedMembers.map((member) => (
              <Badge
                key={member._id}
                variant="secondary"
                className="flex items-center gap-1.5 pr-1 py-1"
              >
                <Avatar className="h-4 w-4">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{member.name || member.email}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemove(member._id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            لم يتم تعيين أي أعضاء بعد. استخدم القائمة أعلاه لإضافة أعضاء الشركة.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
