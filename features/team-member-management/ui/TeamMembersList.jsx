"use client";

import { TeamMemberRow } from "./TeamMemberRow";
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

export function TeamMembersList({
  teamMembers,
  roles,
  onRemove,
  onChangeRole,
  ownerTeamMemberId,
}) {
  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Active Team Members
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({teamMembers.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6">Team Member</TableHead>
              <TableHead className="px-6">Email</TableHead>
              <TableHead className="px-6">Role</TableHead>
              <TableHead className="px-6">Forms</TableHead>
              <TableHead className="px-6">Joined</TableHead>
              <TableHead className="px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((entry) => (
              <TeamMemberRow
                key={entry._key}
                entry={entry}
                isOwner={entry.user?._id === ownerTeamMemberId}
                roles={roles}
                onChangeRole={onChangeRole}
                onRemove={onRemove}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
