import React, { useState } from 'react';
import { Download, Search, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import './AuditLogView.css';

export default function AuditLogView({ dishes = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Baseline audit records matching the telemetry specifications
  const initialAuditRecords = [
    {
      id: 'log-1',
      timestamp: '8:31 PM',
      action: 'MARK OUT OF STOCK EVERYWHERE',
      item: 'Brioche Burger Buns',
      initiator: 'Chef Marco (Staff #01)',
      aggregators: 'UberEats Direct v3.2, DoorDash Drive Gateway, Zomato Partner Bridge',
      latency: '690ms',
      status: "ALERT (86'D)",
      type: 'ALERT'
    },
    {
      id: 'log-2',
      timestamp: '8:31 PM',
      action: 'CASCADED 86 PROPAGATION',
      item: 'Double Truffle Smash Burger',
      initiator: 'StockSync Engine',
      aggregators: 'UberEats, DoorDash, Zomato',
      latency: '512ms',
      status: 'SUCCESS',
      type: 'SUCCESS'
    },
    {
      id: 'log-3',
      timestamp: '8:20 PM',
      action: 'SET STATUS TO LOW_STOCK',
      item: 'Crispy Chicken Wings (6pcs)',
      initiator: 'Grill Station #1',
      aggregators: 'UberEats, DoorDash, Zomato',
      latency: '290ms',
      status: 'WARNING',
      type: 'WARNING'
    },
    {
      id: 'log-4',
      timestamp: '7:45 PM',
      action: 'STOCK RE-VERIFICATION',
      item: 'Loaded Truffle Fries',
      initiator: 'Shift Manager Sarah',
      aggregators: 'UberEats, DoorDash, Zomato',
      latency: '240ms',
      status: 'INFO',
      type: 'INFO'
    },
    {
      id: 'log-5',
      timestamp: '6:30 PM',
      action: 'INVENTORY RESTORED',
      item: 'Salted Caramel Milkshake',
      initiator: 'Prep Kitchen Lead',
      aggregators: 'UberEats, DoorDash, Zomato',
      latency: '265ms',
      status: 'SUCCESS',
      type: 'SUCCESS'
    },
    {
      id: 'log-6',
      timestamp: '5:50 PM',
      action: 'CHANNEL ISOLATION DELIST',
      item: 'Classic Smash Burger',
      initiator: 'Automated SLA Shield',
      aggregators: 'Swiggy Merchant Gateway v2',
      latency: '310ms',
      status: 'WARNING',
      type: 'WARNING'
    },
    {
      id: 'log-7',
      timestamp: '5:15 PM',
      action: 'BATCH INVENTORY INCREMENT',
      item: 'Spicy Paneer Wrap',
      initiator: 'Chef Marco (Staff #01)',
      aggregators: 'Swiggy, Zomato, Direct Brand',
      latency: '185ms',
      status: 'SUCCESS',
      type: 'SUCCESS'
    },
    {
      id: 'log-8',
      timestamp: '4:40 PM',
      action: 'AGGREGATOR HEALTHCHECK PING',
      item: 'All Active Cloud Outlets',
      initiator: 'Telemetry Worker #04',
      aggregators: 'Partner Gateways (Swiggy, Zomato, Direct)',
      latency: '98ms',
      status: 'INFO',
      type: 'INFO'
    },
    {
      id: 'log-9',
      timestamp: '4:12 PM',
      action: 'MARK OUT OF STOCK EVERYWHERE',
      item: 'Chocolate Lava Cake',
      initiator: 'Pastry Lead Elena',
      aggregators: 'Swiggy Partner Bridge, Zomato Bridge',
      latency: '420ms',
      status: "ALERT (86'D)",
      type: 'ALERT'
    }
  ];

  // Filtering by search query & active category filter
  const filteredRecords = initialAuditRecords.filter((record) => {
    // 1. Status Filter match
    if (activeFilter !== 'ALL' && record.type !== activeFilter) {
      return false;
    }

    // 2. Search query match
    if (!searchQuery.trim()) {
      return true;
    }

    const q = searchQuery.toLowerCase();
    return (
      record.item.toLowerCase().includes(q) ||
      record.action.toLowerCase().includes(q) ||
      record.initiator.toLowerCase().includes(q) ||
      record.aggregators.toLowerCase().includes(q) ||
      record.status.toLowerCase().includes(q)
    );
  });

  // Client-side CSV export functionality
  function handleExportCsv() {
    const headers = ['Timestamp', 'Event / Action', 'Item Affected', 'Initiator / User', 'Aggregators Updated', 'Latency', 'Status'];
    const rows = filteredRecords.map((r) => [
      `"${r.timestamp}"`,
      `"${r.action}"`,
      `"${r.item}"`,
      `"${r.initiator}"`,
      `"${r.aggregators}"`,
      `"${r.latency}"`,
      `"${r.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Render status badge with exact theme colors
  function renderStatusBadge(status, type) {
    let badgeClass = 'status-info';
    if (type === 'ALERT') {
      badgeClass = 'status-alert';
    } else if (type === 'SUCCESS') {
      badgeClass = 'status-success';
    } else if (type === 'WARNING') {
      badgeClass = 'status-warning';
    } else if (type === 'INFO') {
      badgeClass = 'status-info';
    }

    return (
      <span className={`audit-status-badge ${badgeClass}`}>
        {status}
      </span>
    );
  }

  return (
    <div className="audit-trail-container container-fluid px-0">
      {/* Top Header Section */}
      <div className="mb-4">
        {/* Breadcrumb line */}
        <div className="audit-breadcrumb-line d-flex align-items-center mb-2">
          <span className="me-1.5" role="img" aria-label="document">📄</span>
          <span className="audit-breadcrumb-tag">ACTIVITY AUDIT LOG</span>
          <span className="audit-breadcrumb-slash mx-2">/</span>
          <span className="audit-breadcrumb-sub">Immutable Telemetry Records</span>
        </div>

        {/* Title and Export Button Row */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div>
            <h1 className="audit-header-title mb-1">System Activity &amp; Audit Trail</h1>
            <p className="audit-header-desc mb-0">
              Complete cryptographic audit trail of state changes, emergency 86 broadcasts, and aggregator sync events.
            </p>
          </div>

          <button
            type="button"
            className="audit-export-btn"
            onClick={handleExportCsv}
            id="exportAuditCsvBtn"
            title="Download CSV export of currently filtered audit records"
          >
            <Download className="audit-export-icon" size={16} />
            <span>Export Audit Trail (CSV)</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="audit-toolbar-card mb-3">
        {/* Search Input Field */}
        <div className="audit-search-box">
          <Search className="audit-search-icon" size={16} />
          <input
            type="text"
            className="audit-search-input"
            placeholder="Search by item, user, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="auditLogSearchInput"
          />
        </div>

        {/* Filter Buttons Group */}
        <div className="audit-filter-group" role="group" aria-label="Filter audit records">
          <button
            type="button"
            className={`audit-filter-pill ${activeFilter === 'ALL' ? 'active-all' : ''}`}
            onClick={() => setActiveFilter('ALL')}
            id="auditFilterAll"
          >
            ALL
          </button>
          <button
            type="button"
            className={`audit-filter-pill ${activeFilter === 'ALERT' ? 'active-alert' : ''}`}
            onClick={() => setActiveFilter('ALERT')}
            id="auditFilterAlert"
          >
            ALERT
          </button>
          <button
            type="button"
            className={`audit-filter-pill ${activeFilter === 'WARNING' ? 'active-warning' : ''}`}
            onClick={() => setActiveFilter('WARNING')}
            id="auditFilterWarning"
          >
            WARNING
          </button>
          <button
            type="button"
            className={`audit-filter-pill ${activeFilter === 'SUCCESS' ? 'active-success' : ''}`}
            onClick={() => setActiveFilter('SUCCESS')}
            id="auditFilterSuccess"
          >
            SUCCESS
          </button>
          <button
            type="button"
            className={`audit-filter-pill ${activeFilter === 'INFO' ? 'active-info' : ''}`}
            onClick={() => setActiveFilter('INFO')}
            id="auditFilterInfo"
          >
            INFO
          </button>
        </div>
      </div>

      {/* Main Audit Records Table Card */}
      <div className="audit-table-card">
        <div className="audit-table-responsive">
          <table className="audit-custom-table" id="auditTrailTable">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>EVENT / ACTION</th>
                <th>ITEM AFFECTED</th>
                <th>INITIATOR / USER</th>
                <th>AGGREGATORS UPDATED</th>
                <th>LATENCY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} id={`audit-row-${record.id}`}>
                    <td className="audit-col-timestamp">{record.timestamp}</td>
                    <td className="audit-col-action">{record.action}</td>
                    <td className="audit-col-item">{record.item}</td>
                    <td className="audit-col-initiator">{record.initiator}</td>
                    <td className="audit-col-aggregators">{record.aggregators}</td>
                    <td className="audit-col-latency">{record.latency}</td>
                    <td>{renderStatusBadge(record.status, record.type)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="audit-empty-state">
                      <Search size={32} className="opacity-50" />
                      <div className="audit-empty-title">No Audit Records Found</div>
                      <p className="small mb-0">
                        No telemetry events match your search query &quot;{searchQuery}&quot; with filter &quot;{activeFilter}&quot;.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
