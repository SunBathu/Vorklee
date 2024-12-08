'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  // ----------------------------
  // State for Global Settings
  // ----------------------------
  const [globalSettings, setGlobalSettings] = useState({
    storagePath: 'SysFile',
    dateFormat: 'DD-MM-YYYY',
    whichFoldersToDeleteWhenStorageFull: 'Delete the oldest folders among all users (Recommended)',
  });

  // ----------------------------
  // State for PC-Specific Settings
  // ----------------------------
  const [pcSettingsList, setPcSettingsList] = useState([]);

  // State for error and success messages
  const [error, setError] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // ----------------------------
  // Fetch Settings on Load
  // ----------------------------
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to fetch settings.');

        const data = await response.json();
        setGlobalSettings({
          storagePath: data.globalSettings?.storagePath || 'SysFile',
          dateFormat: data.globalSettings?.dateFormat || 'DD-MM-YYYY',
          whichFoldersToDeleteWhenStorageFull:
            data.globalSettings?.whichFoldersToDeleteWhenStorageFull ||
            'Delete the oldest folders among all users (Recommended)',
        });
        setPcSettingsList(data.pcSettings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ----------------------------
  // Handle Global Settings Change
  // ----------------------------
  const handleGlobalChange = (e) => {
    const { name, value } = e.target;
    setGlobalSettings((prev) => ({ ...prev, [name]: value }));
    setIsModified(true);
  };

  // ----------------------------
  // Handle PC-Specific Settings Change
  // ----------------------------
  const handlePcChange = (index, field, value) => {
    const updatedSettings = [...pcSettingsList];
    updatedSettings[index][field] = value;
    setPcSettingsList(updatedSettings);
    setIsModified(true);
  };

  // ----------------------------
  // Save Settings to the Server
  // ----------------------------
  const handleSave = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ globalSettings, pcSettingsList }),
      });

      if (response.ok) {
        setIsModified(false);
        setMessage('Settings saved successfully.');
      } else {
        throw new Error('Failed to save settings.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // ----------------------------
  // Render Loading State
  // ----------------------------
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // ----------------------------
  // Render Settings Page
  // ----------------------------
  return (
    <div className="container">
      <h1>Settings</h1>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {/* Global Settings Form */}
      <form>
        <div className="form-group-inline">
          <label>Storage Path:</label>
          <input
            type="text"
            name="storagePath"
            value={globalSettings.storagePath}
            onChange={handleGlobalChange}
          />
        </div>

        <div className="form-group-inline">
          <label>Date Format for Daily Folders:</label>
          <select
            name="dateFormat"
            value={globalSettings.dateFormat}
            onChange={handleGlobalChange}
          >
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="MM-DD-YYYY">MM-DD-YYYY</option>
          </select>
        </div>

        <div className="form-group-inline">
          <label>Which folders to delete when storage full:</label>
          <select
            name="whichFoldersToDeleteWhenStorageFull"
            value={globalSettings.whichFoldersToDeleteWhenStorageFull}
            onChange={handleGlobalChange}
          >
            <option value="Delete-the-oldest-folders-among-all-users-(Recommended)">
              Delete the oldest folders among all users (Recommended)
            </option>
            <option value="Delete-the-oldest-folder-for-the-current-user">
              Delete the oldest folder for the current user
            </option>
          </select>
        </div>

        {/* PC-Specific Settings Table */}
        <div className="pc-section">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                    <th>Nick Name</th>
                    <th>File Type</th>
                    <th>Video Length</th>
                    <th>Capture Interval</th>
                    <th>File Quality (%)</th>
                    <th>Storage Used</th>
                    <th>Client Notification Interval</th>
                    <th>Last Uploaded Time</th>
                    <th>Capture Enabled</th>
                    <th>Delete...</th>
                </tr>
                <tr className="sub-heading">
                    <td>(A name for that computer that you can easily remember)</td>
                    <td>(The type of file to be saved in your storage)</td>
                    <td>
                    (It is applicable, only if you choose to capture the video)
                    </td>
                    <td>(Gap between one capture to another)</td>
                    <td>(Quality of the captured file)</td>
                    <td>(Storage space occupied in MB)</td>
                    <td>(Alert interval for clients about captures)</td>
                    <td>(Last captured time)</td>
                    <td>(Select to capture. Unselect to stop capture)</td>
                    <td>(Delete the client permenantly)</td>
              </tr>
              </thead>
              <tbody>
                {pcSettingsList.map((pc, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={pc.nickName}
                        onChange={(e) =>
                          handlePcChange(index, 'nickName', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={pc.fileType}
                        onChange={(e) =>
                          handlePcChange(index, 'fileType', e.target.value)
                        }
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={pc.fileType === 'video' ? pc.videoLength : ''}
                        onChange={(e) =>
                          handlePcChange(index, 'videoLength', e.target.value)
                        }
                        disabled={pc.fileType !== 'video'}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={pc.captureInterval}
                        onChange={(e) =>
                          handlePcChange(index, 'captureInterval', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={pc.fileQuality}
                        onChange={(e) =>
                          handlePcChange(index, 'fileQuality', e.target.value)
                        }
                      />
                    </td>
                    <td>{pc.storageUsed}</td>
                    <td>
                      <select
                        value={pc.clientNotificationInterval}
                        onChange={(e) =>
                          handlePcChange(index, 'clientNotificationInterval', e.target.value)
                        }
                      >
                        <option value="Do not show screenshot uploaded message to the client">
                          NoUploadMsg
                        </option>
                        <option value="Show daily once">DailyOnce</option>
                        <option value="Show weekly once">WeeklyOnce</option>
                        <option value="Show monthly once">MonthlyOnce</option>                        
                        <option value="Show Quarterly once">QuarterlyOnce</option>
                        <option value="Show Half Yearly once">HalfYearlyOnce</option>
                        <option value="Show Yearly once">YearlyOnce</option>
                      </select>
                    </td>
                    <td>{new Date(pc.lastCapturedTime).toLocaleString()}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={pc.captureEnabled}
                        onChange={(e) =>
                          handlePcChange(index, 'captureEnabled', e.target.checked)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button in Top Right Corner Inside the Blue Frame */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!isModified}
          className={`save-button ${isModified ? 'enabled' : ''}`}
        >
          Save Settings
        </button>
      </form>


    <style jsx>{`
  /* ----------------------------
    // Container Styling
     ---------------------------- */
  .container {
    position: relative;
    max-width: 1000px;
    margin: 20px auto;
    padding: 20px;
    background-color: #4267b2;
    color: white;
    border-radius: 10px;
    font-family: Arial, sans-serif;
  }

  /* ----------------------------
     Page Title Styling
     ---------------------------- */
  h1 {
    text-align: left;
    font-size: 32px;
    margin-bottom: 20px;
    border-bottom: 2px solid white;
    padding-bottom: 20px;
  }

  /* ----------------------------
     Sub-Heading Row Styling
     ---------------------------- */
  .sub-heading {
    font-size: 10px;       /* Ensure a readable small font size */
    color: #f0f0f0;        /* Light gray text for contrast */
    background-color: #3b5998;
    text-align: center;
  }

  .sub-heading td {
    padding: 5px 10px;
    border-top: none;      /* Remove the top border */
  }

  /* ----------------------------
     Form Group for Inline Layout
     ---------------------------- */
  .form-group-inline {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .form-group-inline label {
    width: 25%;            /* Label occupies 25% */
    font-weight: bold;
  }

  .form-group-inline input,
  .form-group-inline select {
    width: 40%;            /* Input/select occupies 40% */
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: black;
    white-space: normal;       /* Allow wrapping */
    overflow: hidden;          /* Prevent text from spilling out */
    text-overflow: ellipsis;   /* Add ellipsis for long text */
    word-wrap: break-word;     /* Ensure long words wrap */
    max-width: 100%;           /* Limit the width */
  }

  /* ----------------------------
     Table Styling
     ---------------------------- */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: white;
    color: black;
    table-layout: fixed;       /* Ensure columns have fixed widths */
  }

  th,
  td {
    border: 2px solid #ddd;
    padding: 10px;
    text-align: center;
    white-space: normal;       /* Allow text wrapping */
    word-wrap: break-word;     /* Wrap long words */
  }

  th {
    background-color: #3b5998;
    color: white;
  }

  /* ----------------------------
     Column Widths for Table
     ---------------------------- */
  th:nth-child(1), td:nth-child(1) { width: 15%; }  /* Nick Name */
  th:nth-child(2), td:nth-child(2) { width: 10%; }  /* File Type */
  th:nth-child(3), td:nth-child(3) { width: 10%; }  /* Video Length */
  th:nth-child(4), td:nth-child(4) { width: 10%; }  /* Capture Interval */
  th:nth-child(5), td:nth-child(5) { width: 10%; }  /* File Quality */
  th:nth-child(6), td:nth-child(6) { width: 10%; }  /* Storage Used */
  th:nth-child(7), td:nth-child(7) { width: 10%; }  /* Client Notification Interval */
  th:nth-child(8), td:nth-child(8) { width: auto; } /* Last Uploaded Time */
  th:nth-child(9), td:nth-child(9) { width: 5%; }   /* Capture Enabled */
  th:nth-child(10), td:nth-child(10) { width: 10%; } /* Delete Client */

  /* ----------------------------
     Save Button Styling
     ---------------------------- */
  .save-button {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #808080; /* Ash color when disabled */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: default;
    box-shadow: none;
    transition: background-color 0.2s, box-shadow 0.2s;
  }

  .save-button.enabled {
    background-color: #008000; /* Green when enabled */
    cursor: pointer;
    box-shadow: 2px 2px 5px black;
  }

  .save-button:disabled {
    background-color: #ccc;
    cursor: default;
    box-shadow: none;
  }

  /* ----------------------------
     Responsive Table Container
     ---------------------------- */
  .table-container {
    width: 100%;
    overflow-x: auto;      /* Enable horizontal scrolling on small screens */
  }
`}</style>

    </div>
  );
}
