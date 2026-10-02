import React, { useState } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Receipt,
  Percent,
  ArrowUpRight,
  Star,
  BarChart2,
  TrendingDown,
  Sparkles,
  Zap,
  Sliders,
  DollarSign,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import './RoiView.css';

export default function RoiView({ dishes = [], lowStockCount = 0 }) {
  const [dailyOrders, setDailyOrders] = useState(140);
  const [penaltyPerCancel, setPenaltyPerCancel] = useState(300); // ₹300 average aggregator penalty

  // Estimated cancellation rate avoided by live channel delisting
  const ghostOrderRateAvoided = 0.038;
  const dailyGhostOrdersAvoided = Math.round(dailyOrders * ghostOrderRateAvoided * 10) / 10;
  const monthlyGhostOrdersAvoided = Math.round(dailyGhostOrdersAvoided * 30);
  const monthlySavings = Math.round(dailyGhostOrdersAvoided * penaltyPerCancel * 30);
  const annualSavings = monthlySavings * 12;
  const annualFoodSaved = Math.round(annualSavings * 0.42); // ~42% ingredient cost
  const annualFinesSaved = annualSavings - annualFoodSaved; // direct platform penalty tariffs

  return (
    <div className="roi-page-container container-fluid px-0 py-2">
      {/* Top Section matching screenshot "Risk Mitigation & Financial ROI" */}
      <div className="roi-hero-container mb-4">
        {/* Top Tag & Indicator */}
        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
          <span className="roi-tag-pill">
            DEFENSE TELEMETRY &amp; ROI
          </span>
          <span className="text-secondary">&bull;</span>
          <span className="roi-tag-sub">
            Live Algorithm Tracking
          </span>
        </div>

        {/* Main Title Row & Right Status Badges */}
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-2">
          <div>
            <h1 className="roi-main-title mb-1">
              Risk Mitigation &amp; Financial ROI{' '}
              <span className="roi-title-unit">/ Cloud Unit #04</span>
            </h1>
            <p className="roi-main-desc mb-0">
              Real-time financial telemetry measuring zero-ghost order enforcement, instant aggregator kill-switches, and automated menu reactivation.
            </p>
          </div>

          {/* Right Status Badges matching screenshot */}
          <div className="d-flex align-items-center gap-2 flex-wrap flex-shrink-0">
            {/* Ghost Shield: ACTIVE badge */}
            <div className="roi-status-badge">
              <ShieldCheck size={16} className="text-success" />
              <span>
                <span className="text-secondary opacity-75">Ghost Shield:</span>{' '}
                <strong className="text-success fw-bold">ACTIVE</strong>
              </span>
            </div>

            {/* Window: Today (Peak Rush) badge */}
            <div className="roi-window-badge">
              <div>
                <span className="text-secondary">Window:</span>{' '}
                <span className="text-light fw-bold">Today</span>
              </div>
              <div className="text-secondary" style={{ fontSize: '10.5px' }}>
                (Peak Rush)
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Horizontal Divider */}
        <hr className="my-4 border-secondary border-opacity-25" />

        {/* 4 Telemetry Metric Cards matching screenshot */}
        <div className="row g-3">
          {/* Card 1: GHOST ORDERS PREVENTED */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="roi-metric-card">
              <div className="roi-card-header">
                <span className="roi-card-title">GHOST ORDERS PREVENTED</span>
                <div className="roi-card-icon-wrap green">
                  <ShieldCheck size={16} />
                </div>
              </div>

              <div className="roi-metric-value-row">
                <span className="roi-metric-number">24</span>
                <span className="roi-metric-unit">Today</span>
              </div>

              <div className="roi-metric-subtext text-success d-flex align-items-center gap-1">
                <ArrowUpRight size={14} />
                <span>+8 vs yesterday peak</span>
              </div>

              <div className="roi-card-footer-status text-secondary">
                Sync Rejection Latency: <span className="text-light">41ms avg</span>
              </div>
            </div>
          </div>

          {/* Card 2: CANCELLATIONS AVOIDED */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="roi-metric-card">
              <div className="roi-card-header">
                <span className="roi-card-title">CANCELLATIONS AVOIDED</span>
                <div className="roi-card-icon-wrap amber">
                  <RotateCcw size={15} />
                </div>
              </div>

              <div className="roi-metric-value-row">
                <span className="roi-metric-number">18</span>
                <span className="roi-metric-unit">Orders</span>
              </div>

              <div className="roi-metric-subtext text-warning d-flex align-items-center gap-1">
                <span>Protects store rating at 4.9</span>
                <Star size={13} className="text-warning fill-warning" style={{ fill: '#fbbf24' }} />
              </div>

              <div className="roi-card-footer-status text-secondary">
                Platform Threshold: <span className="text-success font-monospace">Safe (&lt; 0.5%)</span>
              </div>
            </div>
          </div>

          {/* Card 3: PENALTY SURCHARGE SAVED */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="roi-metric-card">
              <div className="roi-card-header">
                <span className="roi-card-title">PENALTY SURCHARGE SAVED</span>
                <div className="roi-card-icon-wrap green">
                  <Receipt size={15} />
                </div>
              </div>

              <div className="roi-metric-value-row">
                <span className="roi-metric-number highlight-green">₹3,600</span>
                <div className="roi-metric-unit-stacked">
                  <span>Direct</span>
                  <span>Cash</span>
                </div>
              </div>

              <div className="roi-metric-subtext text-secondary">
                Based on avg ₹200/order platform fine
              </div>

              <div className="roi-card-footer-status d-flex align-items-center justify-content-between text-secondary">
                <span>Dispute Prevention:</span>
                <span className="text-success font-monospace fw-bold">100% Zero-Fine</span>
              </div>
            </div>
          </div>

          {/* Card 4: ORDERS RETAINED */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="roi-metric-card">
              <div className="roi-card-header">
                <span className="roi-card-title">ORDERS RETAINED</span>
                <div className="roi-card-icon-wrap amber">
                  <Percent size={15} />
                </div>
              </div>

              <div className="roi-metric-value-row">
                <span className="roi-metric-number">31</span>
                <span className="roi-metric-unit">Substituted</span>
              </div>

              <div className="roi-metric-subtext text-success">
                ₹8,450 revenue preserved
              </div>

              <div className="roi-card-footer-status d-flex align-items-center justify-content-between text-secondary">
                <span>Cart Dropoff Shield:</span>
                <span className="text-success font-monospace fw-bold">+92.4% Retention</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loss Drift Benchmark Component matching user's screenshot */}
      <div className="benchmark-container mb-4">
        {/* Header */}
        <div className="benchmark-header">
          <div className="benchmark-title-wrap">
            <h2 className="benchmark-title mb-1">
              <TrendingDown size={22} className="text-success" />
              <span>Loss Drift Benchmark</span>
            </h2>
            <p className="benchmark-subtitle mb-0">
              Empirical comparison before and after deploying StockSync sub-second multi-channel kill switch.
            </p>
          </div>

          <div className="benchmark-badge flex-shrink-0">
            <div>Monthly</div>
            <div>Projection</div>
          </div>
        </div>

        {/* 1. Without StockSync (Red Card) */}
        <div className="benchmark-row-card-red">
          <div className="benchmark-row-header-red">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '10px' }}>●</span>
              <span>Without StockSync</span>
            </div>
            <span>8.2% Ghost Fails</span>
          </div>

          <div className="benchmark-bar-track-red">
            <div className="benchmark-bar-fill-red"></div>
            <div className="benchmark-bar-text-red">
              ₹42,000 / mo penalties
            </div>
          </div>

          <div className="benchmark-row-footer-red">
            <span className="benchmark-footer-status-red">
              Platform Rank: Demoted (Algo throttled)
            </span>
            <span className="benchmark-footer-rating-amber">
              3.8★ Cust. Rating
            </span>
          </div>
        </div>

        {/* 2. With StockSync Telemetry (Green Card) */}
        <div className="benchmark-row-card-green">
          <div className="benchmark-row-header-green">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '10px' }}>●</span>
              <span>With StockSync Telemetry</span>
            </div>
            <span>0.2% Defended</span>
          </div>

          <div className="benchmark-bar-track-green">
            <div className="benchmark-badge-zero">₹0</div>
            <div className="benchmark-bar-text-green">
              Penalties Surcharged
            </div>
          </div>

          <div className="benchmark-row-footer-green">
            <span className="benchmark-footer-priority-green">
              Gold Partner Priority
            </span>
            <span className="benchmark-footer-rating-green">
              4.9★ Cust. Rating
            </span>
          </div>
        </div>

        {/* 3. Two Bottom Metric Cards (NET SAVED / QUARTER & ALGORITHM BOOST) */}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="benchmark-bottom-card">
              <div className="benchmark-bottom-label">
                NET SAVED / QUARTER
              </div>
              <div className="benchmark-bottom-value">
                ₹1,26,000
              </div>
              <div className="benchmark-bottom-subtext">
                Direct fine mitigation
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="benchmark-bottom-card">
              <div className="benchmark-bottom-label">
                ALGORITHM BOOST
              </div>
              <div className="benchmark-bottom-value">
                +18.4%
              </div>
              <div className="benchmark-bottom-subtext">
                Organic impressions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Penalty ROI Calculator and Policy Matrix */}
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="simulator-main-card h-100">
            {/* Simulator Header */}
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <div className="simulator-icon-box">
                  <Calculator className="text-warning" size={18} />
                </div>
                <h3 className="simulator-card-title mb-0">Interactive Savings Simulator</h3>
              </div>
              <span className="simulator-live-tag">
                <span className="simulator-live-dot"></span>
                Real-Time Telemetry
              </span>
            </div>

            <p className="simulator-card-desc mb-4">
              Configure your average store throughput and cancellation penalty tariffs to simulate the return on automated telemetry delisting.
            </p>

            {/* Slider 1: Daily Orders */}
            <div className="simulator-control-group mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label htmlFor="dailyOrdersInput" className="simulator-field-label mb-0">
                  Average Daily Delivery Orders (All Channels)
                </label>
                <span className="simulator-val-pill cyan">{dailyOrders} orders/day</span>
              </div>
              <div className="simulator-slider-wrap">
                <input
                  id="dailyOrdersInput"
                  type="range"
                  className="form-range custom-simulator-range"
                  min="20"
                  max="500"
                  step="10"
                  value={dailyOrders}
                  onChange={(e) => setDailyOrders(Number(e.target.value))}
                />
              </div>
              <div className="simulator-scale-bounds d-flex justify-content-between text-secondary">
                <span>Min: 20 orders</span>
                <span>Max: 500 orders</span>
              </div>
              {/* Presets */}
              <div className="simulator-presets-row d-flex gap-1.5 mt-2 flex-wrap">
                <span className="simulator-presets-label">Presets:</span>
                {[
                  { label: '60 (Boutique)', val: 60 },
                  { label: '140 (Standard)', val: 140 },
                  { label: '260 (Busy Hub)', val: 260 },
                  { label: '450 (Enterprise)', val: 450 }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    className={`simulator-preset-btn ${dailyOrders === preset.val ? 'active' : ''}`}
                    onClick={() => setDailyOrders(preset.val)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2: Penalty per Cancel */}
            <div className="simulator-control-group mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label htmlFor="penaltyInput" className="simulator-field-label mb-0">
                  Average Penalty per Ghost Cancellation (Aggregator Fines + Lost Food)
                </label>
                <span className="simulator-val-pill amber">₹{penaltyPerCancel}</span>
              </div>
              <div className="simulator-slider-wrap">
                <input
                  id="penaltyInput"
                  type="range"
                  className="form-range custom-simulator-range range-amber"
                  min="100"
                  max="800"
                  step="25"
                  value={penaltyPerCancel}
                  onChange={(e) => setPenaltyPerCancel(Number(e.target.value))}
                />
              </div>
              <div className="simulator-scale-bounds d-flex justify-content-between text-secondary">
                <span>Min: ₹100</span>
                <span>Max: ₹800</span>
              </div>
              {/* Presets */}
              <div className="simulator-presets-row d-flex gap-1.5 mt-2 flex-wrap">
                <span className="simulator-presets-label">Presets:</span>
                {[
                  { label: '₹150 (Economy)', val: 150 },
                  { label: '₹300 (Standard SLA)', val: 300 },
                  { label: '₹500 (Combos)', val: 500 },
                  { label: '₹750 (High Basket)', val: 750 }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    className={`simulator-preset-btn ${penaltyPerCancel === preset.val ? 'active' : ''}`}
                    onClick={() => setPenaltyPerCancel(preset.val)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Display Panel */}
            <div className="simulator-results-panel mt-auto">
              <div className="simulator-hero-result d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-3">
                <div>
                  <span className="simulator-hero-label d-flex align-items-center gap-1.5">
                    <Sparkles size={13} className="text-success" />
                    ANNUAL PROJECTED ROI PROTECTION:
                  </span>
                  <div className="simulator-hero-value-line d-flex align-items-baseline gap-2">
                    <span className="simulator-hero-number">₹{annualSavings.toLocaleString()}</span>
                    <span className="simulator-hero-cadence">/ year</span>
                  </div>
                  <span className="simulator-hero-subtext">
                    Defends ~{monthlyGhostOrdersAvoided} orders every month from penalty deductions
                  </span>
                </div>
                <div className="simulator-return-col text-sm-end">
                  <div className="simulator-return-pill">
                    <Zap size={14} className="text-warning flex-shrink-0" />
                    <span>+480% Net Return</span>
                  </div>
                  <span className="simulator-return-sub d-block mt-1">SLA Defense Benchmark</span>
                </div>
              </div>

              {/* 3 Metric Mini Cards */}
              <div className="simulator-breakdown-grid">
                <div className="simulator-mini-stat">
                  <span className="simulator-mini-label">Daily Saved</span>
                  <span className="simulator-mini-val text-light">{dailyGhostOrdersAvoided} <span className="simulator-mini-unit">orders</span></span>
                  <span className="simulator-mini-foot text-success">Zero penalty breach</span>
                </div>
                <div className="simulator-mini-stat">
                  <span className="simulator-mini-label">Monthly Saved</span>
                  <span className="simulator-mini-val text-success">₹{monthlySavings.toLocaleString()}</span>
                  <span className="simulator-mini-foot text-secondary">Retained cashflow</span>
                </div>
                <div className="simulator-mini-stat">
                  <span className="simulator-mini-label">Direct Fines Blocked</span>
                  <span className="simulator-mini-val text-warning">₹{annualFinesSaved.toLocaleString()}</span>
                  <span className="simulator-mini-foot text-secondary">Aggregator tariffs</span>
                </div>
              </div>

              {/* Bottom Calibrated Note */}
              <div className="simulator-footnote pt-2.5 mt-2.5 d-flex align-items-center gap-2">
                <CheckCircle2 size={13} className="text-success flex-shrink-0" />
                <span>
                  Calibrated for instant aggregator kill-switches avoiding 3.8% standard ghost cancellation tariffs.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="simulator-main-card h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="simulator-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <ShieldCheck className="text-success" size={18} />
              </div>
              <h3 className="simulator-card-title mb-0">Aggregator Policy Matrix</h3>
            </div>

            <p className="simulator-card-desc mb-3">
              Current enforcement guidelines applied automatically by live inventory telemetry.
            </p>

            <div className="d-flex flex-column gap-3 mt-auto">
              <div className="p-3 rounded-3" style={{ background: '#050d1a', border: '1px solid #142844' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold text-warning small">Swiggy Merchant SLA</span>
                  <span className="badge bg-warning bg-opacity-15 text-warning border border-warning border-opacity-25 font-monospace" style={{ fontSize: '10px' }}>
                    Strict 100% Fine
                  </span>
                </div>
                <p className="text-secondary small mb-0" style={{ fontSize: '12px', lineHeight: '1.45' }}>
                  Orders cancelled by kitchen incur 100% item cost deduction plus merchant visibility demotion for 48 hours.
                </p>
              </div>

              <div className="p-3 rounded-3" style={{ background: '#050d1a', border: '1px solid #142844' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold text-danger small">Zomato Rejection Penalty</span>
                  <span className="badge bg-danger bg-opacity-15 text-danger border border-danger border-opacity-25 font-monospace" style={{ fontSize: '10px' }}>
                    ₹250 Auto-Fine
                  </span>
                </div>
                <p className="text-secondary small mb-0" style={{ fontSize: '12px', lineHeight: '1.45' }}>
                  Auto-charges ₹250 flat fee per unfulfilled accepted ticket after 2-minute confirmation window.
                </p>
              </div>

              <div className="p-3 rounded-3" style={{ background: '#050d1a', border: '1px solid #142844' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold text-success small">Direct Brand Storefront</span>
                  <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25 font-monospace" style={{ fontSize: '10px' }}>
                    Customer Retention
                  </span>
                </div>
                <p className="text-secondary small mb-0" style={{ fontSize: '12px', lineHeight: '1.45' }}>
                  Customer churn defense: 68% of direct diners never re-order if their initial delivery ticket is cancelled due to out-of-stock items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
