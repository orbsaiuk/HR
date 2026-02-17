"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Languages, Plus, Trash2 } from "lucide-react";

const PROFICIENCY_OPTIONS = [
    { label: "Native", value: "native" },
    { label: "Fluent", value: "fluent" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Basic", value: "basic" },
];

const PROFICIENCY_LABELS = Object.fromEntries(
    PROFICIENCY_OPTIONS.map((o) => [o.value, o.label])
);

const PROFICIENCY_COLORS = {
    native: "bg-green-100 text-green-700 border-green-200",
    fluent: "bg-blue-100 text-blue-700 border-blue-200",
    intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
    basic: "bg-gray-100 text-gray-700 border-gray-200",
};

export function LanguagesSection({ languages = [], editable = false, onChange }) {
    const [adding, setAdding] = useState(false);
    const [newLang, setNewLang] = useState("");
    const [newProf, setNewProf] = useState("intermediate");

    const handleAdd = () => {
        const trimmed = newLang.trim();
        if (!trimmed) return;
        const entry = {
            _key: crypto.randomUUID(),
            language: trimmed,
            proficiency: newProf,
        };
        onChange?.([...languages, entry]);
        setNewLang("");
        setNewProf("intermediate");
        setAdding(false);
        toast.success(`Language "${trimmed}" added successfully`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (index) => {
        const removed = languages[index];
        onChange?.(languages.filter((_, i) => i !== index));
        toast.success(`Language "${removed?.language}" removed — save to commit`);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Languages size={18} />
                    Languages
                </CardTitle>
                {editable && !adding && (
                    <Button type="button" variant="outline" size="sm" onClick={() => setAdding(true)}>
                        <Plus size={14} className="mr-1" />
                        Add
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {adding && (
                    <div className="flex flex-wrap gap-3 mb-4 items-end rounded-lg border border-border bg-muted/40 p-4">
                        <div className="flex-1 min-w-[160px] space-y-1.5">
                            <Label htmlFor="newLang">Language</Label>
                            <Input
                                id="newLang"
                                value={newLang}
                                onChange={(e) => setNewLang(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. English"
                            />
                        </div>
                        <div className="min-w-[160px] space-y-1.5">
                            <Label>Proficiency</Label>
                            <Select value={newProf} onValueChange={setNewProf} >
                                <SelectTrigger className="mb-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PROFICIENCY_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" size="sm" onClick={handleAdd} disabled={!newLang.trim()}>
                                Save
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => setAdding(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {languages.length > 0 ? (
                    <div className="space-y-2">
                        {languages.map((lang, idx) => (
                            <div
                                key={lang._key || idx}
                                className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                        {lang.language}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${PROFICIENCY_COLORS[lang.proficiency] || PROFICIENCY_COLORS.basic}`}
                                    >
                                        {PROFICIENCY_LABELS[lang.proficiency] || lang.proficiency}
                                    </Badge>
                                </div>
                                {editable && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleRemove(idx)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No languages added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
