"use client";

import { OrgMemberRow } from "./OrgMemberRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function OrgMembersList({
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
          أعضاء الشركة النشطون
          <span className="mr-2 text-sm font-normal text-muted-foreground">
            ({teamMembers.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6">عضو الشركة</TableHead>
              <TableHead className="px-6">البريد الإلكتروني</TableHead>
              <TableHead className="px-6">الدور</TableHead>
              <TableHead className="px-6">النماذج</TableHead>
              <TableHead className="px-6">تاريخ الانضمام</TableHead>
              <TableHead className="px-6 text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((entry) => (
              <OrgMemberRow
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
