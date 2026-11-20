import { useNavigate } from 'react-router-dom';
import {
  Button,
  Descriptions,
  Drawer,
  Empty,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { formatMoney, formatNumber } from '../lib/format';
import { getBusinessAlertItemPath } from '../widgets/models/businessAlerts';

const { Text } = Typography;

const formatDateTime = (value) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(value));

const createItemColumns = (alertId, navigate) => {
  const openItem = (item) => {
    const path = getBusinessAlertItemPath(alertId, item);
    if (path) {
      navigate(path);
    }
  };

  const actionColumn = {
    title: '',
    key: 'action',
    align: 'right',
    render: (_, item) => (
      <Button icon={<ArrowRightOutlined />} onClick={() => openItem(item)} size="small" type="link">
        Mở
      </Button>
    ),
  };

  if (alertId === 'delivery-risk') {
    return [
      { title: 'Mã đơn', dataIndex: 'code', key: 'code' },
      {
        title: 'Tên đơn',
        dataIndex: 'order_name',
        key: 'order_name',
        render: (value) => value || '—',
      },
      {
        title: 'Nhập kho',
        dataIndex: 'receivedAt',
        key: 'receivedAt',
        render: formatDateTime,
      },
      {
        title: 'SL nhập',
        dataIndex: 'receivedQuantity',
        key: 'receivedQuantity',
        align: 'right',
        render: formatNumber,
      },
      actionColumn,
    ];
  }

  if (alertId === 'material-shortage') {
    return [
      { title: 'Mã lệnh', dataIndex: 'code', key: 'code' },
      {
        title: 'Đơn hàng',
        dataIndex: 'orderCode',
        key: 'orderCode',
        render: (value) => value || '—',
      },
      { title: 'Nguyên liệu', dataIndex: 'materialName', key: 'materialName' },
      {
        title: 'Thiếu',
        dataIndex: 'shortage',
        key: 'shortage',
        align: 'right',
        render: formatNumber,
      },
    ];
  }

  if (alertId === 'accounts-receivable') {
    return [
      { title: 'Mã đơn', dataIndex: 'code', key: 'code' },
      {
        title: 'Tên đơn',
        dataIndex: 'orderName',
        key: 'orderName',
        render: (value) => value || '—',
      },
      {
        title: 'Tổng đơn',
        dataIndex: 'total',
        key: 'total',
        align: 'right',
        render: formatMoney,
      },
      {
        title: 'Đã thu',
        dataIndex: 'paid',
        key: 'paid',
        align: 'right',
        render: formatMoney,
      },
      {
        title: 'Còn nợ',
        dataIndex: 'outstanding',
        key: 'outstanding',
        align: 'right',
        render: formatMoney,
      },
      actionColumn,
    ];
  }

  return [];
};

const getBasePath = (alertId) => {
  const paths = {
    'delivery-risk': '/sale/order',
    'accounts-receivable': '/sale/order',
    inventory: '/warehouse/trong-kho',
  };
  return paths[alertId] || null;
};

const BusinessAlertContent = ({ alert, data, navigate }) => {
  const { id } = alert;

  if (id === 'delivery-risk' || id === 'material-shortage' || id === 'accounts-receivable') {
    const section = {
      'delivery-risk': data.deliveryRisk,
      'material-shortage': data.materialShortage,
      'accounts-receivable': data.accountsReceivable,
    }[id];
    const columns = createItemColumns(id, navigate);

    return (
      <>
        {id === 'accounts-receivable' && (
          <div className="dashboard-alert-drawer__summary">
            <Statistic
              title="Tổng công nợ phải thu"
              value={section.totalOutstanding}
              formatter={() => formatMoney(section.totalOutstanding)}
            />
          </div>
        )}
        {section.items.length ? (
          <Table
            columns={columns}
            dataSource={section.items}
            pagination={false}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            size="small"
          />
        ) : (
          <Empty description="Không có mục nào cần xử lý." />
        )}
      </>
    );
  }

  if (id === 'inventory') {
    return (
      <div className="dashboard-alert-drawer__summary">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Số dòng hàng có tồn">
            {formatNumber(data.inventory.count)}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng số lượng tồn">
            {formatNumber(data.inventory.stockQuantity)}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }

  if (id === 'conversations') {
    return (
      <Empty
        description={
          data.conversations.count
            ? `Có ${formatNumber(data.conversations.count)} hội thoại cần phản hồi; chưa có dữ liệu chi tiết.`
            : 'Chưa có dữ liệu hội thoại cần phản hồi.'
        }
      />
    );
  }

  return (
    <Empty
      description={
        data.accountsPayable.count
          ? `Có ${formatNumber(data.accountsPayable.count)} khoản phải trả cần theo dõi; chưa có dữ liệu chi tiết.`
          : 'Chưa có dữ liệu công nợ phải trả cần theo dõi.'
      }
    />
  );
};

const BusinessAlertDrawer = ({ alert, data, onClose }) => {
  const navigate = useNavigate();
  const basePath = alert ? getBasePath(alert.id) : null;

  return (
    <Drawer
      destroyOnClose
      onClose={onClose}
      open={Boolean(alert)}
      title={
        alert && (
          <Space size={8}>
            <span>{alert.title}</span>
            <Tag color={alert.severity === 'high' ? 'red' : 'default'}>
              {formatNumber(
                {
                  'delivery-risk': data.deliveryRisk.count,
                  'material-shortage': data.materialShortage.count,
                  'accounts-receivable': data.accountsReceivable.count,
                  conversations: data.conversations.count,
                  inventory: data.inventory.count,
                  'accounts-payable': data.accountsPayable.count,
                }[alert.id],
              )}
            </Tag>
          </Space>
        )
      }
      width="min(720px, 100vw)"
    >
      {alert && (
        <div className="dashboard-alert-drawer">
          <Text className="dashboard-alert-drawer__description" type="secondary">
            {alert.description}
          </Text>
          <BusinessAlertContent alert={alert} data={data} navigate={navigate} />
          {basePath && (
            <div className="dashboard-alert-drawer__footer">
              <Button onClick={() => navigate(basePath)} type="primary">
                Mở module
              </Button>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
};

export default BusinessAlertDrawer;
