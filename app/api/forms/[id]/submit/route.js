import { NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { currentUser } from "@clerk/nextjs/server";
import { formsQueries } from "@/sanity/queries";

export async function POST(request, { params }) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const answersJson = formData.get('answers');
        const answers = JSON.parse(answersJson);
        const { id: formId } = await params;

        // Get form
        const form = await client.fetch(formsQueries.getById, {
            id: formId,
        });

        if (!form) {
            return NextResponse.json({ error: "Form not found" }, { status: 404 });
        }

        // Get user from Sanity
        const sanityUser = await client.fetch(
            formsQueries.getUserByClerkId,
            { clerkId: user.id },
        );

        if (!sanityUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user already submitted a response
        const existingResponse = await client.fetch(
            formsQueries.checkUserResponse,
            { formId, userId: sanityUser._id }
        );

        if (existingResponse) {
            return NextResponse.json(
                { error: "You have already submitted a response to this form" },
                { status: 400 }
            );
        }

        // Process answers and upload files
        const processedAnswers = await Promise.all(
            Object.entries(answers).map(async ([key, value]) => {
                const field = form.fields?.find(f => f._key === key);
                const fieldType = field?.type || 'text';
                const fieldLabel = field?.label || 'Untitled Field';

                // Handle file uploads
                if (fieldType === 'file') {
                    const file = formData.get(`file_${key}`);
                    if (file && file.size > 0) {
                        try {
                            // Upload file to Sanity
                            const asset = await client.assets.upload('file', file, {
                                filename: file.name,
                            });

                            return {
                                _key: key,
                                fieldId: key,
                                fieldType,
                                fieldLabel,
                                value: file.name,
                                fileAsset: {
                                    _type: 'file',
                                    asset: {
                                        _type: 'reference',
                                        _ref: asset._id,
                                    },
                                },
                            };
                        } catch (uploadError) {
                            console.error('File upload error:', uploadError);
                            return {
                                _key: key,
                                fieldId: key,
                                fieldType,
                                fieldLabel,
                                value: `Upload failed: ${file.name}`,
                            };
                        }
                    }
                }

                // Handle other field types
                let processedValue = value;
                if (typeof value === 'object' && value !== null) {
                    processedValue = Array.isArray(value)
                        ? JSON.stringify(value)
                        : JSON.stringify(value);
                } else {
                    processedValue = String(value ?? '');
                }

                return {
                    _key: key,
                    fieldId: key,
                    fieldType,
                    fieldLabel,
                    value: processedValue,
                };
            })
        );

        // Create response
        const response = await client.create({
            _type: "response",
            form: { _type: "reference", _ref: formId },
            user: { _type: "reference", _ref: sanityUser._id },
            answers: processedAnswers,
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error('Submit error:', error);
        return NextResponse.json(
            { error: "Failed to submit form", details: error.message },
            { status: 500 },
        );
    }
}
