const STATUS_MAPPING = {
    pending: 'Chờ xác nhận',
    paid: 'Đã thanh toán',
    cancelled: 'Đã hủy',
    confirmed: 'Đã xác nhận'
};

export const formatStatusOrder = (status) => STATUS_MAPPING[status] || '';
