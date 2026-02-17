"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, Pencil, Trash2 } from "lucide-react";
import { WorkEntryForm } from "./WorkEntryForm";

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
    });
}

export function WorkExperienceSection({ entries = [], editable = false, onChange }) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [adding, setAdding] = useState(false);

    const handleSaveNew = (data) => {
        const newEntry = { ...data, _key: crypto.randomUUID() };
        onChange?.([...entries, newEntry]);
        setAdding(false);
        toast.success("Work experience added successfully");
    };

    const handleSaveEdit = (data) => {
        const updated = entries.map((e, i) =>
            i === editingIndex ? { ...e, ...data } : e
        );
        onChange?.(updated);
        setEditingIndex(null);
        toast.success("Work entry updated — save to commit");
    };

    const handleRemove = (index) => {
        onChange?.(entries.filter((_, i) => i !== index));
        toast.success("Work entry removed — save to commit");
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Briefcase size={18} />
                    Work Experience
                </CardTitle>
                {editable && !adding && editingIndex === null && (
                    <Button type="button" variant="outline" size="sm" onClick={() => setAdding(true)}>
                        <Plus size={14} className="mr-1" />
                        Add
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {adding && (
                    <WorkEntryForm
                        onSave={handleSaveNew}
                        onCancel={() => setAdding(false)}
                    />
                )}

                {entries.map((entry, idx) =>
                    editingIndex === idx ? (
                        <WorkEntryForm
                            key={entry._key || idx}
                            entry={entry}
                            onSave={handleSaveEdit}
                            onCancel={() => setEditingIndex(null)}
                        />
                    ) : (
                        <div key={entry._key || idx} className="flex items-start gap-2">
                            <div className="flex-1 border-l-2 border-primary/30 pl-4">
                                <h4 className="font-semibold">{entry.title}</h4>
                                <p className="text-sm text-muted-foreground">{entry.company}</p>
                                <p className="text-xs text-muted-foreground/70 mt-0.5">
                                    {formatDate(entry.startDate)} –{" "}
                                    {entry.isCurrent ? "Present" : formatDate(entry.endDate)}
                                </p>
                                {entry.description && (
                                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                                        {entry.description}
                                    </p>
                                )}
                            </div>
                            {editable && (
                                <div className="flex gap-1 shrink-0">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                                        onClick={() => setEditingIndex(idx)}
                                    >
                                        <Pencil size={14} />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleRemove(idx)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )
                )}

                {!adding && !entries.length && (
                    <p className="text-sm text-muted-foreground">No work experience added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
