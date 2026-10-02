import React, { useState } from 'react';
import { CATEGORY_IMAGE_PRESETS, CURATED_FOOD_GALLERY, handleFoodImageError } from '../../utils/foodImages.js';
import './AddDishModal.css';

export default function AddDishModal(props) {
  const isOpen = props.isOpen;
  const onClose = props.onClose;
  const onAddDish = props.onAddDish;

  const [dishName, setDishName] = useState('');
  const [category, setCategory] = useState('Biryani');
  const [customSku, setCustomSku] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [platformA, setPlatformA] = useState(10);
  const [platformB, setPlatformB] = useState(10);
  const [platformC, setPlatformC] = useState(5);

  if (!isOpen) {
    return null;
  }

  // Calculate live total stock
  const totalStock = (Number(platformA) || 0) + (Number(platformB) || 0) + (Number(platformC) || 0);
  const effectiveImageUrl = imageUrl.trim() || CATEGORY_IMAGE_PRESETS[category] || CATEGORY_IMAGE_PRESETS['Default'];

  function handleSubmit(e) {
    e.preventDefault();
    if (!dishName.trim()) {
      return;
    }

    // Generate SKU if user didn't specify one
    let generatedSku = customSku.trim();
    if (!generatedSku) {
      const prefix = category.substring(0, 3).toUpperCase();
      const randomNum = Math.floor(100 + Math.random() * 900);
      generatedSku = prefix + '-DSH-' + randomNum;
    }

    const newDish = {
      id: Date.now(),
      name: dishName.trim(),
      category: category,
      sku: generatedSku,
      image: effectiveImageUrl,
      totalStock: totalStock,
      platformA: Number(platformA) || 0,
      platformB: Number(platformB) || 0,
      platformC: Number(platformC) || 0,
      status: totalStock <= 10 ? 'low' : 'synced'
    };

    onAddDish(newDish);
    onClose();

    // Reset form
    setDishName('');
    setCustomSku('');
    setImageUrl('');
    setPlatformA(10);
    setPlatformB(10);
    setPlatformC(5);
  }

  return (
    <>
      <div
        className="modal d-block show"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
        style={{ backgroundColor: 'rgba(4, 7, 15, 0.75)', backdropFilter: 'blur(6px)' }}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
          onClick={function(e) {
            e.stopPropagation();
          }}
        >
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <div className="modal-title-box">
                <h5 className="modal-title fw-bold mb-1">Add New Kitchen Dish</h5>
                <p className="modal-subtitle text-secondary small mb-0">
                  Configure name, category, and initial channel portion distribution
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-body p-3 p-md-4">
                {/* Dish Name */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label mb-0 fw-semibold" htmlFor="dish-name-input">
                      Dish Name <span className="text-danger">*</span>
                    </label>
                    <span className="small text-secondary">e.g. Paneer Butter Masala</span>
                  </div>
                  <input
                    id="dish-name-input"
                    type="text"
                    className="form-control"
                    placeholder="Enter authentic dish name..."
                    value={dishName}
                    onChange={function(e) {
                      setDishName(e.target.value);
                    }}
                    required
                    autoFocus
                  />
                </div>

                {/* Category & SKU */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold mb-1" htmlFor="dish-category-select">
                      Category
                    </label>
                    <select
                      id="dish-category-select"
                      className="form-select"
                      value={category}
                      onChange={function(e) {
                        setCategory(e.target.value);
                      }}
                    >
                      <option value="Biryani">Biryani</option>
                      <option value="Starter">Starter</option>
                      <option value="Chicken Curry">Chicken Curry</option>
                      <option value="Mutton Curry">Mutton Curry</option>
                      <option value="Dessert">Dessert / Beverage</option>
                      <option value="Breads / Rice">Breads / Rice</option>
                    </select>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-semibold mb-0" htmlFor="dish-sku-input">
                        SKU Code
                      </label>
                      <span className="small text-secondary">Optional</span>
                    </div>
                    <input
                      id="dish-sku-input"
                      type="text"
                      className="form-control"
                      placeholder="Auto-generated if blank"
                      value={customSku}
                      onChange={function(e) {
                        setCustomSku(e.target.value);
                      }}
                    />
                  </div>
                </div>

                {/* Food Item Image & Quick Preset Gallery */}
                <div className="card p-3 mb-3 border food-image-selector-card">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold mb-0" htmlFor="dish-image-input">
                      Food Item Image
                    </label>
                    <span className="badge bg-primary text-white small px-2 py-1">
                      {imageUrl ? 'Selected Image' : 'Default ' + category + ' Photo'}
                    </span>
                  </div>

                  {/* Active Image Preview & Input */}
                  <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3 mb-3">
                    <div className="position-relative flex-shrink-0 food-preview-box" style={{ width: '96px', height: '72px' }}>
                      <img
                        src={effectiveImageUrl}
                        alt="Food preview"
                        className="rounded border w-100 h-100 object-fit-cover shadow-sm"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleFoodImageError(e, category)}
                      />
                      <span className="food-preview-pill">{category}</span>
                    </div>

                    <div className="flex-grow-1 w-100">
                      <input
                        id="dish-image-input"
                        type="url"
                        className="form-control form-control-sm mb-1"
                        placeholder="Paste custom image URL or pick a dish photo below"
                        value={imageUrl}
                        onChange={function(e) {
                          setImageUrl(e.target.value);
                        }}
                      />
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-secondary" style={{ fontSize: '11px' }}>
                          High-definition food photography with auto CDN optimization
                        </span>
                        {imageUrl && (
                          <button
                            type="button"
                            className="btn btn-link btn-sm text-primary p-0 small text-decoration-none fw-semibold"
                            style={{ fontSize: '11px' }}
                            onClick={function() { setImageUrl(''); }}
                          >
                            Reset to Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Food Photo Gallery Quick Selector */}
                  <div className="food-gallery-section pt-2 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small text-secondary fw-semibold">
                        Choose From Authentic Food Photos:
                      </span>
                      <div className="food-gallery-filter-chips d-flex gap-1">
                        {['All', 'Biryani', 'Starter', 'Curry'].map(function(tab) {
                          return (
                            <button
                              key={tab}
                              type="button"
                              className={'btn btn-xs ' + (galleryFilter === tab ? 'btn-secondary text-white' : 'btn-outline-secondary')}
                              style={{ fontSize: '10px', padding: '2px 7px' }}
                              onClick={function() { setGalleryFilter(tab); }}
                            >
                              {tab}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="food-photo-grid">
                      {CURATED_FOOD_GALLERY.filter(function(photo) {
                        if (galleryFilter === 'All') return true;
                        if (galleryFilter === 'Curry') return photo.category.includes('Curry') || photo.category === 'Vegetarian';
                        return photo.category.toLowerCase().includes(galleryFilter.toLowerCase());
                      }).map(function(photo) {
                        const isSelected = effectiveImageUrl === photo.url;
                        return (
                          <div
                            key={photo.id}
                            className={'food-photo-card ' + (isSelected ? 'active-photo' : '')}
                            onClick={function() {
                              setImageUrl(photo.url);
                              setCategory(photo.category);
                              if (!dishName.trim()) {
                                setDishName(photo.name);
                              }
                            }}
                            title={'Click to use ' + photo.name + ' (' + photo.category + ')'}
                          >
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="food-photo-thumb"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onError={(e) => handleFoodImageError(e, photo.category)}
                            />
                            <div className="food-photo-info">
                              <span className="food-photo-title">{photo.name}</span>
                            </div>
                            {isSelected && (
                              <span className="food-photo-checked-badge">&check;</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Channel Allocations */}
                <div className="border-top pt-3 mt-3">
                  <h6 className="text-uppercase text-secondary small fw-bold tracking-wider mb-3">
                    Initial Platform Allocation (Portions)
                  </h6>

                  <div className="row g-2 g-sm-3 mb-3">
                    <div className="col-12 col-sm-4">
                      <div className="card p-2 p-sm-3 h-100 border">
                        <label className="form-label small fw-semibold text-warning mb-1">
                          Platform A (Swiggy)
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="form-control form-control-lg text-center fw-bold"
                          value={platformA}
                          onChange={function(e) {
                            setPlatformA(Math.max(0, parseInt(e.target.value, 10) || 0));
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-sm-4">
                      <div className="card p-2 p-sm-3 h-100 border">
                        <label className="form-label small fw-semibold text-danger mb-1">
                          Platform B (Zomato)
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="form-control form-control-lg text-center fw-bold"
                          value={platformB}
                          onChange={function(e) {
                            setPlatformB(Math.max(0, parseInt(e.target.value, 10) || 0));
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-sm-4">
                      <div className="card p-2 p-sm-3 h-100 border">
                        <label className="form-label small fw-semibold text-info mb-1">
                          Platform C (Direct)
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="form-control form-control-lg text-center fw-bold"
                          value={platformC}
                          onChange={function(e) {
                            setPlatformC(Math.max(0, parseInt(e.target.value, 10) || 0));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Total Calculation Preview */}
                <div className="alert alert-info d-flex justify-content-between align-items-center mb-0">
                  <span className="fw-semibold small">
                    Total Kitchen Portions Synced:
                  </span>
                  <span className="badge bg-primary fs-6 fw-bold">
                    {totalStock} portions
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary fw-semibold px-4"
                >
                  + Add Dish to StockSync
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}
