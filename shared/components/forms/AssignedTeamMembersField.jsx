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

export function AssignedTeamMembersField({ value = [], onChange }) {
    const { org } = useCurrentOrg();
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    // Fetch org members for the dropdown
    useEffect(() => {
        if (!org?._id) return;

        async function fetchMembers() {
            try {
                setLoadingMembers(true);
                const data = await apiClient.get(`/api/organizations/${org._id}/members`);
                setMembers(data || []);
            } catch {
                setMembers([]);
            } finally {
                setLoadingMembers(false);
            }
        }

        fetchMembers();
    }, [org?._id]);

    const assignedMembers = members.filter((m) => value.includes(m._id));
    const unassignedMembers = members.filter((m) => !value.includes(m._id));

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
                    Assigned Team Members
                </CardTitle>
                <CardDescription>
                    Team members with view-only permissions can only see resources they are
                    assigned to. Users with manage permissions can see all resources.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add member dropdown */}
                {unassignedMembers.length > 0 && (
                    <Select
                        onValueChange={handleAdd}
                        disabled={loadingMembers}
                        value=""
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={
                                    loadingMembers ? "Loading members..." : "Add a team member..."
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
                        No team members assigned. All users with manage permissions can see
                        this resource.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
