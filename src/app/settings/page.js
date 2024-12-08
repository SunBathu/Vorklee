'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [globalSettings, setGlobalSettings] = useState({
        storagePath: 'SysFile',
        dateFormat: 'DD-MM-YYYY',
    });

    const [pcSettingsList, setPcSettingsList] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Fetch settings on load
    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings');
            if (!response.ok) throw new Error('Failed to fetch settings.');

            const data = await response.json();
            setGlobalSettings({
                storagePath: data.globalSettings?.storagePath || 'SysFile',
                dateFormat: data.globalSettings?.dateFormat || 'DD-MM-YYYY',
                whichFoldersToDeleteWhenStorageFull: data.globalSettings?.whichFoldersToDeleteWhenStorageFull || 'Delete the oldest folders among all users (Recommended)',
            });
            setPcSettingsList(data.pcSettings || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // Handle global settings change
    const handleGlobalChange = (e) => {
        const { name, value } = e.target;
        setGlobalSettings((prev) => ({ ...prev, [name]: value }));
        autoSave(globalSettings, pcSettingsList);
    };

    // Handle PC-specific settings change and auto-save
    const handlePcChange = (index, field, value) => {
        const updatedSettings = [...pcSettingsList];
        updatedSettings[index][field] = value;
        setPcSettingsList(updatedSettings);
        autoSave(globalSettings, updatedSettings);
    };

    const autoSave = async (globalSettings, pcSettingsList) => {
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ globalSettings, pcSettingsList }),
            });
            setMessage('Settings automatically saved.');
        } catch {
            setMessage('Failed to save settings.');
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container">
            <h1>Settings</h1>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <form>
                <div className="form-row">
                    <div className="form-group">
                        <label>Storage Path:</label>
                        <input
                            type="text"
                            name="storagePath"
                            value={globalSettings.storagePath}
                            onChange={handleGlobalChange}
                        />
                    </div>

                    <div className="form-group">
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
                </div>
                <div className="form-group-Deltype">
                        <label>Which folders to delete when storage full:</label>
                        <select
                            name="whichFoldersToDeleteWhenStorageFull"
                            value={globalSettings.whichFoldersToDeleteWhenStorageFull}
                            onChange={handleGlobalChange}                        >
                            <option value="Delete-the-oldest-folders-among-all-users-(Recommended)">Delete the oldest folders among all users (Recommended)</option>
                            <option value="Delete-the-oldest-folder-for-the-current-user">Delete the oldest folder for the current user</option>
                        </select>
                </div>                                
                <div className="pc-section">
                    <table>
                        <thead>
                            <tr>
                                <th>Nick Name</th>                               
                                <th>File Type</th>
                                <th>Video Length (Seconds)</th>
                                <th>Screenshot Interval (Seconds)</th>
                                <th>File Quality (%)</th>
                                <th>Storage Used</th>
                                <th>Client Notification Interval</th>
                                <th>Last Uploaded Time</th>
                                <th>Capture Enabled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pcSettingsList.map((pc, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="text"
                                            value={pc.nickName}
                                            onChange={(e) => handlePcChange(index, 'nickName', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            value={pc.fileType}
                                            onChange={(e) => handlePcChange(index, 'fileType', e.target.value)}
                                        >
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={pc.fileType === 'video' ? pc.videoLength : ''}
                                            onChange={(e) => handlePcChange(index, 'videoLength', e.target.value)}
                                            disabled={pc.fileType !== 'video'}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={pc.captureinterval}
                                            onChange={(e) => handlePcChange(index, 'captureinterval', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={pc.fileQuality}
                                            onChange={(e) => handlePcChange(index, 'fileQuality', e.target.value)}
                                        />
                                    </td>                                   
                                    <td>
                                        <select
                                            value={pc.clientNotificationInterval}
                                            onChange={(e) => handlePcChange(index, 'clientNotificationInterval', e.target.value)}                                        >
                                            <option value="Do not show screenshot uploaded message to the client">NoUploadMsg</option>
                                            <option value="Show daily once">DailyOnce</option>
                                            <option value="Show Weekly once">WeeklyOnce</option>
                                            <option value="Show Monthly once">MonthlyOnce</option>                                            
                                            <option value="Show Quarterly once">QuarterlyOnce</option>                                            
                                            <option value="Show Half Yearly once">HalfYearlyOnce</option>
                                            <option value="Show Yearly once">YearlyOnce</option>
                                        </select>
                                    </td>
                                    <td>{new Date(pc.lastCapturedTime).toLocaleString()}</td>
                                    <td>{pc.storageUsed}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={pc.captureEnabled}
                                            onChange={(e) => handlePcChange(index, 'captureEnabled', e.target.checked)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>

            <style jsx>{`
                .container {
                    max-width: 1000px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #4267B2;
                    color: white;
                    border-radius: 10px;
                    font-family: Arial, sans-serif;
                }

                h1 {
                    text-align: center;
                    font-size: 32px;
                    margin-bottom: 10px;
                    border-bottom: 2px solid white;
                    padding-bottom: 10px;
                }

                .success {
                    text-align: center;
                    color: lightgreen;
                    margin-bottom: 20px;
                }

                .error {
                    text-align: center;
                    color: red;
                    margin-bottom: 20px;
                }

                .form-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .form-group {
                    width: 48%;
                }

                label {
                    display: block;
                    margin-bottom: 5px;
                }

                input,
                select {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    color: black;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background-color: white;
                    color: black;
                }

                th,
                td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: center;
                }

                th {
                    background-color: #3b5998;
                    color: white;
                }
            `}</style>
        </div>
    );
}
