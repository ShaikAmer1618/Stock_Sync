import React, { useState } from 'react';
import './CustomerDiffComparison.css';

export default function CustomerDiffComparison(props) {
  const items = props.items || [];
  const onAdjustPortions = props.onAdjustPortions;

  const [simulatedHazardClick, setSimulatedHazardClick] =
    useState(false);

  const burgerImg =
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80';

  function handleMockOrder() {
    if (!onAdjustPortions) {
      return;
    }

    if (items.length === 0) {
      return;
    }

    const orderItem = items.find(function(item) {
      const stock =
        Number(item.platformA) || 0;

      return (
        item &&
        item.masterEnabled !== false &&
        item.platformAEnabled !== false &&
        stock > 0
      );
    });

    if (!orderItem) {
      return;
    }

    const itemId =
      orderItem._id ||
      orderItem.id ||
      orderItem.sku;

    onAdjustPortions(
      itemId,
      'platformA',
      -1
    );

    setSimulatedHazardClick(true);

    window.setTimeout(function() {
      setSimulatedHazardClick(false);
    }, 4000);
  }

  return (
    <div className="diff-comparison-section">
      <div className="diff-comparison-header">
        <div className="diff-header-badge">
          <span className="diff-dot"></span>
          <span>LIVE ARCHITECTURE BENCHMARK</span>
        </div>

        <h3 className="diff-title">
          The Ghost Order Problem vs. Automated Instant Sync
        </h3>

        <p className="diff-subtitle">
          Side-by-side breakdown of what happens when a dish sells out: manual portal latency leads to customer cancellation penalties, while the Ghost Prevention Engine protects kitchen revenue in &lt;1 second.
        </p>
      </div>

      <div className="diff-cards-grid row g-3">

        <div className="col-12 col-xl-6">
          <div className="diff-card diff-card-hazardous h-100 d-flex flex-column justify-content-between">

            <div>
              <div className="diff-dish-top">

                <div className="diff-dish-info">

                  <div className="diff-status-badge badge-hazardous">
                    <span className="diff-check-circle">
                      ✔
                    </span>

                    <span>
                      AVAILABLE (HAZARDOUS)
                    </span>
                  </div>

                  <h4 className="diff-dish-name">
                    Classic Brioche Cheeseburger
                  </h4>

                  <p className="diff-dish-desc">
                    Aged cheddar melt, caramelised red onion confit, house special smokey sauce on toasted brioche.
                  </p>

                  <div className="diff-price-row">
                    <span className="diff-price-current">
                      &#8377;199
                    </span>

                    <span className="diff-price-strikethrough">
                      &#8377;249
                    </span>
                  </div>

                </div>

                <div className="diff-dish-media">

                  <div className="diff-img-container">
                    <img
                      src={burgerImg}
                      alt="Classic Brioche Cheeseburger"
                      className="diff-burger-img"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    <span className="diff-bestseller-pill">
                      Bestseller
                    </span>
                  </div>

                  <button
                    type="button"
                    className="diff-btn-add-cart"
                    onClick={handleMockOrder}
                    title="Click to place a mock order and decrease one portion from inventory"
                  >
                    ADD TO CART +
                  </button>

                </div>
              </div>

              <div className="diff-warning-box">

                <div className="diff-warning-head">
                  <span className="diff-warning-icon">
                    &#9888;
                  </span>

                  <span>
                    GHOST TICKET VULNERABILITY DETECTED
                  </span>
                </div>

                <p className="diff-warning-text">
                  The kitchen ran out of brioche buns 5 minutes ago, but Platform A still shows this item as actively orderable.
                </p>

                <div className="diff-metrics-row">

                  <div className="diff-metric-col">
                    <span className="diff-metric-label">
                      IMPACT UPON ORDER
                    </span>

                    <span className="diff-metric-val val-danger">
                      <span className="diff-danger-glyph">
                        &#9747;
                      </span>{' '}
                      Penalty: &#8377;150 fee
                    </span>
                  </div>

                  <div className="diff-metric-col">
                    <span className="diff-metric-label">
                      Immediate Store Penalties
                    </span>

                    <span className="diff-metric-val val-danger">
                      <span className="diff-danger-glyph">
                        &#9734;
                      </span>{' '}
                      Rating: 1-Star Review
                    </span>
                  </div>

                </div>

                {simulatedHazardClick && (
                  <div className="diff-sim-hazard-toast">
                    <span>
                      &#10003; Mock order placed! 1
                      portion deducted from inventory.
                    </span>
                  </div>
                )}

              </div>
            </div>

            <div className="diff-footer-bar footer-hazardous mt-3">

              <div className="diff-footer-left">
                <span className="diff-footer-icon">
                  &#9201;
                </span>

                <span>
                  Manual Merchant Portal Lag
                </span>
              </div>

              <div className="diff-footer-pill pill-hazardous">
                Avg 12-18 mins delay
              </div>

            </div>

          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="diff-card diff-card-protected h-100 d-flex flex-column justify-content-between">

            <div>

              <div className="diff-dish-top">

                <div className="diff-dish-info">

                  <div className="diff-status-badge badge-sold-out">
                    <span className="diff-slash-circle">
                      &#8861;
                    </span>

                    <span>
                      SOLD OUT / OUT OF STOCK
                    </span>
                  </div>

                  <h4 className="diff-dish-name dim-text">
                    Classic Brioche Cheeseburger
                  </h4>

                  <p className="diff-dish-desc dim-text">
                    Aged cheddar melt, caramelised red onion confit, house special smokey sauce on toasted brioche.
                  </p>

                  <div className="diff-restock-row">
                    <span className="diff-clock-icon">
                      &#128338;
                    </span>

                    <span className="diff-restock-text">
                      Restocks in ~45 mins
                    </span>
                  </div>

                </div>

                <div className="diff-dish-media">

                  <div className="diff-img-container dimmed-container">
                    <img
                      src={burgerImg}
                      alt="Classic Brioche Cheeseburger"
                      className="diff-burger-img dimmed-img"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    <div className="diff-unavailable-overlay">
                      UNAVAILABLE
                    </div>
                  </div>

                  <button
                    type="button"
                    className="diff-btn-item-86"
                    disabled
                    title="Item auto-delisted across all channels to prevent ghost tickets"
                  >
                    <span className="diff-lock-icon">
                      &#128274;
                    </span>

                    <span>
                      ITEM 86'D
                    </span>
                  </button>

                </div>
              </div>

              <div className="diff-success-box">

                <div className="diff-success-head">

                  <span className="diff-success-icon">
                    &#10004;
                  </span>

                  <span>
                    SYNCHRONIZED ACROSS ALL 3 PLATFORMS IN 0.7s
                  </span>

                </div>

                <p className="diff-success-text">
                  Customer guided seamlessly to active inventory (Crispy Chicken Wings or Loaded Fries). Zero manual intervention required.
                </p>

                <div className="diff-metrics-row">

                  <div className="diff-metric-col">
                    <span className="diff-metric-label">
                      PROTECTED REVENUE METRICS
                    </span>

                    <span className="diff-metric-val val-success">
                      <span className="diff-success-glyph">
                        &#128737;
                      </span>{' '}
                      Penalties Avoided: &#8377;150
                    </span>
                  </div>

                  <div className="diff-metric-col">
                    <span className="diff-metric-label">
                      Zero Friction Funnel
                    </span>

                    <span className="diff-metric-val val-success">
                      <span className="diff-success-glyph">
                        &#128077;
                      </span>{' '}
                      Kitchen Retention: 100%
                    </span>
                  </div>

                </div>

              </div>
            </div>

            <div className="diff-footer-bar footer-protected mt-3">

              <div className="diff-footer-left">
                <span className="diff-footer-icon icon-emerald">
                  &#8646;
                </span>

                <span>
                  Smart Conversion: Loaded Truffle Fries Recommended
                </span>
              </div>

              <div className="diff-footer-pill pill-protected">
                +&#8377;120 upsell
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}