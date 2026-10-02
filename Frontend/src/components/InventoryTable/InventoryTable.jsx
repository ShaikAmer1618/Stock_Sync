import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  LayoutGrid,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import {
  getDishImage,
  handleFoodImageError
} from '../../utils/foodImages.js';
import './InventoryTable.css';

export default function InventoryTable(props) {
  const items = props.items || [];
  const enabledItems = props.enabledItems || {};
  const disabledChannels = props.disabledChannels || {};

  const onToggleMaster = props.onToggleMaster;
  const onToggleChannel = props.onToggleChannel;
  const onAdjustPortions = props.onAdjustPortions;
  const onOpenAddDish = props.onOpenAddDish;
  const onDelistDishAll = props.onDelistDishAll;

  function getItemId(item) {
    return item && (item._id || item.id || item.sku);
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState('All');
  const [stockFilter, setStockFilter] =
    useState('all');

  const [viewMode, setViewMode] = useState(function() {
    if (
      typeof window !== 'undefined' &&
      window.innerWidth <= 768
    ) {
      return 'cards';
    }

    return 'table';
  });

  const [userOverridden, setUserOverridden] =
    useState(false);

  useEffect(
    function() {
      function handleResize() {
        if (!userOverridden) {
          if (window.innerWidth <= 768) {
            setViewMode('cards');
          } else {
            setViewMode('table');
          }
        }
      }

      window.addEventListener(
        'resize',
        handleResize
      );

      return function() {
        window.removeEventListener(
          'resize',
          handleResize
        );
      };
    },
    [userOverridden]
  );

  const categories = useMemo(
    function() {
      const categorySet = new Set(['All']);

      items.forEach(function(item) {
        if (item.category) {
          categorySet.add(item.category);
        }
      });

      return Array.from(categorySet);
    },
    [items]
  );

  function isItemMasterEnabled(itemId) {
    if (enabledItems[itemId] === undefined) {
      return true;
    }

    return enabledItems[itemId];
  }

  const filteredItems = useMemo(
    function() {
      return items.filter(function(item) {
        if (
          selectedCategory !== 'All' &&
          item.category !== selectedCategory
        ) {
          return false;
        }

        if (searchTerm.trim()) {
          const query =
            searchTerm.toLowerCase();

          const matchesName =
            item.name &&
            item.name
              .toLowerCase()
              .includes(query);

          const matchesSku =
            item.sku &&
            item.sku
              .toLowerCase()
              .includes(query);

          const matchesCategory =
            item.category &&
            item.category
              .toLowerCase()
              .includes(query);

          if (
            !matchesName &&
            !matchesSku &&
            !matchesCategory
          ) {
            return false;
          }
        }

        if (stockFilter === 'low') {
          const isLow =
            Number(item.platformA) < 2 ||
            Number(item.platformB) < 2 ||
            Number(item.platformC) < 2;

          if (!isLow) {
            return false;
          }
        }

        if (stockFilter === 'active') {
          if (
            !isItemMasterEnabled(
              getItemId(item)
            )
          ) {
            return false;
          }
        }

        return true;
      });
    },
    [
      items,
      selectedCategory,
      searchTerm,
      stockFilter,
      enabledItems
    ]
  );

  function renderPlatformCell(
    item,
    channelKey,
    channelName
  ) {
    const itemId = getItemId(item);

    const isMasterOn =
      isItemMasterEnabled(itemId);

    const channelDisableKey =
      itemId + '_' + channelKey;

    const isChannelDelisted =
      Boolean(
        disabledChannels[
          channelDisableKey
        ]
      );

    const units =
      Number(item[channelKey]) || 0;

    if (!isMasterOn) {
      return (
        <span
          className="channel-global-off-badge"
          title="Master item toggle is OFF. Hidden from all platforms."
        >
          Hidden (Item Off)
        </span>
      );
    }

    return (
      <div className="channel-cell-box">
        <div className="channel-cell-top">
          {isChannelDelisted ? (
            <button
              type="button"
              className="channel-delisted-tag clickable"
              onClick={function() {
                if (onToggleChannel) {
                  onToggleChannel(
                    itemId,
                    channelKey
                  );
                }
              }}
              title={
                'Currently delisted on ' +
                channelName +
                '. Click to re-list.'
              }
            >
              <span className="delist-dot"></span>
              Delisted (Re-list)
            </button>
          ) : units === 0 ? (
            <button
              type="button"
              className="low-stock-action-button out-of-stock-button"
              onClick={function() {
                if (onToggleChannel) {
                  onToggleChannel(
                    itemId,
                    channelKey
                  );
                }
              }}
              title={
                'Out of Stock on ' +
                channelName +
                '. Click to delist.'
              }
            >
              <span className="out-of-stock-dot"></span>
              Out of Stock (Delist)
            </button>
          ) : units < 2 ? (
            <button
              type="button"
              className="low-stock-action-button"
              onClick={function() {
                if (onToggleChannel) {
                  onToggleChannel(
                    itemId,
                    channelKey
                  );
                }
              }}
              title={
                'Low Stock on ' +
                channelName +
                ' (' +
                units +
                ' left). Click to delist.'
              }
            >
              <span className="low-stock-dot"></span>
              Low ({units}) Delist
            </button>
          ) : (
            <span className="channel-live-indicator">
              <span className="live-dot-green"></span>
              Live ({units})
            </span>
          )}

          <label
            className="channel-switch-wrap"
            title={
              isChannelDelisted
                ? 'Delisted on ' +
                  channelName +
                  '. Click to turn ON.'
                : 'Live on ' +
                  channelName +
                  '. Click to turn OFF.'
            }
          >
            <input
              type="checkbox"
              className="channel-switch-input"
              checked={!isChannelDelisted}
              onChange={function() {
                if (onToggleChannel) {
                  onToggleChannel(
                    itemId,
                    channelKey
                  );
                }
              }}
            />

            <span className="channel-switch-slider"></span>
          </label>
        </div>

        <div className="channel-stepper-row">
          <span className="units-count-text">
            <strong>{units}</strong> portions
          </span>

          <div className="stepper-btn-group">
            <button
              type="button"
              className="portion-btn"
              aria-label="Decrease portion"
              disabled={units <= 0}
              onClick={function() {
                if (onAdjustPortions) {
                  onAdjustPortions(
                    itemId,
                    channelKey,
                    -1
                  );
                }
              }}
            >
              -
            </button>

            <button
              type="button"
              className="portion-btn portion-btn-add"
              aria-label="Increase portion"
              onClick={function() {
                if (onAdjustPortions) {
                  onAdjustPortions(
                    itemId,
                    channelKey,
                    1
                  );
                }
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderStatusBadge(
    item,
    isMasterOn
  ) {
    if (!isMasterOn) {
      return (
        <span className="status-badge-offline">
          <span className="status-dot-offline"></span>
          Master Off
        </span>
      );
    }

    const itemId = getItemId(item);

    const channelList = [
      {
        key: 'platformA',
        units:
          Number(item.platformA) || 0,
        name: 'Swiggy'
      },
      {
        key: 'platformB',
        units:
          Number(item.platformB) || 0,
        name: 'Zomato'
      },
      {
        key: 'platformC',
        units:
          Number(item.platformC) || 0,
        name: 'Direct'
      }
    ];

    const lowOrOutChannels =
      channelList.filter(function(channel) {
        return channel.units < 2;
      });

    const unhandledCriticalChannels =
      channelList.filter(function(channel) {
        return (
          channel.units < 2 &&
          !disabledChannels[
            itemId + '_' + channel.key
          ]
        );
      });

    const isAllCriticalDelisted =
      lowOrOutChannels.length > 0 &&
      unhandledCriticalChannels.length === 0;

    if (
      unhandledCriticalChannels.length > 0
    ) {
      const hasZero =
        unhandledCriticalChannels.some(
          function(channel) {
            return channel.units === 0;
          }
        ) ||
        Number(item.totalStock) === 0;

      return (
        <button
          type="button"
          className={
            'status-badge-action-btn ' +
            (hasZero
              ? 'status-badge-out'
              : 'status-badge-low')
          }
          onClick={function() {
            if (onDelistDishAll) {
              onDelistDishAll(itemId);
            }
          }}
          title="Click to delist all low-stock channels for this dish"
        >
          <span
            className={
              hasZero
                ? 'status-dot-red'
                : 'status-dot-amber'
            }
          ></span>

          <span>
            {hasZero
              ? 'Out of Stock (Delist All)'
              : 'Low Stock (Delist All)'}
          </span>
        </button>
      );
    }

    if (isAllCriticalDelisted) {
      return (
        <span
          className="status-badge-protected"
          title="All low-stock channels are delisted and protected"
        >
          <ShieldCheck
            size={13}
            className="text-emerald"
          />
          Delisted (Protected)
        </span>
      );
    }

    return (
      <span className="status-badge-synced">
        <CheckCircle2
          size={13}
          className="text-emerald"
        />
        Synced Live
      </span>
    );
  }

  return (
    <div
      id="inventory-table"
      className="inventory-container"
    >
      <div className="inventory-header">
        <div className="inventory-title-group">
          <div className="d-flex align-items-center gap-2">
            <h2 className="inventory-heading">
              Live Kitchen Inventory &amp; Channel
              Stock
            </h2>

            <span className="inventory-count-pill">
              {filteredItems.length} of{' '}
              {items.length} Dishes
            </span>
          </div>

          <p className="inventory-subheading">
            Live multi-platform sync &bull; Changes
            broadcast to Swiggy, Zomato &amp; Direct
            channels synchronously.
          </p>
        </div>

        <div className="inventory-actions-right">
          <div
            className="view-mode-toggle"
            role="group"
            aria-label="Switch Table and Card Views"
          >
            <button
              type="button"
              className={
                'view-mode-btn ' +
                (viewMode === 'table'
                  ? 'active'
                  : '')
              }
              onClick={function() {
                setViewMode('table');
                setUserOverridden(true);
              }}
              title="Switch to Table View"
            >
              <Table size={14} />
              <span>Table</span>
            </button>

            <button
              type="button"
              className={
                'view-mode-btn ' +
                (viewMode === 'cards'
                  ? 'active'
                  : '')
              }
              onClick={function() {
                setViewMode('cards');
                setUserOverridden(true);
              }}
              title="Switch to Card View"
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
          </div>

          <button
            type="button"
            className="add-dish-btn"
            onClick={onOpenAddDish}
            title="Add a new dish"
          >
            <Plus size={15} />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      <div className="inventory-controls-bar">
        <div className="inventory-search-wrap">
          <Search
            size={15}
            className="search-icon"
          />

          <input
            type="text"
            className="inventory-search-input"
            placeholder="Search dish name, SKU, or category..."
            value={searchTerm}
            onChange={function(event) {
              setSearchTerm(event.target.value);
            }}
          />

          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={function() {
                setSearchTerm('');
              }}
            >
              &times;
            </button>
          )}
        </div>

        <div className="inventory-category-pills">
          {categories.map(function(category) {
            return (
              <button
                key={category}
                type="button"
                className={
                  'category-pill-btn ' +
                  (selectedCategory ===
                  category
                    ? 'active'
                    : '')
                }
                onClick={function() {
                  setSelectedCategory(
                    category
                  );
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="inventory-stock-filters">
          <button
            type="button"
            className={
              'stock-filter-btn ' +
              (stockFilter === 'all'
                ? 'active'
                : '')
            }
            onClick={function() {
              setStockFilter('all');
            }}
          >
            All
          </button>

          <button
            type="button"
            className={
              'stock-filter-btn filter-low ' +
              (stockFilter === 'low'
                ? 'active'
                : '')
            }
            onClick={function() {
              setStockFilter('low');
            }}
          >
            <AlertTriangle size={12} />
            Low / Out
          </button>

          <button
            type="button"
            className={
              'stock-filter-btn ' +
              (stockFilter === 'active'
                ? 'active'
                : '')
            }
            onClick={function() {
              setStockFilter('active');
            }}
          >
            Active Only
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="table-wrapper">
          <table className="stock-table">
            <thead>
              <tr>
                <th className="th-sticky-col">
                  Dish &amp; SKU
                </th>

                <th>Category</th>

                <th>Master Switch</th>

                <th>Total Stock</th>

                <th className="th-channel th-swiggy">
                  Swiggy
                </th>

                <th className="th-channel th-zomato">
                  Zomato
                </th>

                <th className="th-channel th-direct">
                  Direct POS
                </th>

                <th>Sync Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="table-loading-cell"
                  >
                    {items.length === 0
                      ? 'Loading dishes from backend...'
                      : 'No dishes match your filter.'}
                  </td>
                </tr>
              ) : (
                filteredItems.map(function(item) {
                  const itemId =
                    getItemId(item);

                  const isMasterOn =
                    isItemMasterEnabled(
                      itemId
                    );

                  return (
                    <tr
                      key={itemId}
                      className={
                        !isMasterOn
                          ? 'row-disabled'
                          : ''
                      }
                    >
                      <td className="td-sticky-col">
                        <div className="d-flex align-items-center gap-2">
                          <div className="dish-table-thumbnail-wrap">
                            <img
                              src={getDishImage(
                                item
                              )}
                              alt={item.name}
                              className="dish-table-thumbnail"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onError={function(
                                event
                              ) {
                                handleFoodImageError(
                                  event,
                                  item.category
                                );
                              }}
                            />
                          </div>

                          <div>
                            <div className="product-name">
                              {item.name}
                            </div>

                            <div className="product-sku">
                              {item.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="category-tag">
                          {item.category}
                        </span>
                      </td>

                      <td>
                        <label
                          className="item-toggle-wrapper"
                          title={
                            isMasterOn
                              ? 'Turn OFF to stop displaying on ALL platforms'
                              : 'Turn ON to display on platforms'
                          }
                        >
                          <input
                            type="checkbox"
                            className="item-toggle-input"
                            checked={isMasterOn}
                            onChange={function() {
                              if (
                                onToggleMaster
                              ) {
                                onToggleMaster(
                                  itemId
                                );
                              }
                            }}
                          />

                          <span className="item-toggle-track"></span>

                          <span
                            className={
                              'toggle-status-text ' +
                              (isMasterOn
                                ? 'text-live'
                                : 'text-off')
                            }
                          >
                            {isMasterOn
                              ? 'Active'
                              : 'Off'}
                          </span>
                        </label>
                      </td>

                      <td>
                        <span className="stock-pill">
                          {item.totalStock}
                        </span>
                      </td>

                      <td>
                        {renderPlatformCell(
                          item,
                          'platformA',
                          'Swiggy'
                        )}
                      </td>

                      <td>
                        {renderPlatformCell(
                          item,
                          'platformB',
                          'Zomato'
                        )}
                      </td>

                      <td>
                        {renderPlatformCell(
                          item,
                          'platformC',
                          'Direct'
                        )}
                      </td>

                      <td>
                        {renderStatusBadge(
                          item,
                          isMasterOn
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="inventory-cards-container">
          {filteredItems.length === 0 ? (
            <div className="table-loading-cell">
              {items.length === 0
                ? 'Loading dishes from backend...'
                : 'No dishes match your filter.'}
            </div>
          ) : (
            <div className="inventory-cards-grid">
              {filteredItems.map(function(item) {
                const itemId =
                  getItemId(item);

                const isMasterOn =
                  isItemMasterEnabled(
                    itemId
                  );

                return (
                  <div
                    key={itemId}
                    className={
                      'inventory-dish-card ' +
                      (!isMasterOn
                        ? 'row-disabled'
                        : '')
                    }
                  >
                    <div className="card-dish-image-wrap">
                      <img
                        src={getDishImage(item)}
                        alt={item.name}
                        className="card-dish-image"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={function(
                          event
                        ) {
                          handleFoodImageError(
                            event,
                            item.category
                          );
                        }}
                      />

                      <div className="card-dish-gradient-scrim"></div>

                      <div className="card-dish-badge-row">
                        <span className="badge-card-cat">
                          {item.category}
                        </span>

                        <span className="badge-card-sku">
                          {item.sku}
                        </span>
                      </div>

                      {!isMasterOn ? (
                        <div className="card-dish-off-overlay">
                          <span className="badge-dish-master-off">
                            MASTER SWITCH OFF
                          </span>

                          <span className="dish-off-sub">
                            Deactivated on Swiggy,
                            Zomato &amp; Direct
                          </span>
                        </div>
                      ) : (
                        <div className="card-dish-bottom-overlay">
                          <span className="card-total-stock-pill">
                            <strong>
                              {
                                item.totalStock
                              }
                            </strong>{' '}
                            portions prepped
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="card-top-row">
                      <div className="card-product-info">
                        <h4 className="product-name">
                          {item.name}
                        </h4>

                        <span className="product-sku-sub">
                          SKU: {item.sku}
                        </span>
                      </div>

                      <label
                        className="item-toggle-wrapper"
                        title={
                          isMasterOn
                            ? 'Turn OFF to stop displaying on ALL platforms'
                            : 'Turn ON to display on platforms'
                        }
                      >
                        <input
                          type="checkbox"
                          className="item-toggle-input"
                          checked={isMasterOn}
                          onChange={function() {
                            if (
                              onToggleMaster
                            ) {
                              onToggleMaster(
                                itemId
                              );
                            }
                          }}
                        />

                        <span className="item-toggle-track"></span>

                        <span
                          className={
                            'toggle-status-text ' +
                            (isMasterOn
                              ? 'text-live'
                              : 'text-off')
                          }
                        >
                          {isMasterOn
                            ? 'Active'
                            : 'Off'}
                        </span>
                      </label>
                    </div>

                    <div className="card-channels-list">
                      <div className="card-channel-card card-channel-swiggy">
                        <div className="card-channel-header">
                          <div className="d-flex align-items-center gap-1">
                            <span className="channel-indicator-dot dot-swiggy"></span>

                            <span className="card-channel-label text-swiggy">
                              Swiggy
                            </span>
                          </div>

                          {renderPlatformCell(
                            item,
                            'platformA',
                            'Swiggy'
                          )}
                        </div>
                      </div>

                      <div className="card-channel-card card-channel-zomato">
                        <div className="card-channel-header">
                          <div className="d-flex align-items-center gap-1">
                            <span className="channel-indicator-dot dot-zomato"></span>

                            <span className="card-channel-label text-zomato">
                              Zomato
                            </span>
                          </div>

                          {renderPlatformCell(
                            item,
                            'platformB',
                            'Zomato'
                          )}
                        </div>
                      </div>

                      <div className="card-channel-card card-channel-direct">
                        <div className="card-channel-header">
                          <div className="d-flex align-items-center gap-1">
                            <span className="channel-indicator-dot dot-direct"></span>

                            <span className="card-channel-label text-direct">
                              Direct POS
                            </span>
                          </div>

                          {renderPlatformCell(
                            item,
                            'platformC',
                            'Direct'
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card-status-footer">
                      <div className="card-footer-info">
                        <span className="footer-stock-label">
                          Stock Status:
                        </span>
                      </div>

                      {renderStatusBadge(
                        item,
                        isMasterOn
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
