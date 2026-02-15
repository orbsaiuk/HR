"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, X } from "lucide-react";


export function SkillsSection({ skills = [], editable = false, onChange }) {
    const [input, setInput] = useState("");

    const handleAdd = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        if (skills.includes(trimmed)) {
            setInput("");
            return;
        }
        onChange?.([...skills, trimmed]);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (index) => {
        onChange?.(skills.filter((_, i) => i !== index));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles size={18} />
                    Skills
                </CardTitle>
            </CardHeader>
            <CardContent>
                {editable && (
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="Type a skill and press Enter"
                        />
                        <Button variant="outline" size="sm" onClick={handleAdd} disabled={!input.trim()}>
                            <Plus size={14} className="mr-1" />
                            Add
                        </Button>
                    </div>
                )}

                {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                                {skill}
                                {editable && (
                                    <button
                                        onClick={() => handleRemove(idx)}
                                        className="ml-1 hover:text-red-600"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No skills added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
