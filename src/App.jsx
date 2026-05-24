import { useMemo, useState } from 'react';

const appVersion = '0.3.0';

const orders = [
  {
    id: 'ORD-1048',
    customer: '安科云服务',
    owner: '诺拉',
    region: '华东',
    status: '阻塞',
    tone: 'blocked',
    priority: '高',
    amount: '¥18,420.00',
    submitted: '2026-05-24',
    channel: '企业客户',
    note: '付款复核正在等待财务审批。',
  },
  {
    id: 'ORD-1047',
    customer: '北辰实验室',
    owner: '伊凡',
    region: '华西',
    status: '可发布',
    tone: 'ready',
    priority: '中',
    amount: '¥7,880.50',
    submitted: '2026-05-23',
    channel: '渠道伙伴',
    note: '物流面单已经生成。',
  },
  {
    id: 'ORD-1046',
    customer: '蓝河零售',
    owner: '米娜',
    region: '华北',
    status: '待复核',
    tone: 'review',
    priority: '高',
    amount: '¥23,110.90',
    submitted: '2026-05-22',
    channel: '线上商城',
    note: '地址校验返回了风险提醒。',
  },
  {
    id: 'ORD-1045',
    customer: '维泰能源',
    owner: '欧文',
    region: '华南',
    status: '可发布',
    tone: 'ready',
    priority: '低',
    amount: '¥4,230.00',
    submitted: '2026-05-21',
    channel: '企业客户',
    note: '客户选择标准配送。',
  },
  {
    id: 'ORD-1044',
    customer: '海港食品',
    owner: '莉娅',
    region: '华东',
    status: '草稿',
    tone: 'draft',
    priority: '中',
    amount: '¥1,980.75',
    submitted: '2026-05-20',
    channel: '线上商城',
    note: '草稿订单缺少税务信息。',
  },
];

const stageCards = [
  {
    label: 'Webhook',
    value: '已启用',
    detail: 'GitHub push 通过 ngrok 触发 Jenkins。',
  },
  {
    label: 'Install',
    value: 'npm ci',
    detail: '依赖会根据 package-lock.json 还原。',
  },
  {
    label: 'Lint',
    value: 'ESLint',
    detail: '构建前执行静态代码检查。',
  },
  {
    label: 'Build',
    value: 'dist/',
    detail: 'Vite 生成可部署的静态资源。',
  },
];

const statusOptions = ['全部', '可发布', '待复核', '阻塞', '草稿'];
const regionOptions = ['全部', '华东', '华西', '华北', '华南'];

