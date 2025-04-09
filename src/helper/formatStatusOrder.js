const STATUS_MAPPING = {
  pending: 'Chờ xác nhận',
  paid: 'Đã thanh toán',
  cancelled: 'Đã hủy',
  delivered: 'Đã giao hàng',
  shipped: 'Đang giao hàng',
  draft: 'Nháp'
};

export const formatStatusOrder = (status) => STATUS_MAPPING[status] || '';