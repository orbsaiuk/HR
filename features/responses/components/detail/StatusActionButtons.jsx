'use client';

export function StatusActionButtons({ 
    currentStatus, 
    updatingStatus, 
    onStatusUpdate, 
    onRejectClick 
}) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Update Status</h3>
            <div className="flex gap-3 flex-wrap">
                {/* Show Reviewed button only if status is pending */}
                {currentStatus === 'pending' && (
                    <button
                        onClick={() => onStatusUpdate('reviewed')}
                        disabled={updatingStatus !== null}
                        className="flex-1 min-w-[150px] px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                        {updatingStatus === 'reviewed' ? 'Updating...' : 'Reviewed'}
                    </button>
                )}
                {/* Show Approve and Reject buttons only if status is not approved or rejected */}
                {currentStatus !== 'approved' && currentStatus !== 'rejected' && (
                    <>
                        <button
                            onClick={() => onStatusUpdate('approved')}
                            disabled={updatingStatus !== null}
                            className="flex-1 min-w-[150px] px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            {updatingStatus === 'approved' ? 'Updating...' : 'Approve'}
                        </button>
                        <button
                            onClick={onRejectClick}
                            disabled={updatingStatus !== null}
                            className="flex-1 min-w-[150px] px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            {updatingStatus === 'rejected' ? 'Rejecting...' : 'Reject'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
