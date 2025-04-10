const STATUS_MAPPING = {
  pending: 'Đã đặt hàng',
  paid: 'Đã thanh toán',
  cancelled: 'Đã hủy',
  delivered: 'Đã giao hàng',
  shipped: 'Đang giao hàng',
  draft: 'Nháp'
};

export const formatStatusOrder = (status) => STATUS_MAPPING[status] || '';