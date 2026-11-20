import { getBusinessAlertItemPath, mapBusinessAlertsToCards } from './businessAlerts';

const businessAlerts = {
  deliveryRisk: {
    count: 1,
    items: [
      {
        id: 123,
        code: 'DH-001',
        order_name: 'Đơn hàng A',
        receivedAt: '2026-11-01T10:00:00.000+07:00',
        receivedQuantity: 20,
      },
    ],
  },
  materialShortage: {
    count: 1,
    items: [
      {
        id: 22,
        code: 'LSX-001',
        orderCode: 'DH-001',
        productId: 50,
        materialId: 9,
        materialName: 'Vải kaki',
        shortage: 12,
      },
    ],
  },
  accountsReceivable: {
    count: 1,
    items: [
      {
        id: 123,
        code: 'DH-001',
        orderName: 'Đơn hàng A',
        customerId: 101,
        total: 50000000,
        paid: 20000000,
        outstanding: 30000000,
      },
    ],
    totalOutstanding: 30000000,
  },
  conversations: {
    count: 0,
    items: [],
  },
  inventory: {
    count: 8,
    items: [],
    stockQuantity: 260,
  },
  accountsPayable: {
    count: 0,
    items: [],
  },
};

describe('business alert card mapping', () => {
  it('maps every documented API section, including empty sections', () => {
    const cards = mapBusinessAlertsToCards(businessAlerts);

    expect(cards).toHaveLength(6);
    expect(cards[0].title).toContain('1 đơn hàng nhập kho hơn 7 ngày');
    expect(cards[0].description).toContain('DH-001');
    expect(cards[1].description).toContain('Vải kaki');
    expect(cards[2].title).toContain('Công nợ phải thu:');
    expect(cards[3].title).toContain('0 hội thoại');
    expect(cards[4].title).toContain('260 đơn vị');
    expect(cards[5].title).toContain('0 khoản phải trả');
  });

  it('creates destinations from the documented records and existing modules', () => {
    expect(getBusinessAlertItemPath('delivery-risk', { code: 'DH 001' })).toBe(
      '/sale/order?code=DH%20001',
    );
    expect(
      getBusinessAlertItemPath('material-shortage', {
        code: 'LSX-001',
        orderCode: 'DH-001',
      }),
    ).toBeNull();
    expect(getBusinessAlertItemPath('accounts-receivable', { code: 'DH-002' })).toBe(
      '/sale/order?code=DH-002',
    );
    expect(getBusinessAlertItemPath('inventory', {})).toBeNull();
  });
});
