import React, { useState } from 'react';
import CustomerDiffComparison from './CustomerDiffComparison.jsx';
import {
  getDishImage,
  handleFoodImageError
} from '../../utils/foodImages.js';
import './CustomerView.css';

export default function CustomerView(props) {
  const items = props.items || [];
  const enabledItems = props.enabledItems || {};
  const disabledChannels = props.disabledChannels || {};
  const onAdjustPortions = props.onAdjustPortions;
  const onNavigateToInventory =
    props.onNavigateToInventory;

  const [selectedPlatform, setSelectedPlatform] =
    useState('platformA');

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [lastOrderNotice, setLastOrderNotice] =
    useState(null);

  const [orderHistory, setOrderHistory] =
    useState([]);

  function getItemId(item) {
    return item && (
      item._id ||
      item.id ||
      item.sku
    );
  }

  const platformConfig = {
    platformA: {
      name: 'Swiggy',
      themeColor: '#f97316',
      badgeBg: 'rgba(249, 115, 22, 0.15)',
      badgeBorder: 'rgba(249, 115, 22, 0.35)',
      eta: '25-30 mins',
      rating: '4.8 ★ (2.4k+)',
      tagline: 'Delivering via Swiggy Food Dispatch'
    },

    platformB: {
      name: 'Zomato',
      themeColor: '#ef4444',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      badgeBorder: 'rgba(239, 68, 68, 0.35)',
      eta: '20-25 mins',
      rating: '4.9 ★ (3.1k+)',
      tagline: 'Live GPS Tracking & Zomato Gold'
    },

    platformC: {
      name: 'Direct Order (Burger Hub Online)',
      themeColor: '#10b981',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeBorder: 'rgba(16, 185, 129, 0.35)',
      eta: '15-20 mins',
      rating: '5.0 ★ (Direct)',
      tagline: 'Direct Kitchen Dispatch • Zero Commission'
    }
  };

  const currentPlatform =
    platformConfig[selectedPlatform];

  const categories = ['All'];

  items.forEach(function(item) {
    if (
      item.category &&
      !categories.includes(item.category)
    ) {
      categories.push(item.category);
    }
  });

  const filteredItems =
    items.filter(function(item) {
      if (selectedCategory === 'All') {
        return true;
      }

      return item.category === selectedCategory;
    });

  function getDishStatus(item) {
    const itemId = getItemId(item);

    const isMasterOn =
      enabledItems[itemId] !== undefined
        ? enabledItems[itemId]
        : item.masterEnabled !== false;

    const channelKey =
      itemId + '_' + selectedPlatform;

    const enabledField =
      selectedPlatform === 'platformA'
        ? 'platformAEnabled'
        : selectedPlatform === 'platformB'
          ? 'platformBEnabled'
          : 'platformCEnabled';

    const isDelisted =
      !!disabledChannels[channelKey] ||
      item[enabledField] === false;

    const portions =
      Number(item[selectedPlatform]) || 0;

    if (!isMasterOn) {
      return {
        available: false,
        reason: 'Master Switch Off',
        label: 'Kitchen Unavailable',
        portions: portions,
        statusType: 'master-off'
      };
    }

    if (isDelisted) {
      return {
        available: false,
        reason:
          'Delisted on ' +
          currentPlatform.name,
        label: 'Delisted (Ghost Protection)',
        portions: portions,
        statusType: 'delisted'
      };
    }

    if (portions <= 0) {
      return {
        available: false,
        reason: 'Out of Stock',
        label: 'Sold Out',
        portions: 0,
        statusType: 'out-of-stock'
      };
    }

    if (portions === 1) {
      return {
        available: true,
        reason: 'Critical Stock',
        label: 'Only 1 left!',
        portions: portions,
        statusType: 'low-stock'
      };
    }

    return {
      available: true,
      reason: 'In Stock',
      label: portions + ' available',
      portions: portions,
      statusType: 'available'
    };
  }

  function handlePlaceMockOrder(item) {
    const status = getDishStatus(item);

    if (
      !status.available ||
      status.portions <= 0
    ) {
      return;
    }

    const itemId = getItemId(item);

    if (!itemId) {
      console.error(
        'Mock order failed: item ID not found.',
        item
      );
      return;
    }

    if (onAdjustPortions) {
      onAdjustPortions(
        itemId,
        selectedPlatform,
        -1
      );
    }

    const orderRecord = {
      id: Date.now(),
      dishName: item.name,
      platform: currentPlatform.name,
      time: new Date().toLocaleTimeString(),
      remaining: status.portions - 1
    };

    setLastOrderNotice(
      'Placed mock order for 1x "' +
        item.name +
        '" on ' +
        currentPlatform.name +
        '! 1 portion deducted from live kitchen stock.'
    );

    setOrderHistory(function(prev) {
      return [
        orderRecord,
        ...prev.slice(0, 7)
      ];
    });

    setTimeout(function() {
      setLastOrderNotice(null);
    }, 4500);
  }

  const availableCount =
    items.filter(function(item) {
      return getDishStatus(item).available;
    }).length;

  return (
    <div
      id="customer-storefront"
      className="customer-view-wrapper container-fluid px-0"
    >
      <div className="mock-sim-banner card bg-dark border-secondary p-3 p-md-4 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg-8">
            <div className="mock-live-indicator mb-2">
              <span className="mock-pulse-dot"></span>
              <span>
                CUSTOMER-FACING APP SIMULATION
              </span>
            </div>

            <h2 className="mock-sim-title mb-2">
              Customer View (Mock Delivery)
            </h2>

            <p className="mock-sim-desc mb-0">
              Test and preview exactly what customers
              see on delivery aggregator platforms.
              Click <strong>"Mock Order"</strong> to
              simulate consumer orders and observe
              live kitchen stock deductions and
              automated ghost-order protection.
            </p>
          </div>

          <div className="col-12 col-lg-4 d-flex justify-content-start justify-content-lg-end">
            <button
              type="button"
              className="btn-switch-to-inventory text-nowrap"
              onClick={onNavigateToInventory}
            >
              Open Kitchen Inventory &rarr;
            </button>
          </div>
        </div>
      </div>

      <CustomerDiffComparison />

      {lastOrderNotice && (
        <div className="mock-order-toast">
          <div className="toast-icon">⚡</div>

          <div className="toast-body">
            <strong>
              Mock Order Successful!
            </strong>

            <p>
              {lastOrderNotice}
            </p>
          </div>
        </div>
      )}

      <div className="mock-platform-switcher row g-2 mb-3">
        <div className="col-12 col-sm-4">
          <button
            type="button"
            className={
              'platform-tab-btn tab-swiggy w-100 ' +
              (
                selectedPlatform === 'platformA'
                  ? 'active'
                  : ''
              )
            }
            onClick={function() {
              setSelectedPlatform(
                'platformA'
              );
            }}
          >
            <span className="platform-icon-dot dot-swiggy"></span>

            <span className="platform-tab-title">
              Swiggy Mock App
            </span>

            <span className="platform-tab-eta">
              25-30m
            </span>
          </button>
        </div>

        <div className="col-12 col-sm-4">
          <button
            type="button"
            className={
              'platform-tab-btn tab-zomato w-100 ' +
              (
                selectedPlatform === 'platformB'
                  ? 'active'
                  : ''
              )
            }
            onClick={function() {
              setSelectedPlatform(
                'platformB'
              );
            }}
          >
            <span className="platform-icon-dot dot-zomato"></span>

            <span className="platform-tab-title">
              Zomato Mock App
            </span>

            <span className="platform-tab-eta">
              20-25m
            </span>
          </button>
        </div>

        <div className="col-12 col-sm-4">
          <button
            type="button"
            className={
              'platform-tab-btn tab-direct w-100 ' +
              (
                selectedPlatform === 'platformC'
                  ? 'active'
                  : ''
              )
            }
            onClick={function() {
              setSelectedPlatform(
                'platformC'
              );
            }}
          >
            <span className="platform-icon-dot dot-direct"></span>

            <span className="platform-tab-title">
              Direct Store App
            </span>

            <span className="platform-tab-eta">
              15-20m
            </span>
          </button>
        </div>
      </div>

      <div className="mock-app-frame card p-3 p-md-4 mb-4">
        <div
          className="mock-store-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3 pb-3 border-bottom"
          style={{
            borderColor:
              currentPlatform.badgeBorder
          }}
        >
          <div className="mock-store-info">
            <div
              className="mock-store-badge mb-2"
              style={{
                backgroundColor:
                  currentPlatform.badgeBg,
                color:
                  currentPlatform.themeColor,
                borderColor:
                  currentPlatform.badgeBorder
              }}
            >
              {
                currentPlatform.name
              }{' '}
              Live Storefront
            </div>

            <h3 className="mock-restaurant-name mb-1">
              Burger Hub &bull; Gourmet Burgers &amp;
              Sides
            </h3>

            <div className="mock-store-meta d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="store-rating">
                {currentPlatform.rating}
              </span>

              <span className="meta-separator">
                &bull;
              </span>

              <span className="store-eta">
                {currentPlatform.eta} delivery
              </span>

              <span className="meta-separator">
                &bull;
              </span>

              <span className="store-stock-count">
                {availableCount} of {items.length}{' '}
                items in stock
              </span>
            </div>

            <p className="mock-tagline mb-0">
              {currentPlatform.tagline}
            </p>
          </div>

          <div className="mock-channel-status-pill align-self-start align-self-md-center">
            <span
              className="mock-status-circle"
              style={{
                backgroundColor:
                  currentPlatform.themeColor
              }}
            ></span>

            <span>
              Channel Sync:{' '}
              <strong>LIVE</strong>
            </span>
          </div>
        </div>

        <div className="mock-category-bar mb-3">
          <span className="category-bar-label">
            Menu Sections:
          </span>

          <div className="category-pills-list d-flex flex-wrap gap-2">
            {categories.map(function(cat) {
              return (
                <button
                  key={cat}
                  type="button"
                  className={
                    'category-pill ' +
                    (
                      selectedCategory === cat
                        ? 'active'
                        : ''
                    )
                  }
                  onClick={function() {
                    setSelectedCategory(cat);
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mock-dishes-grid row g-3">
          {filteredItems.map(function(item) {
            const status =
              getDishStatus(item);

            const price = 249;
            const itemId =
              getItemId(item);

            return (
              <div
                key={itemId}
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
              >
                <div
                  className={
                    'mock-dish-card h-100 d-flex flex-column justify-content-between ' +
                    (
                      !status.available
                        ? 'card-unavailable'
                        : ''
                    ) +
                    (
                      status.statusType ===
                      'low-stock'
                        ? 'card-low-stock'
                        : ''
                    )
                  }
                >
                  <div>
                    <div
                      className="customer-dish-img-container position-relative rounded overflow-hidden mb-3 border"
                      style={{
                        height: '145px'
                      }}
                    >
                      <img
                        src={getDishImage(item)}
                        alt={item.name}
                        className={
                          'w-100 h-100 object-fit-cover ' +
                          (
                            !status.available
                              ? 'opacity-50'
                              : ''
                          )
                        }
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={function(e) {
                          handleFoodImageError(
                            e,
                            item.category
                          );
                        }}
                      />

                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="dish-category-tag">
                          {item.category ||
                            'Special'}
                        </span>
                      </div>

                      <div className="position-absolute top-0 end-0 m-2">
                        <span
                          className="dish-sku-tag px-1 py-0.5 rounded"
                          style={{
                            fontSize: '10px'
                          }}
                        >
                          {item.sku}
                        </span>
                      </div>

                      {!status.available ? (
                        <div className="position-absolute inset-0 w-100 h-100 top-0 start-0 d-flex flex-column align-items-center justify-content-center customer-sold-out-overlay text-center p-2">
                          <span className="badge bg-danger text-uppercase fw-bold tracking-wider px-2 py-1 shadow mb-1">
                            Sold Out / 86'd
                          </span>

                          <span
                            className="text-secondary small fw-medium"
                            style={{
                              fontSize: '11px'
                            }}
                          >
                            Auto-Delisted (Ghost
                            Protection)
                          </span>
                        </div>
                      ) : status.statusType ===
                        'low-stock' ? (
                        <div className="position-absolute bottom-0 start-0 m-2">
                          <span className="badge bg-warning text-dark fw-bold shadow-sm">
                            Only{' '}
                            {status.portions}{' '}
                            left!
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="dish-card-body">
                      <h4 className="dish-name mb-2">
                        {item.name}
                      </h4>

                      <div className="dish-pricing-row d-flex justify-content-between align-items-center mb-2">
                        <span className="dish-price">
                          &#8377;{price}
                        </span>

                        <span
                          className={
                            'dish-status-badge badge-' +
                            status.statusType
                          }
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="dish-stock-info">
                        {status.available ? (
                          <span className="stock-info-text in-stock-text">
                            Kitchen Stock:{' '}
                            <strong>
                              {status.portions}
                            </strong>{' '}
                            portion
                            {status.portions > 1
                              ? 's'
                              : ''}{' '}
                            allocated
                          </span>
                        ) : (
                          <span className="stock-info-text out-stock-text">
                            Protected:{' '}
                            {status.reason}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="dish-card-footer mt-3">
                    {status.available ? (
                      <button
                        type="button"
                        className="btn-mock-order w-100"
                        style={{
                          backgroundColor:
                            currentPlatform.themeColor
                        }}
                        onClick={function() {
                          handlePlaceMockOrder(
                            item
                          );
                        }}
                        title={
                          'Place simulated order for 1x ' +
                          item.name
                        }
                      >
                        <span className="cart-icon me-1">
                          +
                        </span>

                        <span>
                          Mock Order (1 Portion)
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-mock-disabled w-100"
                        disabled
                        title="Item is sold out or delisted to prevent ghost orders"
                      >
                        Sold Out / Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {orderHistory.length > 0 && (
        <div className="mock-orders-log-card">
          <div className="log-card-header">
            <h4 className="log-card-title">
              Recent Mock Order Telemetry
            </h4>

            <span className="log-badge">
              {orderHistory.length}{' '}
              orders simulated
            </span>
          </div>

          <div className="log-items-list">
            {orderHistory.map(function(order) {
              return (
                <div
                  key={order.id}
                  className="log-item-row"
                >
                  <div className="log-left">
                    <span className="log-dot"></span>

                    <span className="log-dish-name">
                      {order.dishName}
                    </span>

                    <span className="log-platform-tag">
                      {order.platform}
                    </span>
                  </div>

                  <div className="log-right">
                    <span className="log-remaining">
                      {order.remaining > 0
                        ? order.remaining +
                          ' portions left in kitchen'
                        : 'Stock reached 0 (Sold out!)'}
                    </span>

                    <span className="log-time">
                      {order.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}