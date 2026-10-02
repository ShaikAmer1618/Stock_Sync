import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Header from './components/Header/Header.jsx';
import DashboardHero from './components/DashboardHero/DashboardHero.jsx';
import InventoryTable from './components/InventoryTable/InventoryTable.jsx';
import AddDishModal from './components/AddDishModal/AddDishModal.jsx';
import CustomerView from './components/CustomerView/CustomerView.jsx';
import RoiView from './components/RoiView/RoiView.jsx';
import AuditLogView from './components/AuditLogView/AuditLogView.jsx';

import './App.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(
    'master-dashboard'
  );

  const [backendMsg, setBackendMsg] = useState('');
  const [serverTime, setServerTime] = useState('');

  const [dishes, setDishes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [enabledItems, setEnabledItems] =
    useState({});

  const [disabledChannels, setDisabledChannels] =
    useState({});

  function getDishId(dish) {
    return dish && (dish._id || dish.id || dish.sku);
  }

  function getEnabledField(channelKey) {
    if (channelKey === 'platformA') {
      return 'platformAEnabled';
    }

    if (channelKey === 'platformB') {
      return 'platformBEnabled';
    }

    return 'platformCEnabled';
  }

  function getMasterEnabled(dish) {
    if (!dish) {
      return true;
    }

    return dish.masterEnabled !== false;
  }

  function syncStateFromDishes(serverDishes) {
    const nextEnabledItems = {};
    const nextDisabledChannels = {};

    serverDishes.forEach(function(dish) {
      const dishId = getDishId(dish);

      nextEnabledItems[dishId] =
        getMasterEnabled(dish);

      if (dish.platformAEnabled === false) {
        nextDisabledChannels[
          dishId + '_platformA'
        ] = true;
      }

      if (dish.platformBEnabled === false) {
        nextDisabledChannels[
          dishId + '_platformB'
        ] = true;
      }

      if (dish.platformCEnabled === false) {
        nextDisabledChannels[
          dishId + '_platformC'
        ] = true;
      }
    });

    setEnabledItems(nextEnabledItems);
    setDisabledChannels(nextDisabledChannels);
  }

  useEffect(function() {
    const path = location.pathname;

    if (path === '/inventory') {
      setActiveTab('live-kitchen-inventory');
    } else if (path === '/customer') {
      setActiveTab('customer-view');
    } else if (path === '/roi') {
      setActiveTab('roi');
    } else if (path === '/audit-log') {
      setActiveTab('audit-log');
    } else if (path === '/alerts') {
      setActiveTab('alerts');
    } else {
      setActiveTab('master-dashboard');
    }
  }, [location.pathname]);

  function handleSelectTab(tab) {
    setActiveTab(tab);

    if (tab === 'live-kitchen-inventory') {
      navigate('/inventory');
      return;
    }

    if (tab === 'customer-view') {
      navigate('/customer');
      return;
    }

    if (tab === 'roi') {
      navigate('/roi');
      return;
    }

    if (tab === 'audit-log') {
      navigate('/audit-log');
      return;
    }

    if (tab === 'alerts') {
      navigate('/alerts');
      return;
    }

    navigate('/dashboard');
  }

  useEffect(function() {
    fetch('/api/health')
      .then(function(res) {
        if (!res.ok) {
          throw new Error('Backend health failed');
        }

        return res.json();
      })
      .then(function(data) {
        setBackendMsg(
          data.message || 'Backend connected'
        );

        setServerTime(
          data.timestamp || ''
        );
      })
      .catch(function() {
        setBackendMsg('Backend offline');
        setServerTime('');
      });

    fetch('/api/inventory')
      .then(function(res) {
        if (!res.ok) {
          throw new Error(
            'Failed to fetch inventory'
          );
        }

        return res.json();
      })
      .then(function(data) {
        const serverDishes =
          data.dishes || [];

        setDishes(serverDishes);
        syncStateFromDishes(serverDishes);
        setErrorMessage('');
      })
      .catch(function(error) {
        console.error(
          'Inventory load error:',
          error
        );

        setErrorMessage(
          'Could not load inventory from backend.'
        );
      });
  }, []);

  function handleToggleMaster(itemId) {
    const currentDish = dishes.find(function(dish) {
      return getDishId(dish) === itemId;
    });

    if (!currentDish) {
      return;
    }

    const currentMasterEnabled =
      getMasterEnabled(currentDish);

    const newMasterEnabled =
      !currentMasterEnabled;

    const updatedDish = {
      ...currentDish,
      masterEnabled:
        newMasterEnabled,
      platformAEnabled:
        newMasterEnabled,
      platformBEnabled:
        newMasterEnabled,
      platformCEnabled:
        newMasterEnabled
    };

    setDishes(function(prevDishes) {
      return prevDishes.map(function(dish) {
        return getDishId(dish) === itemId
          ? updatedDish
          : dish;
      });
    });

    setEnabledItems(function(prevItems) {
      return {
        ...prevItems,
        [itemId]: newMasterEnabled
      };
    });

    setDisabledChannels(function(prevDisabled) {
      const updated = {
        ...prevDisabled
      };

      const platformAKey =
        itemId + '_platformA';

      const platformBKey =
        itemId + '_platformB';

      const platformCKey =
        itemId + '_platformC';

      if (newMasterEnabled) {
        delete updated[platformAKey];
        delete updated[platformBKey];
        delete updated[platformCKey];
      } else {
        updated[platformAKey] = true;
        updated[platformBKey] = true;
        updated[platformCKey] = true;
      }

      return updated;
    });

    fetch('/api/inventory/' + itemId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        masterEnabled:
          newMasterEnabled,
        platformAEnabled:
          newMasterEnabled,
        platformBEnabled:
          newMasterEnabled,
        platformCEnabled:
          newMasterEnabled
      })
    })
      .then(function(res) {
        if (!res.ok) {
          throw new Error(
            'Failed to update master toggle'
          );
        }

        return res.json();
      })
      .then(function(data) {
        if (!data.success || !data.dish) {
          throw new Error(
            'Invalid master toggle response'
          );
        }

        const savedDish = data.dish;

        setDishes(function(prevDishes) {
          return prevDishes.map(function(dish) {
            return getDishId(dish) === itemId
              ? savedDish
              : dish;
          });
        });

        setEnabledItems(function(prevItems) {
          return {
            ...prevItems,
            [itemId]:
              savedDish.masterEnabled !== false
          };
        });

        setDisabledChannels(function(prevDisabled) {
          const updated = {
            ...prevDisabled
          };

          if (
            savedDish.platformAEnabled ===
            false
          ) {
            updated[
              itemId + '_platformA'
            ] = true;
          } else {
            delete updated[
              itemId + '_platformA'
            ];
          }

          if (
            savedDish.platformBEnabled ===
            false
          ) {
            updated[
              itemId + '_platformB'
            ] = true;
          } else {
            delete updated[
              itemId + '_platformB'
            ];
          }

          if (
            savedDish.platformCEnabled ===
            false
          ) {
            updated[
              itemId + '_platformC'
            ] = true;
          } else {
            delete updated[
              itemId + '_platformC'
            ];
          }

          return updated;
        });

        setErrorMessage('');
      })
      .catch(function(error) {
        console.error(
          'Master toggle error:',
          error
        );

        setDishes(function(prevDishes) {
          return prevDishes.map(function(dish) {
            return getDishId(dish) === itemId
              ? currentDish
              : dish;
          });
        });

        setEnabledItems(function(prevItems) {
          return {
            ...prevItems,
            [itemId]:
              currentMasterEnabled
          };
        });

        setDisabledChannels(function(
          prevDisabled
        ) {
          const updated = {
            ...prevDisabled
          };

          if (
            currentDish.platformAEnabled ===
            false
          ) {
            updated[
              itemId + '_platformA'
            ] = true;
          } else {
            delete updated[
              itemId + '_platformA'
            ];
          }

          if (
            currentDish.platformBEnabled ===
            false
          ) {
            updated[
              itemId + '_platformB'
            ] = true;
          } else {
            delete updated[
              itemId + '_platformB'
            ];
          }

          if (
            currentDish.platformCEnabled ===
            false
          ) {
            updated[
              itemId + '_platformC'
            ] = true;
          } else {
            delete updated[
              itemId + '_platformC'
            ];
          }

          return updated;
        });

        setErrorMessage(
          'Could not save master toggle to the backend.'
        );
      });
  }

  function handleToggleChannel(
    itemId,
    channelKey
  ) {
    const currentDish = dishes.find(function(dish) {
      return getDishId(dish) === itemId;
    });

    if (!currentDish) {
      return;
    }

    const enabledField =
      getEnabledField(channelKey);

    const stateKey =
      itemId + '_' + channelKey;

    const currentEnabled =
      currentDish[enabledField] !== false;

    const newEnabled =
      !currentEnabled;

    setDishes(function(prevDishes) {
      return prevDishes.map(function(dish) {
        if (getDishId(dish) !== itemId) {
          return dish;
        }

        return {
          ...dish,
          [enabledField]:
            newEnabled
        };
      });
    });

    setDisabledChannels(function(
      prevDisabled
    ) {
      const updated = {
        ...prevDisabled
      };

      if (newEnabled) {
        delete updated[stateKey];
      } else {
        updated[stateKey] = true;
      }

      return updated;
    });

    fetch('/api/inventory/' + itemId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [enabledField]:
          newEnabled
      })
    })
      .then(function(res) {
        if (!res.ok) {
          throw new Error(
            'Failed to update channel'
          );
        }

        return res.json();
      })
      .then(function(data) {
        if (!data.success || !data.dish) {
          throw new Error(
            'Invalid channel response'
          );
        }

        const savedDish = data.dish;

        setDishes(function(prevDishes) {
          return prevDishes.map(function(dish) {
            return getDishId(dish) === itemId
              ? savedDish
              : dish;
          });
        });

        setDisabledChannels(function(
          prevDisabled
        ) {
          const updated = {
            ...prevDisabled
          };

          if (
            savedDish[enabledField] ===
            false
          ) {
            updated[stateKey] = true;
          } else {
            delete updated[stateKey];
          }

          return updated;
        });

        setErrorMessage('');
      })
      .catch(function(error) {
        console.error(
          'Channel toggle error:',
          error
        );

        setDishes(function(prevDishes) {
          return prevDishes.map(function(dish) {
            return getDishId(dish) === itemId
              ? currentDish
              : dish;
          });
        });

        setDisabledChannels(function(
          prevDisabled
        ) {
          const updated = {
            ...prevDisabled
          };

          if (currentEnabled) {
            delete updated[stateKey];
          } else {
            updated[stateKey] = true;
          }

          return updated;
        });

        setErrorMessage(
          'Could not save channel status to the backend.'
        );
      });
  }

  function handleDelistChannel(
    itemId,
    channelKey
  ) {
    const currentDish = dishes.find(function(dish) {
      return getDishId(dish) === itemId;
    });

    if (!currentDish) {
      return;
    }

    const enabledField =
      getEnabledField(channelKey);

    const stateKey =
      itemId + '_' + channelKey;

    if (
      currentDish[enabledField] ===
      false
    ) {
      return;
    }

    setDishes(function(prevDishes) {
      return prevDishes.map(function(dish) {
        if (getDishId(dish) !== itemId) {
          return dish;
        }

        return {
          ...dish,
          [enabledField]: false
        };
      });
    });

    setDisabledChannels(function(
      prevDisabled
    ) {
      return {
        ...prevDisabled,
        [stateKey]: true
      };
    });

    fetch('/api/inventory/' + itemId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [enabledField]: false
      })
    })
      .then(function(res) {
        if (!res.ok) {
          throw new Error(
            'Failed to delist channel'
          );
        }

        return res.json();
      })
      .then(function(data) {
        if (!data.success || !data.dish) {
          throw new Error(
            'Invalid delist response'
          );
        }

        setDishes(function(prevDishes) {
          return prevDishes.map(function(dish) {
            return getDishId(dish) === itemId
              ? data.dish
              : dish;
          });
        });

        setErrorMessage('');
      })
      .catch(function(error) {
        console.error(
          'Delist error:',
          error
        );

        setDishes(function(prevDishes) {
          return prevDishes.map(function(dish) {
            return getDishId(dish) === itemId
              ? currentDish
              : dish;
          });
        });

        setDisabledChannels(function(
          prevDisabled
        ) {
          const updated = {
            ...prevDisabled
          };

          delete updated[stateKey];

          return updated;
        });

        setErrorMessage(
          'Could not delist the platform.'
        );
      });
  }

  function handleRelistChannel(
    itemId,
    channelKey
  ) {
    const currentDish = dishes.find(function(dish) {
      return getDishId(dish) === itemId;
    });

    if (!currentDish) {
      return;
    }

    const enabledField =
      getEnabledField(channelKey);

    const stateKey =
      itemId + '_' + channelKey;

    setDishes(function(prevDishes) {
      return prevDishes.map(function(dish) {
        if (getDishId(dish) !== itemId) {
          return dish;
        }

        return {
          ...dish,
          [enabledField]: true
        };
      });
    });

    setDisabledChannels(function(
      prevDisabled
    ) {
      const updated = {
        ...prevDisabled
      };

      delete updated[stateKey];

      return updated;
    });

    fetch('/api/inventory/' + itemId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [enabledField]: true
      })
    })
      .then(function(res) {
        if (!res.ok) {
          throw new Error(
            'Failed to relist channel'
          );
        }

        return res.json();
      })
      .then(function(data) {
        if (!data.success || !data.dish) {
          throw new Error(
            'Invalid relist response'
          );
        }

        setDishes(function(prevDishes) {
          return prevDishes.map(function(dish) {
            return getDishId(dish) === itemId
              ? data.dish
              : dish;
          });
        });

        setErrorMessage('');
      })
      .catch(function(error) {
        console.error(
          'Relist error:',
          error
        );

        setDishes(function(prevDishes) {
          return prevDishes.map(function(dish) {
            return getDishId(dish) === itemId
              ? currentDish
              : dish;
          });
        });

        setDisabledChannels(function(
          prevDisabled
        ) {
          return {
            ...prevDisabled,
            [stateKey]: true
          };
        });

        setErrorMessage(
          'Could not relist the platform.'
        );
      });
  }

  function handleAdjustPortions(
    itemId,
    channelKey,
    delta
  ) {
    const currentDish = dishes.find(function(dish) {
      return getDishId(dish) === itemId;
    });

    if (!currentDish) {
      return;
    }

    const currentUnits =
      Number(currentDish[channelKey]) ||
      0;

    const newUnits = Math.max(
      0,
      currentUnits + delta
    );

    const platformA =
      channelKey === 'platformA'
        ? newUnits
        : Number(
            currentDish.platformA
          ) || 0;

    const platformB =
      channelKey === 'platformB'
        ? newUnits
        : Number(
            currentDish.platformB
          ) || 0;

    const platformC =
      channelKey === 'platformC'
        ? newUnits
        : Number(
            currentDish.platformC
          ) || 0;

    const newTotal =
      platformA +
      platformB +
      platformC;

    const newStatus =
      newTotal === 0
        ? 'out_of_stock'
        : newTotal < 10
          ? 'low'
          : 'synced';

    const enabledField =
      getEnabledField(channelKey);

    const stateKey =
      itemId + '_' + channelKey;

    const masterIsOn =
      currentDish.masterEnabled !== false;

    const currentChannelEnabled =
      currentDish[enabledField] !== false;

    let newChannelEnabled =
      currentChannelEnabled;

    if (masterIsOn) {
      if (newUnits <= 0) {
        newChannelEnabled = false;
      } else if (newUnits > 1) {
        newChannelEnabled = true;
      }
    }

    const updatedDish = {
      ...currentDish,
      [channelKey]: newUnits,
      totalStock: newTotal,
      status: newStatus,
      [enabledField]:
        newChannelEnabled
    };

    setDishes(function(prevDishes) {
      return prevDishes.map(function(dish) {
        return getDishId(dish) === itemId
          ? updatedDish
          : dish;
      });
    });

    setDisabledChannels(function(
      prevDisabled
    ) {
      const updated = {
        ...prevDisabled
      };

      if (newChannelEnabled) {
        delete updated[stateKey];
      } else {
        updated[stateKey] = true;
      }

      return updated;
    });

    fetch('/api/inventory/' + itemId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [channelKey]: newUnits,
        totalStock: newTotal,
        status: newStatus,
        [enabledField]:
          newChannelEnabled
      })
    })
      .then(function(res) {
        if (!res.ok) {
          throw new Error(
            'Failed to update portions'
          );
        }

        return res.json();
      })
      .then(function(data) {
        if (!data.success || !data.dish) {
          throw new Error(
            'Invalid portion response'
          );
        }

        const savedDish = data.dish;

        setDishes(function(prevDishes) {
          return prevDishes.map(function(dish) {
            return getDishId(dish) === itemId
              ? savedDish
              : dish;
          });
        });

        setDisabledChannels(function(
          prevDisabled
        ) {
          const updated = {
            ...prevDisabled
          };

          if (
            savedDish[enabledField] ===
            false
          ) {
            updated[stateKey] = true;
          } else {
            delete updated[stateKey];
          }

          return updated;
        });

        setErrorMessage('');
      })
      .catch(function(error) {
        console.error(
          'Portion update error:',
          error
        );

        setDishes(function(prevDishes) {
          return prevDishes.map(function(dish) {
            return getDishId(dish) === itemId
              ? currentDish
              : dish;
          });
        });

        setDisabledChannels(function(
          prevDisabled
        ) {
          const updated = {
            ...prevDisabled
          };

          if (
            currentDish[enabledField] ===
            false
          ) {
            updated[stateKey] = true;
          } else {
            delete updated[stateKey];
          }

          return updated;
        });

        setErrorMessage(
          'Could not save inventory change to the backend.'
        );
      });
  }

  function handleDelistAllCritical() {
    unhandledCriticalAlerts.forEach(
      function(alert) {
        handleDelistChannel(
          alert.itemId,
          alert.channelKey
        );
      }
    );
  }

  function handleDelistDishAll(dishId) {
    const dish = dishes.find(function(item) {
      return getDishId(item) === dishId;
    });

    if (!dish) {
      return;
    }

    [
      'platformA',
      'platformB',
      'platformC'
    ].forEach(function(channelKey) {
      const units =
        Number(dish[channelKey]) || 0;

      const enabledField =
        getEnabledField(channelKey);

      if (
        units < 2 &&
        dish[enabledField] !== false
      ) {
        handleDelistChannel(
          dishId,
          channelKey
        );
      }
    });
  }

  function handleAddDish(newDish) {
    const dishToCreate = {
      ...newDish,
      masterEnabled:
        newDish.masterEnabled !== false,
      platformAEnabled:
        newDish.platformAEnabled !== false,
      platformBEnabled:
        newDish.platformBEnabled !== false,
      platformCEnabled:
        newDish.platformCEnabled !== false
    };

    fetch('/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dishToCreate)
    })
      .then(function(res) {
        if (!res.ok) {
          throw new Error(
            'Failed to add dish'
          );
        }

        return res.json();
      })
      .then(function(data) {
        if (!data.dish) {
          throw new Error(
            'Invalid add dish response'
          );
        }

        setDishes(function(prevDishes) {
          return [
            ...prevDishes,
            data.dish
          ];
        });

        setEnabledItems(function(prevItems) {
          return {
            ...prevItems,
            [getDishId(data.dish)]:
              getMasterEnabled(
                data.dish
              )
          };
        });

        setIsAddModalOpen(false);
        setErrorMessage('');
      })
      .catch(function(error) {
        console.error(
          'Add dish error:',
          error
        );

        setErrorMessage(
          'Could not add the dish to the backend.'
        );
      });
  }

  function handleResetAll() {
    fetch('/api/inventory/reset', {
      method: 'POST'
    })
      .then(function(res) {
        if (!res.ok) {
          throw new Error(
            'Failed to reset inventory'
          );
        }

        return res.json();
      })
      .then(function(data) {
        const serverDishes =
          data.dishes || [];

        setDishes(serverDishes);
        syncStateFromDishes(
          serverDishes
        );
        setErrorMessage('');
      })
      .catch(function(error) {
        console.error(
          'Reset inventory error:',
          error
        );

        fetch('/api/inventory')
          .then(function(res) {
            if (!res.ok) {
              throw new Error(
                'Failed to reload inventory'
              );
            }

            return res.json();
          })
          .then(function(data) {
            const serverDishes =
              data.dishes || [];

            setDishes(serverDishes);
            syncStateFromDishes(
              serverDishes
            );
          })
          .catch(function() {
            setErrorMessage(
              'Could not reset inventory.'
            );
          });
      });
  }

  const criticalStockAlerts = [];
  const unhandledCriticalAlerts = [];
  const delistedProtectedList = [];

  dishes.forEach(function(item) {
    const itemId = getDishId(item);

    const channelList = [
      {
        key: 'platformA',
        name: 'Platform A (Swiggy)',
        units:
          Number(item.platformA) || 0,
        enabled:
          item.platformAEnabled !== false
      },
      {
        key: 'platformB',
        name: 'Platform B (Zomato)',
        units:
          Number(item.platformB) || 0,
        enabled:
          item.platformBEnabled !== false
      },
      {
        key: 'platformC',
        name: 'Platform C (Direct)',
        units:
          Number(item.platformC) || 0,
        enabled:
          item.platformCEnabled !== false
      }
    ];

    channelList.forEach(function(channel) {
      const stateKey =
        itemId + '_' + channel.key;

      if (channel.units < 2) {
        criticalStockAlerts.push({
          itemId: itemId,
          dishName: item.name,
          category: item.category,
          channelKey: channel.key,
          channelName: channel.name,
          units: channel.units
        });
      }

      if (
        channel.units < 2 &&
        channel.enabled
      ) {
        unhandledCriticalAlerts.push({
          itemId: itemId,
          dishName: item.name,
          category: item.category,
          channelKey: channel.key,
          channelName: channel.name,
          units: channel.units
        });
      }

      if (
        channel.units < 2 &&
        !channel.enabled
      ) {
        delistedProtectedList.push({
          itemId: itemId,
          dishName: item.name,
          category: item.category,
          channelKey: channel.key,
          channelName: channel.name,
          units: channel.units
        });
      }

      if (
        disabledChannels[stateKey] &&
        !delistedProtectedList.some(
          function(existingItem) {
            return (
              existingItem.itemId === itemId &&
              existingItem.channelKey ===
                channel.key
            );
          }
        )
      ) {
        delistedProtectedList.push({
          itemId: itemId,
          dishName: item.name,
          category: item.category,
          channelKey: channel.key,
          channelName: channel.name,
          units: channel.units
        });
      }
    });
  });

  return (
    <div className="app-root d-flex flex-column min-vh-100 w-100">
      <Header
        lowStockCount={
          criticalStockAlerts.length
        }
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      <main className="flex-grow-1">
        <div className="container-fluid px-3 px-md-4 py-4">

          {activeTab ===
            'master-dashboard' && (
            <>
              <DashboardHero />

              <div className="row g-4 mb-4">
                <div className="col-12 col-md-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="small text-muted">
                        Total Food Items
                      </div>

                      <h3 className="mb-0">
                        {dishes.length}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="small text-muted">
                        Low Stock Platforms
                      </div>

                      <h3 className="mb-0">
                        {
                          criticalStockAlerts.length
                        }
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="small text-muted">
                        Active Alerts
                      </div>

                      <h3 className="mb-0">
                        {
                          unhandledCriticalAlerts.length
                        }
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {unhandledCriticalAlerts.length > 0 && (
  <div className="inventory-alert-panel critical-alert-panel mb-4">
    <div className="inventory-alert-header">
      <div className="inventory-alert-title-wrap">
        <div className="inventory-alert-icon critical-icon">
          !
        </div>

        <div>
          <h5 className="inventory-alert-title">
            Critical Inventory Alerts
          </h5>

          <p className="inventory-alert-subtitle">
            Platform stock is below 2 portions.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="inventory-alert-main-btn critical-main-btn"
        onClick={handleDelistAllCritical}
      >
        Delist All
      </button>
    </div>

    <div className="inventory-alert-body">
      <div className="row g-3">
        {unhandledCriticalAlerts.map(
          function(alert, index) {
            return (
              <div
                className="col-12 col-md-6 col-xl-4"
                key={
                  alert.itemId +
                  '-' +
                  alert.channelKey +
                  '-' +
                  index
                }
              >
                <div className="inventory-alert-card critical-alert-card">
                  <div className="inventory-alert-card-top">
                    <div className="inventory-alert-dish">
                      <div className="inventory-alert-dish-name">
                        {alert.dishName}
                      </div>

                      <span className="inventory-alert-category">
                        {alert.category}
                      </span>
                    </div>

                    <span className="inventory-alert-stock critical-stock">
                      {alert.units}
                    </span>
                  </div>

                  <div className="inventory-alert-card-middle">
                    <span className="inventory-platform-label">
                      {alert.channelName}
                    </span>

                    <span className="inventory-stock-label">
                      {alert.units === 1
                        ? '1 portion left'
                        : alert.units + ' portions left'}
                    </span>
                  </div>

                  <div className="inventory-alert-card-footer">
                    <span className="inventory-alert-status critical-status">
                      Attention Required
                    </span>

                    <button
                      type="button"
                      className="inventory-card-action critical-card-action"
                      onClick={function() {
                        handleDelistChannel(
                          alert.itemId,
                          alert.channelKey
                        );
                      }}
                    >
                      Delist
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  </div>
)}
{/* 
{delistedProtectedList.length > 0 && (
  <div className="inventory-alert-panel protected-alert-panel mb-4">
    <div className="inventory-alert-header protected-header">
      <div className="inventory-alert-title-wrap">
        <div className="inventory-alert-icon protected-icon">
          ✓
        </div>

        <div>
          <h5 className="inventory-alert-title">
            Delisted / Protected Platforms
          </h5>

          <p className="inventory-alert-subtitle">
            These platforms are currently delisted.
          </p>
        </div>
      </div>
    </div>

    <div className="inventory-alert-body">
      <div className="row g-3">
        {delistedProtectedList.map(
          function(item, index) {
            return (
              <div
                className="col-12 col-md-6 col-xl-4"
                key={
                  item.itemId +
                  '-' +
                  item.channelKey +
                  '-' +
                  index
                }
              >
                <div className="inventory-alert-card protected-alert-card">
                  <div className="inventory-alert-card-top">
                    <div className="inventory-alert-dish">
                      <div className="inventory-alert-dish-name">
                        {item.dishName}
                      </div>

                      <span className="inventory-alert-category">
                        {item.category}
                      </span>
                    </div>

                    <span className="inventory-alert-stock protected-stock">
                      {item.units}
                    </span>
                  </div>

                  <div className="inventory-alert-card-middle">
                    <span className="inventory-platform-label">
                      {item.channelName}
                    </span>

                    <span className="inventory-stock-label">
                      {item.units} portions available
                    </span>
                  </div>

                  <div className="inventory-alert-card-footer">
                    <span className="inventory-alert-status protected-status">
                      Protected
                    </span>

                    <button
                      type="button"
                      className="inventory-card-action protected-card-action"
                      onClick={function() {
                        handleRelistChannel(
                          item.itemId,
                          item.channelKey
                        );
                      }}
                    >
                      Re-list
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  </div>
)} */}


              {criticalStockAlerts.length ===
                0 && (
                <div className="card border-success shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="text-success mb-1">
                      Inventory Healthy
                    </h5>

                    <p className="mb-0 text-muted">
                      No platform currently has
                      less than 2 portions.
                    </p>
                  </div>
                </div>
              )}

              <div className="card shadow-sm mb-4">
                <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h5 className="mb-1">
                      Backend Status
                    </h5>

                    <div className="text-muted">
                      {backendMsg}
                    </div>

                    {serverTime && (
                      <small className="text-muted">
                        {serverTime}
                      </small>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="alert alert-danger mb-0">
                      {errorMessage}
                    </div>
                  )}
                </div>
              </div>

              <div className="card shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div>
                    <h5 className="mb-1">
                      Kitchen Inventory
                    </h5>

                    <p className="text-muted mb-0">
                      Manage food stock and platform
                      availability.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={function() {
                      handleSelectTab(
                        'live-kitchen-inventory'
                      );
                    }}
                  >
                    Open Inventory
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab ===
            'live-kitchen-inventory' && (
            <>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                  <h3 className="mb-1">
                    Live Kitchen Inventory
                  </h3>

                  <p className="text-muted mb-0">
                    Control food stock and platform
                    availability.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={function() {
                    setIsAddModalOpen(true);
                  }}
                >
                  Add Dish
                </button>
              </div>

              {errorMessage && (
                <div className="alert alert-danger">
                  {errorMessage}
                </div>
              )}

              <InventoryTable
                items={dishes}
                enabledItems={enabledItems}
                disabledChannels={
                  disabledChannels
                }
                onToggleMaster={
                  handleToggleMaster
                }
                onToggleChannel={
                  handleToggleChannel
                }
                onAdjustPortions={
                  handleAdjustPortions
                }
                onDelistDishAll={
                  handleDelistDishAll
                }
                onOpenAddDish={function() {
                  setIsAddModalOpen(true);
                }}
              />
            </>
          )}

          {activeTab ===
            'customer-view' && (
            <CustomerView
              items={dishes}
              enabledItems={
                enabledItems
              }
              disabledChannels={
                disabledChannels
              }
              onAdjustPortions={
                handleAdjustPortions
              }
              onNavigateToInventory={
                function() {
                  handleSelectTab(
                    'live-kitchen-inventory'
                  );
                }
              }
            />
          )}

          {activeTab === 'alerts' && (
            <>
              <div className="mb-4">
                <h3 className="mb-1">
                  Alerts
                </h3>

                <p className="text-muted mb-0">
                  Platforms with less than 2
                  portions.
                </p>
              </div>

              {criticalStockAlerts.length ===
              0 ? (
                <div className="card border-success">
                  <div className="card-body text-success">
                    No low-stock alerts.
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  {criticalStockAlerts.map(
                    function(
                      alert,
                      index
                    ) {
                      const stateKey =
                        alert.itemId +
                        '_' +
                        alert.channelKey;

                      const isDelisted =
                        Boolean(
                          disabledChannels[
                            stateKey
                          ]
                        );

                      return (
                        <div
                          className="col-12 col-md-6"
                          key={
                            alert.itemId +
                            '-' +
                            alert.channelKey +
                            '-' +
                            index
                          }
                        >
                          <div className="card shadow-sm h-100">
                            <div className="card-body">
                              <h5 className="mb-1">
                                {
                                  alert.dishName
                                }
                              </h5>

                              <div className="text-muted mb-2">
                                {
                                  alert.channelName
                                }
                              </div>

                              <div className="mb-3">
                                Stock:{' '}
                                <strong>
                                  {
                                    alert.units
                                  }
                                </strong>{' '}
                                portion
                                {alert.units ===
                                1
                                  ? ''
                                  : 's'}
                              </div>

                              {isDelisted ? (
                                <button
                                  type="button"
                                  className="btn btn-success"
                                  onClick={
                                    function() {
                                      handleRelistChannel(
                                        alert.itemId,
                                        alert.channelKey
                                      );
                                    }
                                  }
                                >
                                  Re-list
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={
                                    function() {
                                      handleDelistChannel(
                                        alert.itemId,
                                        alert.channelKey
                                      );
                                    }
                                  }
                                >
                                  Delist
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn btn-outline-primary ms-2"
                                onClick={
                                  function() {
                                    handleAdjustPortions(
                                      alert.itemId,
                                      alert.channelKey,
                                      5
                                    );
                                  }
                                }
                              >
                                +5 Stock
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'roi' && (
            <RoiView
              dishes={dishes}
              lowStockCount={
                criticalStockAlerts.length
              }
            />
          )}

          {activeTab ===
            'audit-log' && (
            <AuditLogView
              dishes={dishes}
            />
          )}
        </div>
      </main>

      {isAddModalOpen && (
        <AddDishModal
          isOpen={isAddModalOpen}
          onClose={function() {
            setIsAddModalOpen(false);
          }}
          onAddDish={handleAddDish}
        />
      )}
    </div>
  );
}

export default App;