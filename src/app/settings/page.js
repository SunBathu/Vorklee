"use client";

import { useEffect, useState } from "react";

const GlobalSettingsPage = () => {
    const [settings, setSettings] = useState({
        storagePath: "",
        imageType: "jpg",
        dateFormat: "dd.MM.yyyy",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch("/api/settings");
                if (!response.ok) {
                    const errorData = await response.text();
                    console.error("API Error Response:", errorData);
                    throw new Error("Failed to fetch settings.");
                }
                const data = await response.json();
                setSettings(data);
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
    
        fetchSettings();
    }, []);
    

    const handleSave = async () => {
        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
    
            if (!response.ok) {
                const errorData = await response.text(); // Log the error response
                console.error("API Error Response:", errorData);
                alert(`Failed to save settings: ${errorData}`);
                return;
            }
    
            const result = await response.json();
            alert(result.message || "Settings saved successfully!");
        } catch (error) {
            console.error("Error in handleSave:", error);
            alert("An error occurred while saving settings.");
        }
    };
    

    return (
        <div>
            <h1>Global Settings</h1>
            <form>
                <div>
                    <label>Storage Path:</label>
                    <input
                        type="text"
                        value={settings.storagePath}
                        onChange={(e) =>
                            setSettings({ ...settings, storagePath: e.target.value })
                        }
                        placeholder="Enter storage path"
                    />
                </div>
                <div>
                    <label>Image Type:</label>
                    <select
                        value={settings.imageType}
                        onChange={(e) =>
                            setSettings({ ...settings, imageType: e.target.value })
                        }
                    >
                        <option value="jpg">JPG</option>
                        <option value="png">PNG</option>
                    </select>
                </div>
                <div>
                    <label>Date Format:</label>
                    <input
                        type="text"
                        value={settings.dateFormat}
                        onChange={(e) =>
                            setSettings({ ...settings, dateFormat: e.target.value })
                        }
                        placeholder="e.g., dd.MM.yyyy"
                    />
                </div>
                <button type="button" onClick={handleSave}>
                    Save Settings
                </button>
            </form>
        </div>
    );
};

export default GlobalSettingsPage;
