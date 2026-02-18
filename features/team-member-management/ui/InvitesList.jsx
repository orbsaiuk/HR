"use client";

import { Mail } from "lucide-react";
import { InviteRow } from "./InviteRow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InvitesList({ invites, roles = [], onDelete }) {
  const pendingInvites = invites.filter((i) => i.status === "pending");
  const joinedInvites = invites.filter((i) => i.status === "joined");

  if (invites.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-semibold mb-1">No invites yet</h3>
          <p className="text-sm text-muted-foreground">
            Invite team members by entering their email above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Invites
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({pendingInvites.length} pending, {joinedInvites.length} joined)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6">Email</TableHead>
              <TableHead className="px-6">Role</TableHead>
              <TableHead className="px-6">Status</TableHead>
              <TableHead className="px-6">Invited</TableHead>
              <TableHead className="px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.map((invite) => (
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