export default function App() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('全部');
  const [region, setRegion] = useState('全部');
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmOrder, setConfirmOrder] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState('ORD-1048');
  const [toast, setToast] = useState('最近一次构建产物已可下载。');

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        order.id.toLowerCase().includes(normalizedQuery) ||
        order.customer.toLowerCase().includes(normalizedQuery) ||
        order.owner.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === '全部' || order.status === status;
      const matchesRegion = region === '全部' || order.region === region;
      const matchesPriority = !priorityOnly || order.priority === '高';

      return matchesQuery && matchesStatus && matchesRegion && matchesPriority;
    });
  }, [priorityOnly, query, region, status]);

  function runSearch(event) {
    event.preventDefault();
    setIsLoading(true);
    setToast('');

    window.setTimeout(() => {
      setIsLoading(false);
      setToast(`已加载 ${filteredOrders.length} 条匹配订单。`);
    }, 450);
  }

  function resetFilters() {
    setQuery('');
    setStatus('全部');
    setRegion('全部');
    setPriorityOnly(false);
    setToast('筛选条件已重置。');
  }

  function approveOrder() {
    setToast(`${confirmOrder.id} 已批准进入测试环境部署。`);
    setConfirmOrder(null);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Jenkins CI/CD 演示</p>
          <h1>订单运营控制台</h1>
        </div>

        <nav className="nav-menu" aria-label="主导航">
          <button type="button">控制台</button>
          <button type="button">订单</button>
          <button type="button">报表</button>
          <div className="menu-cluster">
            <button type="button" aria-haspopup="true">
              管理
            </button>
            <div className="menu-panel" role="menu">
              <button type="button" role="menuitem">
                用户角色
              </button>
              <button type="button" role="menuitem">
                审计日志
              </button>
            </div>
          </div>
        </nav>

        <div className="user-tools">
          <button className="notification-button" type="button" aria-label="通知">
            <span>告警</span>
            <strong>3</strong>
          </button>
          <button type="button" className="avatar-button">
            测
          </button>
        </div>
      </header>

      <section className="summary-grid" aria-label="流水线摘要">
        {stageCards.map((card) => (
          <article className="summary-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="workspace">
        <aside className="side-panel" aria-label="环境信息面板">
          <div className="env-card">
            <span className="section-label">当前阶段</span>
            <strong>阶段 2 - 前端应用 CI</strong>
            <p>当前仓库只维护开发侧 app。UI 自动化后续会从独立测试仓库接入。</p>
          </div>

          <div className="release-card">
            <span className="section-label">候选版本</span>
            <p>版本 {appVersion}</p>
            <div className="progress-track" aria-label="发布准备度">
              <span style={{ width: '68%' }} />
            </div>
          </div>

          <details open>
            <summary>适合 UI 自动化练习的区域</summary>
            <ul>
              <li>重复的行内操作按钮</li>
              <li>详情弹窗与确认弹窗嵌套</li>
              <li>搜索后的 loading 状态</li>
              <li>阻塞订单的审批按钮禁用</li>
            </ul>
          </details>
        </aside>

        <section className="content-panel">
          <form className="filter-bar" onSubmit={runSearch} aria-label="订单筛选">
            <label>
              搜索订单
              <input
                name="query"
                placeholder="订单号、客户、负责人"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <label>
              状态
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                {statusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label>
              区域
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                {regionOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label>
              提交日期晚于
              <input type="date" defaultValue="2026-05-20" />
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={priorityOnly}
                onChange={(event) => setPriorityOnly(event.target.checked)}
              />
              仅看高优先级
            </label>

            <div className="filter-actions">
              <button type="submit" disabled={isLoading}>
                {isLoading ? '查询中...' : '查询'}
              </button>
              <button type="button" className="secondary-button" onClick={resetFilters}>
                重置
              </button>
            </div>
          </form>

          {toast && (
            <div className="toast" role="status">
              {toast}
              <button type="button" aria-label="关闭通知" onClick={() => setToast('')}>
                关闭
              </button>
            </div>
          )}

          <div className="table-toolbar">
            <div>
              <span className="section-label">订单</span>
              <h2>部署候选队列</h2>
            </div>
            <div className="toolbar-actions">
              <button type="button" className="secondary-button">
                导出
              </button>
              <button type="button">新建订单</button>
            </div>
          </div>

          <div className="table-frame" aria-busy={isLoading}>
            {isLoading && <div className="loading-overlay">正在加载筛选结果...</div>}

            <table>
              <thead>
                <tr>
                  <th scope="col">订单</th>
                  <th scope="col">客户</th>
                  <th scope="col">负责人</th>
                  <th scope="col">区域</th>
                  <th scope="col">状态</th>
                  <th scope="col">金额</th>
                  <th scope="col">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? '' : order.id)}
                      >
                        {order.id}
                      </button>
                      {expandedOrderId === order.id && <p className="row-note">{order.note}</p>}
                    </td>
                    <td>{order.customer}</td>
                    <td>{order.owner}</td>
                    <td>{order.region}</td>
                    <td>
                      <span className={`status-pill status-${order.tone}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.amount}</td>
                    <td>
                      <div className="row-actions">
                        <button type="button" onClick={() => setSelectedOrder(order)}>
                          查看
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          disabled={order.status === '阻塞'}
                          onClick={() => setConfirmOrder(order)}
                        >
                          审批
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && <div className="empty-state">没有符合筛选条件的订单。</div>}
          </div>

          <footer className="pagination-bar">
            <span>第 1 页 / 共 3 页</span>
            <div>
              <button type="button" className="secondary-button" disabled>
                上一页
              </button>
              <button type="button" className="secondary-button">
                下一页
              </button>
            </div>
          </footer>
        </section>
      </section>

      {selectedOrder && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="order-detail-title">
            <div className="modal-header">
              <div>
                <span className="section-label">订单详情</span>
                <h2 id="order-detail-title">{selectedOrder.id}</h2>
              </div>
              <button type="button" aria-label="关闭详情弹窗" onClick={() => setSelectedOrder(null)}>
                关闭
              </button>
            </div>
            <dl className="detail-grid">
              <div>
                <dt>客户</dt>
                <dd>{selectedOrder.customer}</dd>
              </div>
              <div>
                <dt>渠道</dt>
                <dd>{selectedOrder.channel}</dd>
              </div>
              <div>
                <dt>优先级</dt>
                <dd>{selectedOrder.priority}</dd>
              </div>
              <div>
                <dt>提交日期</dt>
                <dd>{selectedOrder.submitted}</dd>
              </div>
            </dl>
            <label>
              复核备注
              <textarea defaultValue={selectedOrder.note} />
            </label>
            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setSelectedOrder(null)}>
                取消
              </button>
              <button type="button" onClick={() => setConfirmOrder(selectedOrder)}>
                发起审批
              </button>
            </div>
          </section>
        </div>
      )}

      {confirmOrder && (
        <div className="confirm-popover" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
          <h2 id="confirm-title">确认审批 {confirmOrder.id}？</h2>
          <p>这个操作用于模拟发布门禁。阻塞状态的订单不能从表格中直接审批。</p>
          <div>
            <button type="button" className="secondary-button" onClick={() => setConfirmOrder(null)}>
              取消
            </button>
            <button type="button" onClick={approveOrder}>
              确认审批
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
