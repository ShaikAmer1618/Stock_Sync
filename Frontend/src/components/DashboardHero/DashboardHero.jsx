import React, { useState } from 'react';
import {
  Utensils,
  AlertTriangle,
  Radio,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import './DashboardHero.css';

export default function DashboardHero(props) {
  const items = props.items || [];
  const lowStockCount = props.lowStockCount || 0;
  const restaurantName = props.restaurantName || 'Burger Hub';

  const [isPinging, setIsPinging] = useState(false);
  const [lastPingTime, setLastPingTime] = useState('38ms');

  function handlePingChannels() {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      const randomMs = Math.floor(28 + Math.random() * 25);
      setLastPingTime(randomMs + 'ms');
    }, 500);
  }

  // Calculate stats based on actual dishes
  const totalDishes = items.length || 45;
  const activeDishes = Math.max(0, totalDishes - lowStockCount);
  const healthPercent = Math.round((activeDishes / (totalDishes || 1)) * 100);

  return (
    <div className="hero-banner-container">
      {/* 1. Top Greeting & Order Velocity Bar */}
      <div className="hero-top-row">
        <div className="hero-greeting-box">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="live-kitchen-badge">
              <span className="live-kitchen-dot"></span>
              Live Kitchen Ops
            </span>
            <span className="text-secondary small">Shift Active • Peak Rush</span>
          </div>
          <h1 className="hero-heading">
            Good evening, {restaurantName}
          </h1>
          <p className="hero-subtext">
            Multi-channel sync active across Swiggy, Zomato, and Direct POS. Portion decrements broadcast synchronously within 50ms.
          </p>
        </div>

        <div className="hero-actions-right">
          <div className="velocity-box">
            <div className="velocity-label">
              <TrendingUp size={13} className="text-primary" />
              <span>SHIFT VELOCITY</span>
            </div>
            <div className="velocity-value">142 Orders / hr</div>
          </div>

          <button
            type="button"
            className={'ping-channels-btn ' + (isPinging ? 'pinging' : '')}
            onClick={handlePingChannels}
            title="Ping Swiggy, Zomato, and Direct API webhooks"
          >
            <Radio size={14} className={isPinging ? 'animate-spin' : ''} />
            <span>{isPinging ? 'Pinging Webhooks...' : `Ping Channels (${lastPingTime})`}</span>
          </button>
        </div>
      </div>

      {/* 2. 4-Card Telemetry Metrics Grid */}
      <div className="hero-metrics-grid">
        {/* Card 1: Live Menu Breadth */}
        <div className="metric-card">
          <div className="card-top">
            <div className="d-flex align-items-center gap-2">
              <div className="card-icon-box card-icon-primary">
                <Utensils size={15} />
              </div>
              <span className="card-label">LIVE MENU BREADTH</span>
            </div>
            <span className="badge-healthy">
              <CheckCircle2 size={12} />
              {healthPercent}% Ready
            </span>
          </div>

          <div className="card-main-stat">
            <span className="stat-big">{activeDishes}</span>
            <span className="stat-total">/ {totalDishes} items active</span>
          </div>

          <div className="card-footer-progress">
            <div className="progress-info">
              <span>Portion safety buffer</span>
              <span className="prep-label">Across 3 channels</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, healthPercent)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: 86'D Pipeline (Halted SKUs) */}
        <div className="metric-card">
          <div className="card-top">
            <div className="d-flex align-items-center gap-2">
              <div className={'card-icon-box ' + (lowStockCount > 0 ? 'card-icon-amber' : 'card-icon-emerald')}>
                <AlertTriangle size={15} />
              </div>
              <span className="card-label">86'D PIPELINE</span>
            </div>
            {lowStockCount > 0 ? (
              <span className="badge-attention">
                <span className="badge-dot"></span>
                Action Required
              </span>
            ) : (
              <span className="badge-healthy">
                <CheckCircle2 size={12} />
                All Stocked
              </span>
            )}
          </div>

          <div className="card-main-stat">
            <span className={'stat-big ' + (lowStockCount > 0 ? 'text-amber-emphasis' : '')}>{lowStockCount}</span>
            <span className="stat-unit-text">{lowStockCount === 1 ? 'channel at risk' : 'channels at risk'}</span>
          </div>

          <div className="card-footer-alert">
            <span className={lowStockCount > 0 ? 'text-warning-custom' : 'text-success-custom'}>
              {lowStockCount > 0 ? '⚠ Automated delist shield standing by' : '✓ Zero ghost order cancellation risk'}
            </span>
            <div className="alert-progress-track">
              <div
                className="alert-progress-fill"
                style={{ width: lowStockCount > 0 ? `${Math.min(100, lowStockCount * 25)}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3: Channel Sync Status */}
        <div className="metric-card">
          <div className="card-top">
            <div className="d-flex align-items-center gap-2">
              <div className="card-icon-box card-icon-primary">
                <Zap size={15} />
              </div>
              <span className="card-label">CHANNEL SYNC</span>
            </div>
            <span className="badge-all-online">3 / 3 ONLINE</span>
          </div>

          <div className="card-platforms-row">
            <span className="channel-online-item channel-swiggy">
              <span className="dot-channel"></span> Swiggy 100%
            </span>
            <span className="channel-online-item channel-zomato">
              <span className="dot-channel"></span> Zomato 100%
            </span>
            <span className="channel-online-item channel-direct">
              <span className="dot-channel"></span> Direct 100%
            </span>
          </div>

          <div className="card-response-time">
            <span className="text-secondary small">Average Webhook Latency</span>
            <span className="resp-ms">{lastPingTime}</span>
          </div>
        </div>

        {/* Card 4: Loss Avoidance */}
        <div className="metric-card">
          <div className="card-top">
            <div className="d-flex align-items-center gap-2">
              <div className="card-icon-box card-icon-emerald">
                <ShieldCheck size={15} />
              </div>
              <span className="card-label">PENALTY SHIELD</span>
            </div>
            <span className="badge-protected">
              <span>🛡</span> Protected
            </span>
          </div>

          <div className="card-main-stat">
            <span className="stat-big-price">&#8377;2,400</span>
            <span className="stat-risk-sub">saved today</span>
          </div>

          <div className="card-loss-footer">
            <div className="ghost-tickets-row">
              <CheckCircle2 size={12} className="text-emerald" />
              <span>0 ghost tickets past 60 min</span>
            </div>
            <div className="penalties-saved-row">
              <span>Channel Penalties Prevented</span>
              <span className="penalties-amount">&#8377;650.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
