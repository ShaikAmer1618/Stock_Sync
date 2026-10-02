import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  UtensilsCrossed,
  Smartphone,
  TrendingUp,
  History,
  Layers
} from 'lucide-react';
import './Header.css';

export default function Header({
  lowStockCount = 0,
  activeTab = 'master-dashboard',
  onSelectTab
}) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme toggle state (default: light)
  const [theme, setTheme] = useState(function() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stocksync-theme') || 'light';
    }
    return 'light';
  });

  useEffect(function() {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    try {
      localStorage.setItem('stocksync-theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(function(prev) {
      return prev === 'light' ? 'dark' : 'light';
    });
  }

  // Helper to check if a StockSync tab is active
  const isDashboardActive = activeTab === 'master-dashboard' || location.pathname === '/' || location.pathname === '/dashboard';
  const isInventoryActive = activeTab === 'live-kitchen-inventory' || location.pathname === '/inventory';
  const isChannelsActive = activeTab === 'customer-view' || location.pathname === '/customer';
  const isRoiActive = activeTab === 'roi' || location.pathname === '/roi';
  const isActivityLogsActive = activeTab === 'audit-log' || location.pathname === '/audit-log';

  function handleNav(tabId) {
    if (onSelectTab) {
      onSelectTab(tabId);
    }
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="stocksync-header sticky-top" id="mainHeader">
      <div className="stocksync-header-container">
        {/* Left: Brand Logo & Title */}
        <Link
          to="/"
          className="stocksync-brand-wrap text-decoration-none"
          onClick={() => handleNav('master-dashboard')}
          id="header-brand-stocksync"
        >
          <div className="stocksync-logo-badge">
            <Layers size={18} className="text-white" />
          </div>
          <div className="stocksync-brand-text">
            <div className="d-flex align-items-center gap-1.5">
              <span className="stocksync-brand-name">StockSync</span>
              <span className="stocksync-version-pill">v2.4 Live</span>
            </div>
            <div className="stocksync-brand-tagline">One update. Every channel.</div>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar */}
        <nav className="stocksync-center-nav d-none d-lg-flex" aria-label="StockSync Navigation">
          <NavLink
            to="/"
            className={`stocksync-nav-link ${isDashboardActive ? 'active' : ''}`}
            onClick={() => handleNav('master-dashboard')}
            id="nav-link-dashboard"
          >
            <LayoutDashboard size={14} />
            <span>Master Dashboard</span>
          </NavLink>

          <NavLink
            to="/inventory"
            className={`stocksync-nav-link ${isInventoryActive ? 'active' : ''}`}
            onClick={() => handleNav('live-kitchen-inventory')}
            id="nav-link-inventory"
          >
            <UtensilsCrossed size={14} />
            <span>Kitchen Inventory</span>
            {lowStockCount > 0 && (
              <span className="stocksync-nav-alert-badge" title={`${lowStockCount} items need attention`}>
                {lowStockCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/customer"
            className={`stocksync-nav-link ${isChannelsActive ? 'active' : ''}`}
            onClick={() => handleNav('customer-view')}
            id="nav-link-channels"
          >
            <Smartphone size={14} />
            <span>Customer View</span>
          </NavLink>

          <NavLink
            to="/roi"
            className={`stocksync-nav-link ${isRoiActive ? 'active' : ''}`}
            onClick={() => handleNav('roi')}
            id="nav-link-roi"
          >
            <TrendingUp size={14} />
            <span>Risk &amp; ROI</span>
          </NavLink>

          <NavLink
            to="/audit-log"
            className={`stocksync-nav-link ${isActivityLogsActive ? 'active' : ''}`}
            onClick={() => handleNav('audit-log')}
            id="nav-link-activity-logs"
          >
            <History size={14} />
            <span>Audit Log</span>
          </NavLink>
        </nav>

        {/* Right Section: Actions & Mobile Menu Toggle */}
        <div className="stocksync-header-right d-flex align-items-center gap-2">
          {/* Live Sync Pulse */}
          <div className="stocksync-system-live-pill d-none d-sm-inline-flex" title="Swiggy, Zomato, and Direct API live sync active">
            <span className="system-live-dot"></span>
            <span className="system-live-text">Live Sync</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle visual theme"
            id="theme-toggle-btn"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`stocksync-mobile-hamburger d-flex d-lg-none ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            id="mobileNavbarToggle"
          >
            {isMobileMenuOpen ? (
              <X size={20} className="stocksync-hamburger-icon" />
            ) : (
              <Menu size={20} className="stocksync-hamburger-icon" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="stocksync-mobile-menu" id="mobileNavDropdown">
          <div className="stocksync-mobile-menu-inner p-3">
            <div className="mb-2 pb-2 border-bottom d-flex align-items-center justify-content-between">
              <span className="text-secondary small fw-bold text-uppercase">Navigation</span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle small">
                3 Channels Active
              </span>
            </div>

            <NavLink
              to="/"
              className={`stocksync-mobile-nav-item ${isDashboardActive ? 'active' : ''}`}
              onClick={() => handleNav('master-dashboard')}
              id="mobile-nav-dashboard"
            >
              <LayoutDashboard size={16} />
              <span>Master Dashboard</span>
            </NavLink>

            <NavLink
              to="/inventory"
              className={`stocksync-mobile-nav-item ${isInventoryActive ? 'active' : ''}`}
              onClick={() => handleNav('live-kitchen-inventory')}
              id="mobile-nav-inventory"
            >
              <UtensilsCrossed size={16} />
              <span>Kitchen Inventory</span>
              {lowStockCount > 0 && (
                <span className="badge bg-danger ms-auto">{lowStockCount}</span>
              )}
            </NavLink>

            <NavLink
              to="/customer"
              className={`stocksync-mobile-nav-item ${isChannelsActive ? 'active' : ''}`}
              onClick={() => handleNav('customer-view')}
              id="mobile-nav-channels"
            >
              <Smartphone size={16} />
              <span>Customer View (Swiggy / Zomato)</span>
            </NavLink>

            <NavLink
              to="/roi"
              className={`stocksync-mobile-nav-item ${isRoiActive ? 'active' : ''}`}
              onClick={() => handleNav('roi')}
              id="mobile-nav-roi"
            >
              <TrendingUp size={16} />
              <span>Risk &amp; Penalty ROI</span>
            </NavLink>

            <NavLink
              to="/audit-log"
              className={`stocksync-mobile-nav-item ${isActivityLogsActive ? 'active' : ''}`}
              onClick={() => handleNav('audit-log')}
              id="mobile-nav-audit-log"
            >
              <History size={16} />
              <span>Activity Audit Log</span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
