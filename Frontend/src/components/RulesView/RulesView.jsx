import React, { useState } from 'react';
import { RotateCcw, Shield, Sliders, CheckCircle2, AlertOctagon } from 'lucide-react';
import './RulesView.css';

export default function RulesView() {
  const [autoDelistEnabled, setAutoDelistEnabled] = useState(true);
  const [autoRestoreEnabled, setAutoRestoreEnabled] = useState(true);
  const [bufferThreshold, setBufferThreshold] = useState(2);
  const [lockOnManual, setLockOnManual] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  function handleSave() {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  }

  return (
    <div className="rules-container">
      <div className="rule-policy-card">
        <div className="rule-policy-header">
          <div className="rule-header-left">
            <div className="rule-header-icon">
              <RotateCcw size={26} />
            </div>
            <div className="rule-header-text">
              <span className="rule-eyebrow">AUTOMATION POLICIES</span>
              <h2>Auto-Restore &amp; Shield Rules</h2>
              <p>
                Configure safety margins and automated re-listing rules when kitchen inventory gets replenished.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={'btn-save-rules ' + (savedSuccess ? 'btn-saved' : '')}
            onClick={handleSave}
          >
            {savedSuccess ? '✓ Policy Saved' : 'Save Policy Settings'}
          </button>
        </div>

        {/* Rules Grid */}
        <div className="rules-grid">
          {/* Rule 1 */}
          <div className="rule-item-card">
            <div className="rule-card-top">
              <div className="rule-card-header-bar">
                <span className="rule-badge rule-badge-danger">
                  RULE #1 &bull; SHIELD TRIGGER
                </span>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="switchRule1"
                    checked={autoDelistEnabled}
                    onChange={(e) => setAutoDelistEnabled(e.target.checked)}
                  />
                </div>
              </div>
              <h3 className="rule-title">Critical Zero-Stock Delisting</h3>
              <p className="rule-desc">
                Instantly broadcasts a delist command to Swiggy and Zomato the moment kitchen portions hit &le; 1 unit.
              </p>
            </div>
            <div className="rule-footer-box">
              <span className="rule-status-active">
                <CheckCircle2 size={16} />
                <span>{autoDelistEnabled ? 'Active (Zero Ghost Orders)' : 'Disabled'}</span>
              </span>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="rule-item-card">
            <div className="rule-card-top">
              <div className="rule-card-header-bar">
                <span className="rule-badge rule-badge-success">
                  RULE #2 &bull; RESTORATION BUFFER
                </span>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="switchRule2"
                    checked={autoRestoreEnabled}
                    onChange={(e) => setAutoRestoreEnabled(e.target.checked)}
                  />
                </div>
              </div>
              <h3 className="rule-title">Automated Channel Restock Recovery</h3>
              <p className="rule-desc">
                When new portions are prepped and added to stock, automatically re-list the item across all delivery aggregators once buffer is met.
              </p>
            </div>

            <div className="rule-footer-box">
              <span className="text-secondary small">Re-list buffer threshold:</span>
              <div className="threshold-stepper">
                <button
                  type="button"
                  className="btn-thresh-step"
                  onClick={() => setBufferThreshold(Math.max(1, bufferThreshold - 1))}
                >
                  -
                </button>
                <span className="threshold-val-badge">&ge; {bufferThreshold} units</span>
                <button
                  type="button"
                  className="btn-thresh-step"
                  onClick={() => setBufferThreshold(bufferThreshold + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="rule-item-card">
            <div className="rule-card-top">
              <div className="rule-card-header-bar">
                <span className="rule-badge rule-badge-warning">
                  RULE #3 &bull; CHEF OVERRIDE GUARD
                </span>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="switchRule3"
                    checked={lockOnManual}
                    onChange={(e) => setLockOnManual(e.target.checked)}
                  />
                </div>
              </div>
              <h3 className="rule-title">Kitchen Master Toggle Priority</h3>
              <p className="rule-desc">
                If kitchen staff manually turns off a dish master switch (e.g. ingredient spoiled), do not auto-restore until chef explicitly turns it on.
              </p>
            </div>
            <div className="rule-footer-box">
              <span className="text-secondary small">
                Manual Kitchen overrides supersede automated triggers
              </span>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="rule-item-card">
            <div className="rule-card-top">
              <div className="rule-card-header-bar">
                <span className="rule-badge rule-badge-info">
                  RULE #4 &bull; DISPATCH LATENCY
                </span>
                <span className="badge bg-primary bg-opacity-10 text-primary font-monospace">
                  &lt; 150ms
                </span>
              </div>
              <h3 className="rule-title">Synchronous Webhook Broadcast</h3>
              <p className="rule-desc">
                All availability switches trigger parallel edge webhooks to Swiggy API, Zomato Order Partner API, and POS simultaneously.
              </p>
            </div>
            <div className="rule-footer-box">
              <span className="text-info font-monospace small">
                Parallel HTTP/2 multiplexing active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
