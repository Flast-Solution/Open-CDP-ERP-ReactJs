/**************************************************************************/
/*  @/store/omniStore.js                                                  */
/**************************************************************************/
/*                       Tệp này là một phần của:                         */
/*                             Open CDP                                   */
/*                        https://flast.vn                                */
/**************************************************************************/
/* Bản quyền (c) 2025 - này thuộc về các cộng tác viên Flast Solution     */
/* (xem AUTHORS.md).                                                      */
/**************************************************************************/

export const CHANNEL_TYPE = {
  ZALO_OA: 1,
  FACEBOOK: 2,
};

export const CHANNEL_STATUS = {
  DISCONNECTED: 0 /* admin chủ động ngắt — giữ lịch sử, nối lại được */,
  ACTIVE: 1,
  TOKEN_ERROR: 2 /* token hỏng/hết hạn — cần nối lại */,
};
