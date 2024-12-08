'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
    
  // ----------------------------
  // Function to handle header clicks and set help content
  // ----------------------------
  const [helpContent, setHelpContent] = useState('');
    const showHelp = (content) => {
      setHelpContent(content);
    };
    
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
        <div className="form-container">
            <div className="form-fields">
                <div className="form-group-inline">
                    <label>Storage Path:</label>
                    <input type="text" name="storagePath" 
                    value={globalSettings.storagePath}
                        onChange={handleGlobalChange}/>
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
            </div>
          
            <div className="help-box">
                {helpContent}
            </div>
        </div>



        {/* PC-Specific Settings Table */}
        <div className="pc-section">
          <div style={{ overflowX: 'auto' }}>
           {/* Table with Clickable Headers */}
            <div className="table-container">
            </div> <table>
              <thead>
                <tr>
                <th onClick={() => showHelp('Enter a unique name for the PC.')}>
                Nick Name
              </th>
                    <th>File Type</th>
                    <th>Video Length <br />  <br /> (If File Type is Video)</th>
                    <th>Capture Interval</th>
                    <th>File Quality (%) <br /> 10=Poor <br /> 50=Normal <br /> 100=High</th>
                    <th>Storage Used</th>
                    <th>Client Notification Interval</th>
                    <th>Last Uploaded Time</th>
                    <th>Capture Enabled</th>
                    <th>Delete...</th>
                </tr>

                {/* <tr className="sub-heading">
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
              </tr> */}
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
   Form Container Styling
   ---------------------------- */
.form-container {
  display: flex;
  gap: 20px;                /* Space between form fields and help box */
  align-items: flex-start;  /* Align items at the top */
}

/* ----------------------------
   Form Fields Container
   ---------------------------- */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;                /* Space between each form group */
  width: 65%;               /* Allocate 65% width for form fields */
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
   Form Group Inline Styling
   ---------------------------- */
.form-group-inline {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group-inline label {
  width: 40%;               /* Fixed width for labels */
  font-weight: bold;
}

.form-group-inline input,
.form-group-inline select {
  width: 60%;               /* Fixed width for input/select boxes */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: black;
}

/* ----------------------------
   Help Box Styling
   ---------------------------- */
.help-box {
  width: 35%;               /* Allocate 35% width for the help box */
  min-height: 150px;
  padding: 10px;
  background-color: #4267b2; /* Match the main blue color */
  color: white;
  border: 1px solid #365899;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
  word-wrap: break-word;
  overflow-y: auto;         /* Vertical scroll for long text */
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2); /* Mild black shadow */
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
    /* ----------------------------
   Table Cell Styling
   ---------------------------- */
    th,
    td {
        height: 50px;              /* Set a fixed height for all rows */
        border: 2px solid #ddd;
        padding: 10px;
        text-align: center;
        white-space: normal;       /* Allow text wrapping */
        word-wrap: break-word;     /* Ensure long words wrap */
        overflow: hidden;          /* Hide overflow content */
        text-overflow: ellipsis;   /* Add ellipsis for overflowing text */
    }

    th {
        padding: 1px 1px;      /* Reduce vertical padding to minimize space */
        line-height: 1;       /* Adjust line height to minimize space between lines */
        height: auto;           /* Let height adjust automatically based on content */
        white-space: normal;    /* Allow text wrapping */
        word-wrap: break-word;  /* Wrap long words */
        text-align: center;     /* Keep text centered */
        overflow: hidden;       /* Hide any overflowing text */
        text-overflow: ellipsis;/* Add ellipsis for text overflow */
        background-color: #3b5998;
        color: white;
        user-select: none;
    }
         /* ----------------------------
    Column Widths for Table
    ---------------------------- */
    th:nth-child(1), td:nth-child(1) { width: 15%; }  /* Nick Name */
    th:nth-child(2), td:nth-child(2) { width: 10%; }  /* File Type */
    th:nth-child(3), td:nth-child(3) { width: 8%; }   /* Video Length */
    th:nth-child(4), td:nth-child(4) { width: 10%; }  /* Capture Interval */
    th:nth-child(5), td:nth-child(5) { width: 12%; }  /* File Quality */
    th:nth-child(6), td:nth-child(6) { width: 10%; }  /* Storage Used */
    th:nth-child(7), td:nth-child(7) { width: 15%; }  /* Client Notification Interval */
    th:nth-child(8), td:nth-child(8) { width: 15%; }  /* Last Uploaded Time */
    th:nth-child(9), td:nth-child(9) { width: 5%; }   /* Capture Enabled */

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
