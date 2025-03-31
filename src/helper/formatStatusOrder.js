const STATUS_MAPPING = {
  pending: 'Chờ xác nhận',
  paid: 'Đã thanh toán',
  cancel: 'Đã hủy',
  delivered: 'Đã giao hàng',
  shipped: '',
  draft: ''
};

export const formatStatusOrder = (status) => STATUS_MAPPING[status] || '';