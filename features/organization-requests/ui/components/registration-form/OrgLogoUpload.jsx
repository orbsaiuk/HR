"use client";

import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";

/**
 * Organization logo upload with preview.
 * Must be used within a react-hook-form FormProvider.
 */
export function OrgLogoUpload() {
    const { setValue, watch } = useFormContext();
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return;
        }

        setValue("orgLogo", file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreview(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setValue("orgLogo", null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon size={18} />
                    Organization Logo
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6">
                    {preview ? (
                        <div className="relative">
                            <Image
                                src={preview}
                                alt="Logo preview"
                                className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            <ImageIcon size={24} />
                        </div>
                    )}

                    <div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <Upload size={16} />
                            {preview ? "Change Logo" : "Upload Logo"}
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, or SVG. Max 2MB.
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
