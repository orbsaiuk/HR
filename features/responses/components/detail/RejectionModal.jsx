/**
 * Rejection modal component for selecting rejection reason
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const REJECTION_REASONS = [
    'Incomplete answers',
    'Answers do not meet the assignment criteria',
    'Plagiarism detected',
    'Off-topic responses',
    'Insufficient effort demonstrated',
];

export function RejectionModal({ isOpen, onClose, onSubmit, isSubmitting }) {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    const handleSubmit = () => {
        const reason = isCustom ? customReason : selectedReason;
        if (!reason.trim()) {
            alert('Please select or enter a rejection reason');
            return;
        }
        onSubmit(reason);
    };

    const handleReasonSelect = (value) => {
        if (value === 'custom') {
            setIsCustom(true);
            setSelectedReason('');
        } else {
            setSelectedReason(value);
            setIsCustom(false);
            setCustomReason('');
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Rejection Reason"
            maxWidth="max-w-2xl"
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={isSubmitting || (!selectedReason && !customReason.trim())}
                        className="text-white"
                    >
                        {isSubmitting ? 'Rejecting...' : 'Reject Submission'}
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Please select a reason for rejection. This message will be sent to the student.
                </p>

                <RadioGroup
                    value={isCustom ? 'custom' : selectedReason}
                    onValueChange={handleReasonSelect}
                    disabled={isSubmitting}
                    className="space-y-3"
                >
                    {REJECTION_REASONS.map((reason, index) => (
                        <div key={index} className="flex items-start space-x-3 space-y-0">
                            <RadioGroupItem value={reason} id={`reason-${index}`} />
                            <Label
                                htmlFor={`reason-${index}`}
                                className="cursor-pointer leading-relaxed"
                            >
                                {reason}
                            </Label>
                        </div>
                    ))}

                    {/* Custom Reason Option */}
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3 space-y-0">
                            <RadioGroupItem value="custom" id="reason-custom" />
                            <Label
                                htmlFor="reason-custom"
                                className="font-medium cursor-pointer"
                            >
                                Other (Write your own reason)
                            </Label>
                        </div>
                        {isCustom && (
                            <Input
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Enter your custom rejection reason..."
                                className="ml-7 w-[calc(100%-3rem)]"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        )}
                    </div>
                </RadioGroup>
            </div>
        </Modal>
    );
}
