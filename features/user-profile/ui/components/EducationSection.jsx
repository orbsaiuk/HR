"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, Pencil, Trash2 } from "lucide-react";
import { EducationEntryForm } from "./EducationEntryForm";

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
    });
}


export function EducationSection({ entries = [], editable = false, onChange }) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [adding, setAdding] = useState(false);

    const handleSaveNew = (data) => {
        const newEntry = { ...data, _key: crypto.randomUUID() };
        onChange?.([...entries, newEntry]);
        setAdding(false);
    };

    const handleSaveEdit = (data) => {
        const updated = entries.map((e, i) =>
            i === editingIndex ? { ...e, ...data } : e
        );
        onChange?.(updated);
        setEditingIndex(null);
    };

    const handleRemove = (index) => {
        onChange?.(entries.filter((_, i) => i !== index));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap size={18} />
                    Education
                </CardTitle>
                {editable && !adding && editingIndex === null && (
                    <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
                        <Plus size={14} className="mr-1" />
                        Add
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {adding && (
                    <EducationEntryForm
                        onSave={handleSaveNew}
                        onCancel={() => setAdding(false)}
                    />
                )}

                {entries.map((entry, idx) =>
                    editingIndex === idx ? (
                        <EducationEntryForm
                            key={entry._key || idx}
                            entry={entry}
                            onSave={handleSaveEdit}
                            onCancel={() => setEditingIndex(null)}
                        />
                    ) : (
                        <div key={entry._key || idx} className="flex items-start gap-2">
                            <div className="flex-1 border-l-2 border-green-200 pl-4">
                                <h4 className="font-semibold text-gray-900">{entry.degree}</h4>
                                <p className="text-sm text-gray-600">{entry.institution}</p>
                                {entry.fieldOfStudy && (
                                    <p className="text-sm text-gray-500">{entry.fieldOfStudy}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {formatDate(entry.startDate)}
                                    {entry.endDate ? ` – ${formatDate(entry.endDate)}` : ""}
                                </p>
                                {entry.grade && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Grade: {entry.grade}
                                    </p>
                                )}
                            </div>
                            {editable && (
                                <div className="flex gap-1 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setEditingIndex(idx)}
                                        className="p-1 text-gray-400 hover:text-blue-600"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(idx)}
                                        className="p-1 text-gray-400 hover:text-red-600"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                )}

                {!adding && !entries.length && (
                    <p className="text-sm text-gray-400">No education added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
