"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PositionDetailsCard({ position }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Created</dt>
            <dd className="text-gray-900 font-medium">
              {position.createdAt
                ? new Date(position.createdAt).toLocaleDateString()
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Last Updated</dt>
            <dd className="text-gray-900 font-medium">
              {position.updatedAt
                ? new Date(position.updatedAt).toLocaleDateString()
                : "—"}
            </dd>
          </div>
          {position.teamMember && (
            <div>
              <dt className="text-muted-foreground">Created By</dt>
              <dd className="text-gray-900 font-medium">
                {position.teamMember.name}
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
