"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PositionCompensationCard({ formData, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compensation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Min Salary</Label>
            <Input
              id="salaryMin"
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              placeholder="50000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryMax">Max Salary</Label>
            <Input
              id="salaryMax"
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              placeholder="80000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              placeholder="USD"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
