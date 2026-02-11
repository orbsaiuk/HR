'use client';

import { format } from 'date-fns';
import { Eye, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const MAX_SELECTIONS = 5;

export function ResponseTable({
    responses,
    onSelectResponse,
    onDeleteResponse,
    selectedIds = [],
    onToggleSelection,
}) {
    const isSelectionEnabled = onToggleSelection !== undefined;
    const isMaxReached = selectedIds.length >= MAX_SELECTIONS;

    if (responses.length === 0) {
        return (
            <div className="bg-card rounded-xl border shadow-sm p-12 text-center">
                <div className="text-muted-foreground text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Responses Found</h3>
                <p className="text-muted-foreground">
                    {responses.length === 0
                        ? 'There are no responses yet. Share your form to start collecting responses.'
                        : 'No responses match your current filters.'}
                </p>
            </div>
        );
    }

    const handleDelete = (e, responseId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this response?')) {
            onDeleteResponse(responseId);
        }
    };

    const handleCheckboxChange = (e, responseId) => {
        e.stopPropagation();
        onToggleSelection(responseId);
    };

    const isSelected = (responseId) => selectedIds.includes(responseId);
    const isDisabled = (responseId) => isMaxReached && !isSelected(responseId);

    return (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {isSelectionEnabled && (
                                <TableHead className="w-12">
                                    <span className="sr-only">Select</span>
                                </TableHead>
                            )}
                            <TableHead>Respondent</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {responses.map((response) => {
                            const selected = isSelected(response._id);
                            const disabled = isDisabled(response._id);

                            return (
                                <TableRow
                                    key={response._id}
                                    onClick={() => onSelectResponse(response)}
                                    className={`cursor-pointer ${selected ? 'bg-primary/5' : ''}`}
                                    data-state={selected ? 'selected' : undefined}
                                >
                                    {isSelectionEnabled && (
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                disabled={disabled}
                                                onChange={(e) => handleCheckboxChange(e, response._id)}
                                                className={`w-4 h-4 rounded border-border focus:ring-primary ${disabled
                                                        ? 'cursor-not-allowed opacity-50'
                                                        : 'cursor-pointer'
                                                    } ${selected
                                                        ? 'text-primary'
                                                        : ''
                                                    }`}
                                                aria-label={`Select response from ${response.user.name}`}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-primary font-medium">
                                                    {response.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-foreground">
                                                    {response.user.name}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground">{response.user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={response.status} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground">
                                            {format(new Date(response.submittedAt), 'MMM dd, yyyy HH:mm')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectResponse(response);
                                                }}
                                                title="View Response"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => handleDelete(e, response._id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                title="Delete Response"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
