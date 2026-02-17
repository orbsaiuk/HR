"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
        toast.success(`Skill "${trimmed}" added successfully`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (index) => {
        const removed = skills[index];
        onChange?.(skills.filter((_, i) => i !== index));
        toast.success(`Skill "${removed}" removed — save to commit`);
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
                    <div className="flex gap-2 mb-4">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a skill and press Enter"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAdd}
                            disabled={!input.trim()}
                        >
                            <Plus size={14} className="mr-1" />
                            Add
                        </Button>
                    </div>
                )}

                {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, idx) => (
                            <Badge
                                key={idx}
                                variant="secondary"
                                className="flex items-center gap-1 px-3 py-1 text-sm"
                            >
                                {skill}
                                {editable && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(idx)}
                                        className="ml-1 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors p-0.5"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No skills added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
