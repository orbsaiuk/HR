"use client";

import { Mail } from "lucide-react";
import { InviteRow } from "./InviteRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InvitesList({ invites: rawInvites, roles = [], onDelete }) {
  const invites = rawInvites || [];
  const pendingInvites = invites.filter((i) => i.status === "pending");

  if (pendingInvites.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-semibold mb-1">لا توجد دعوات معلقة</h3>
          <p className="text-sm text-muted-foreground">
            ادعُ أعضاء الشركة عبر إدخال البريد الإلكتروني بالأعلى.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          الدعوات المعلقة
          <span className="mr-2 text-sm font-normal text-muted-foreground">
            ({pendingInvites.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6">البريد الإلكتروني</TableHead>
              <TableHead className="px-6">الدور</TableHead>
              <TableHead className="px-6">الحالة</TableHead>
              <TableHead className="px-6">تاريخ الدعوة</TableHead>
              <TableHead className="px-6 text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingInvites.map((invite) => (
              <InviteRow
                key={invite._key}
                invite={invite}
                roles={roles}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
