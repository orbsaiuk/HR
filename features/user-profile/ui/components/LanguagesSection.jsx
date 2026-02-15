"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    native: "bg-green-100 text-green-700",
    fluent: "bg-blue-100 text-blue-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    basic: "bg-gray-100 text-gray-700",
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
    };

    const handleRemove = (index) => {
        onChange?.(languages.filter((_, i) => i !== index));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Languages size={18} />
                    Languages
                </CardTitle>
                {editable && !adding && (
                    <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
                        <Plus size={14} className="mr-1" />
                        Add
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {adding && (
                    <div className="flex flex-wrap gap-2 mb-3 items-end border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex-1 min-w-[140px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Language
                            </label>
                            <input
                                type="text"
                                value={newLang}
                                onChange={(e) => setNewLang(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="e.g. English"
                            />
                        </div>
                        <div className="min-w-[140px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Proficiency
                            </label>
                            <select
                                value={newProf}
                                onChange={(e) => setNewProf(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                                {PROFICIENCY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleAdd} disabled={!newLang.trim()}>
                                Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setAdding(false)}>
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
                                className="flex items-center justify-between py-1"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                        {lang.language}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${PROFICIENCY_COLORS[lang.proficiency] || PROFICIENCY_COLORS.basic}`}
                                    >
                                        {PROFICIENCY_LABELS[lang.proficiency] || lang.proficiency}
                                    </span>
                                </div>
                                {editable && (
                                    <button
                                        onClick={() => handleRemove(idx)}
                                        className="p-1 text-gray-400 hover:text-red-600"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No languages added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
