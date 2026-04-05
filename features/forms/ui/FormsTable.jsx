/**
 * Forms table component
 */

import { FormCard } from "./FormCard";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export function FormsTable({ forms, onSort, onAction }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">النموذج</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort("responseCount")}
            >
              الاستجابات
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort("updatedAt")}
            >
              آخر تحديث
            </TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <FormCard key={form._id} form={form} onAction={onAction} />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
