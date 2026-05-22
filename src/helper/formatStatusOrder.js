const ORDER_STATUS = {
    draft: 'Nháp',
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
};

const PAYMENT_STATUS = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền'
};

export const formatStatusOrder = (status) => ORDER_STATUS[status] || PAYMENT_STATUS[status] || status || '';

export const getOrderStatusSeverity = (status) => {
    const map = {
        draft: 'secondary',
        pending: 'warn',
        confirmed: 'info',
        shipped: 'secondary',
        delivered: 'success',
        cancelled: 'danger'
    };
    return map[status] ?? 'secondary';
};

export const getPaymentStatusSeverity = (status) => {
    const map = {
        pending: 'warn',
        paid: 'success',
        failed: 'danger',
        refunded: 'info'
    };
    return map[status] ?? 'secondary';
};

// State machine: which statuses can transition to which
export const ORDER_TRANSITIONS = {
    draft: ['pending', 'cancelled'],
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: []
};

export const canTransitionTo = (currentStatus, targetStatus) =>
    ORDER_TRANSITIONS[currentStatus]?.includes(targetStatus) ?? false;

export const isTerminalStatus = (status) => ['delivered', 'cancelled'].includes(status);
