'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { useMessage } from '@/context/MessageContext';
import * as constants from '@/utils/constants';
import { productPricing } from '@/utils/pricing';

type GlobalSettings = {
  storagePath: string;
  dateFormat: string;
  whichFoldersToDeleteWhenStorageFull: string;
};

type PcSetting = {
  uuid: string;
  adminEmail: string;
  nickName: string;
  planName: string;
  fileType: string;
  videoLength?: number;
  captureInterval: number;
  fileQuality: number;
  clientNotificationInterval: string;
  lastCapturedTime: string;
  storageUsed: string;
  captureEnabledByAdmin: boolean;
  captureEnabledByDeveloper: boolean;
  isModified?: boolean; // Add this line
};

type Plan = {
  purchaseId: string;
  planActivationDate: string;
  planExpiryDate: string;
  planName: string;
};

type ActivePlan = {
  _id: string;
  purchaseId: string;
  appName: string;
  planName: string;
  planActivationDate: string;
  planExpiryDate: string;
  canUseInThisManyPC: number;
};

type AggregatedPlan = {
  appName: string;
  planName: string;
  totalUsablePCs: number;
  activationDates: Date[];
  expiryDates: Date[];
};

type PurchaseRecord = {
  purchaseId: string;
  planName: string;
};

export default function SettingsPage() {
  const [globalSettings, setGlobalSettings] = useState({
    storagePath: 'SysFile',
    dateFormat: 'DD-MM-YYYY',
    whichFoldersToDeleteWhenStorageFull: 'AmongAll',
  });
  const { data: session } = useSession();
  const [pcSettingsList, setPcSettingsList] = useState<PcSetting[]>([]);
  const [purchaseRecords, setPurchaseRecords] = useState<Plan[]>([]);
  const [activePlans, setActivePlans] = useState<ActivePlan[]>([]);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showMessage } = useMessage();
  const [helpContent, setHelpContent] = useState<string>('');
  const showHelp = (content: string) => {
    setHelpContent(content);
  };
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `/api/screenshotsettings?adminEmail=${session?.user?.email}`,
        );
        if (!res.ok) throw new Error('Failed to fetch settings');

        const data = await res.json();
        setPcSettingsList(data.pcSettings || []);
        setAvailablePlans(data.availablePlans || []);
        setPurchaseRecords(data.purchaseRecords || []); // Correct

        console.log('purchaseRecords in state:', purchaseRecords);
        setGlobalSettings(data.globalSettings || {});
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setIsLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchSettings(); // Call fetchSettings when session is available
    }
  }, [session]);

  //fnNeed. Delete the row.
  const handleDelete = async (uuid: string, nickName: string) => {
    const userInput = prompt(
      `Type the nickname "${nickName}" to confirm deletion:
      
Remember:
It will delete the client settings permanently. The client app will also be deleted automatically when that PC starts next time. If you want to view the screenshots again, you will need to reinstall the client app on that PC.

Tip: You can Off the Capture instead of deleting the client.`,
    );

    if (userInput !== nickName) {
      showMessage('Deletion cancelled or nickname did not match.', {
        vanishTime: 0,
        blinkCount: 2,
        button: constants.MSG.BUTTON.OK,
        icon: constants.MSG.ICON.DANGER,
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/screenshotsettings?uuid=${uuid}&adminEmail=${session?.user?.email}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        showMessage(`Failed to delete client: ${errorText}`, {
          vanishTime: 0,
          blinkCount: 3,
          button: constants.MSG.BUTTON.OK,
          icon: constants.MSG.ICON.DANGER,
        });
        return;
      }

      // Update the local state to remove the deleted record
      const updatedSettings = pcSettingsList.filter((pc) => pc.uuid !== uuid);
      setPcSettingsList(updatedSettings);

      showMessage(
        `Client with nickname "${nickName}" has been deleted successfully.`,
        {
          vanishTime: 3000,
          blinkCount: 0,
          button: constants.MSG.BUTTON.OK,
          icon: 'important',
        },
      );
    } catch (error) {
      console.error('Error details:', error);
      showMessage('An unexpected error occurred. Please try again.', {
        vanishTime: 0,
        blinkCount: 2,
        button: constants.MSG.BUTTON.OK,
        icon: constants.MSG.ICON.DANGER,
      });
    }
  };

  //fnNeed. Handle Global Settings Change.
  const handleGlobalChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const updatedSettings = { ...globalSettings, [name]: value };
    setGlobalSettings(updatedSettings);

    if (session?.user?.email) {
      await handleSaveGlobal(updatedSettings);
    } else {
      showMessage('You must be logged in to save settings.', {
        vanishTime: 3000,
        blinkCount: 2,
        button: constants.MSG.BUTTON.OK,
        icon: constants.MSG.ICON.DANGER,
      });
    }
  };

  //fnNeed. Save global settings.
  const handleSaveGlobal = async (updatedSettings: GlobalSettings) => {
    try {
      const response = await fetch('/api/screenshotsettings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          globalSettings: updatedSettings,
          adminEmail: session?.user?.email,
        }),
      });

      if (response.ok) {
        showMessage('Global settings saved successfully.', {
          vanishTime: 3000,
          blinkCount: 0,
          button: constants.MSG.BUTTON.OK,
          icon: constants.MSG.ICON.SUCCESS,
        });
      } else {
        const errorData = await response.json();
        console.error('Error response status:', response.status);
        console.error('Error response data:', errorData);
        throw new Error(errorData.message || 'Failed to save global settings.');
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = JSON.stringify(error);
      }

      console.error('Save Error:', errorMessage);
      showMessage(`An error occurred: ${errorMessage}`, {
        vanishTime: 0,
        blinkCount: 2,
        button: constants.MSG.BUTTON.OK,
        icon: constants.MSG.ICON.DANGER,
      });
    }
  };

  //fnNeed. Save pc settings from the row.
  const handleSaveRow = async (index: number) => {
    const pcToSave = pcSettingsList[index];

    if (!session?.user?.email) {
      showMessage('You must be logged in to save settings.', {
        vanishTime: 3000,
        blinkCount: 2,
        button: constants.MSG.BUTTON.OK,
        icon: constants.MSG.ICON.ALERT,
      });
      return;
    }

    try {
      const payload = {
        pcSettingsList: [pcToSave], // Only send pcSettingsList
        adminEmail: session.user.email,
      };

      console.log('Saving PC Settings:', payload); // Debug log

      const response = await fetch('/api/screenshotsettings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (response.ok) {
        const updatedSettings = [...pcSettingsList];
        updatedSettings[index].isModified = false;
        setPcSettingsList(updatedSettings);
        showMessage('Settings saved successfully.', {
          vanishTime: 3000,
          blinkCount: 0,
          button: constants.MSG.BUTTON.OK,
          icon: constants.MSG.ICON.SUCCESS,
        });
      } else {
        throw new Error(responseData.message || 'Failed to save settings.');
      }
    } catch (error) {
      console.error('Save Error:', error);
      showMessage(
        `An error occurred: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        {
          vanishTime: 0,
          blinkCount: 2,
          button: constants.MSG.BUTTON.OK,
          icon: constants.MSG.ICON.DANGER,
        },
      );
    }
  };

  //fnNeed. Fetch available plans.
  const fetchAvailablePlans = async (): Promise<Plan[]> => {
    try {
      const res = await fetch(
        `/api/screenshotsettings?adminEmail=${session?.user?.email}`,
      );
      if (!res.ok) throw new Error('Failed to fetch available plans');
      const data = await res.json();
      return data.availablePlans || [];
    } catch (error) {
      console.error('Error fetching available plans:', error);
      return [];
    }
  };

  const handlePlanAssignment = (index: number, selectedPurchaseId: string) => {
    setPcSettingsList((prev) => {
      const newSettings = [...prev];
      newSettings[index] = {
        ...newSettings[index],
        planName: selectedPurchaseId, // Store the purchaseId
      };
      return newSettings;
    });
    setIsModified(true);
  };

  const getAppNameByPlan = (planName: string): string | null => {
    for (const app in productPricing) {
      for (const plan in productPricing[app]) {
        if (plan === planName) {
          return app;
        }
      }
    }
    return null;
  };

  const isPlanActive = (date: string) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate >= new Date();
  };

  //fnNeed: Function to handle changes and auto-save
  const handlePcChange = async (index: number, field: string, value: any) => {
    const updatedSettings = [...pcSettingsList];
    updatedSettings[index] = { ...updatedSettings[index], [field]: value };
    setPcSettingsList(updatedSettings);

    try {
      const pcToSave = updatedSettings[index];
      const response = await fetch('/api/screenshotsettings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pcSettingsList: [pcToSave],
          adminEmail: session?.user?.email,
        }),
      });

      if (response.ok) {
        showMessage('Settings saved successfully.', {
          vanishTime: 3000,
          blinkCount: 0,
          button: constants.MSG.BUTTON.OK,
          icon: constants.MSG.ICON.SUCCESS,
        });
      } else {
        throw new Error('Failed to save settings.');
      }
    } catch (error) {
      console.error('Save Error:', error);
      showMessage('An unexpected error occurred. Please try again.', {
        vanishTime: 0,
        blinkCount: 2,
        button: constants.MSG.BUTTON.OK,
        icon: constants.MSG.ICON.DANGER,
      });
    }
  };

  // Render Loading State
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Render Settings Page
  return (
    <>
      <div className="container">
        <div className="header-container">
          <h1 className="title">Settings</h1>
        </div>

        {/* Global Settings Form */}
        <form>
          <div className="form-container">
            <div className="form-fields">
              <div className="form-group-inline">
                <label className="text-xl font-bold">Storage Path:</label>
                <input
                  type="text"
                  name="storagePath"
                  value={globalSettings.storagePath}
                  onChange={handleGlobalChange}
                  onClick={() =>
                    showHelp(
                      'If you do not know how to set this, just leave it. We will take care and it will be set automatically.',
                    )
                  }
                />
              </div>

              <div className="form-group-inline">
                <label className="text-xl font-bold">
                  Date Format for Daily Folders:
                </label>
                <select
                  name="dateFormat"
                  value={globalSettings.dateFormat}
                  onChange={handleGlobalChange}
                  onClick={() =>
                    showHelp(
                      'If you are confused about this setting, just leave it. We will take care and it will be set automatically.',
                    )
                  }
                >
                  <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                </select>
              </div>

              <div className="form-group-inline">
                <label className="text-xl font-bold">
                  Which folders to delete when storage full:
                </label>
                <select
                  name="whichFoldersToDeleteWhenStorageFull"
                  value={globalSettings.whichFoldersToDeleteWhenStorageFull}
                  onChange={handleGlobalChange}
                  onClick={() =>
                    showHelp(
                      'If you do not know how to set this, just leave it. We will take care and it will be set automatically.',
                    )
                  }
                >
                  <option value="AmongAll">AmongAll</option>
                  <option value="SameUser">SameUser</option>
                </select>
              </div>
            </div>

            <div className="help-box">
              <div className="help-header">Info</div>
              <div
                className="help-content"
                dangerouslySetInnerHTML={{ __html: helpContent }}
              ></div>
            </div>
          </div>

          {/* PC-Specific Settings Table */}
          <div
            className="pc-section"
            style={{ overflowX: 'auto', paddingBottom: '20px' }}
          >
            <div style={{ overflowX: 'auto' }}>
              <div className="table-container"></div>
              <table>
                <thead className="text-lg font-semibold">
                  <tr>
                    <th
                      onClick={() =>
                        showHelp('Assign the plan which you need for this PC.')
                      }
                    >
                      {' '}
                      Assigned Plan{' '}
                    </th>
                    <th
                      onClick={() =>
                        showHelp(
                          'The PC/User name, which you can easily remeber. Screenshot files will be stored in a folder with this name in Google Drive. Leave empty store files under PC-s original name (Ie. Host name).',
                        )
                      }
                    >
                      Nick Name
                    </th>
                    <th
                      onClick={() =>
                        showHelp(
                          'You can specify the screenshot format, such as Image or Video depending on your requirements. Image is generally recommended.',
                        )
                      }
                    >
                      Capture Type{' '}
                    </th>
                    <th
                      onClick={() =>
                        showHelp(
                          'Specify the video length you want to capture and upload. If you select 5, a video will be captured for 5 seconds. It applies only when you select "video" as your capture type. Short videos are recommended, such as 5-second clips.',
                        )
                      }
                    >
                      Video Length{' '}
                    </th>

                    <th
                      onClick={() =>
                        showHelp(
                          'The gap between one capture and the next. If you select 60, a screenshot will be captured every 60 seconds.',
                        )
                      }
                    >
                      Capture Interval
                    </th>
                    <th
                      onClick={() =>
                        showHelp('Quality of the file to be captured.')
                      }
                    >
                      File Quality
                    </th>
                    {/* <th onClick={() => showHelp('Storage space occupied in MB.')}>Storage Used</th> */}
                    <th
                      onClick={() =>
                        showHelp(
                          'Alert interval for your clients about captures. Notification will be shown in your client PC based on this interval',
                        )
                      }
                    >
                      Client PC Notification
                    </th>
                    {/* <th onClick={() => showHelp('Screenshot last captured time).')}>Last Uploaded Time</th> */}
                    <th
                      onClick={() =>
                        showHelp('Select to capture. Unselect to stop capture.')
                      }
                    >
                      On/Off Capture
                    </th>
                    <th
                      onClick={() =>
                        showHelp(
                          'It will delete the client settings permanently. The client app will also be deleted automatically when that PC starts next time. If you want to view the screenshots again, you will need to reinstall the client app on that PC.',
                        )
                      }
                    >
                      Del
                    </th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    fontFamily: "'Verdana', sans-serif, 'Arial', 'helvetica'",
                  }}
                >
                  {pcSettingsList.map((pc, index) => (
                    <tr key={pc.uuid}>
                      {!purchaseRecords.length ? (
                        <td colSpan={9}>Loading...</td>
                      ) : (
                        <>
                          {/* Assigned Plan Dropdown */}
                          <td className="relative">
                            <div className="relative">
                              <select
                                value={pc.planName || ''}
                                onChange={(e) =>
                                  handlePcChange(
                                    index,
                                    'planName',
                                    e.target.value,
                                  )
                                }
                                onClick={async () => {
                                  const latestPlans =
                                    await fetchAvailablePlans();
                                  setAvailablePlans(
                                    latestPlans.filter(
                                      (plan: Plan) =>
                                        plan.purchaseId !== pc.planName,
                                    ),
                                  );
                                }}
                                className="p-2 border rounded"
                              >
                                {/* Empty option for deselecting */}
                                <option value=""></option>

                                {/* Show the current plan in the desired format */}
                                {(() => {
                                  const currentPlan = purchaseRecords.find(
                                    (record) =>
                                      record.purchaseId === pc.planName,
                                  );
                                  if (currentPlan) {
                                    return (
                                      <option
                                        key={currentPlan.purchaseId}
                                        value={currentPlan.purchaseId}
                                      >
                                        {`[${new Date(
                                          currentPlan.planActivationDate,
                                        ).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                        })} - ${new Date(
                                          currentPlan.planExpiryDate,
                                        ).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                        })}] - ${currentPlan.planName}`}
                                      </option>
                                    );
                                  }
                                  // Fallback to show raw planName if details are not found
                                  return pc.planName ? (
                                    <option value={pc.planName}>
                                      {pc.planName}
                                    </option>
                                  ) : null;
                                })()}

                                {/* Dynamically fetched available plans */}
                                {availablePlans.map((plan: Plan) => (
                                  <option
                                    key={plan.purchaseId}
                                    value={plan.purchaseId}
                                  >
                                    {`[${new Date(
                                      plan.planActivationDate,
                                    ).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })} - ${new Date(
                                      plan.planExpiryDate,
                                    ).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })}] - ${plan.planName}`}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>

                          {/* Nickname Input */}
                          <td>
                            <input
                              type="text"
                              value={pc.nickName}
                              onChange={(e) =>
                                handlePcChange(
                                  index,
                                  'nickName',
                                  e.target.value,
                                )
                              }
                              className="p-2 border rounded"
                            />
                          </td>

                          {/* File Type Dropdown */}
                          <td>
                            <select
                              value={pc.fileType}
                              onChange={(e) =>
                                handlePcChange(
                                  index,
                                  'fileType',
                                  e.target.value,
                                )
                              }
                              className="p-2 border rounded"
                            >
                              <option value="image">Image</option>
                              <option value="video">Video</option>
                            </select>
                          </td>

                          {/* Video Length */}
                          <td>
                            <select
                              value={
                                pc.fileType === 'video' ? pc.videoLength : ''
                              }
                              onClick={() =>
                                showHelp(
                                  'Specify the video length you want to capture and upload. If you select 5, a video will be captured for 5 seconds. It applies only when you select "video" as your capture type. Short videos are recommended, such as 5-second clips.',
                                )
                              }
                              onChange={(e) =>
                                handlePcChange(
                                  index,
                                  'videoLength',
                                  parseInt(e.target.value, 10),
                                )
                              }
                              disabled={pc.fileType !== 'video'}
                              className="p-2 border rounded"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(
                                (length) => (
                                  <option key={length} value={length}>
                                    {`${length} Second${length > 1 ? 's' : ''}`}
                                  </option>
                                ),
                              )}
                            </select>
                          </td>

                          {/* Other fields */}
                          <td>
                            <select
                              value={pc.captureInterval}
                              onClick={() =>
                                showHelp(
                                  'The gap between one capture and the next. If you select 60, a screenshot will be captured every 60 seconds.',
                                )
                              }
                              onChange={(e) =>
                                handlePcChange(
                                  index,
                                  'captureInterval',
                                  parseInt(e.target.value, 10),
                                )
                              }
                              className="p-2 border rounded"
                            >
                              {[
                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 40,
                                50,
                              ].map((interval) => (
                                <option key={interval} value={interval}>
                                  {`${interval} Second${
                                    interval > 1 ? 's' : ''
                                  }`}
                                </option>
                              ))}
                              {/* Minutes */}
                              <option value={60}>1 Minute</option>
                              <option value={120}>2 Minutes</option>
                              <option value={180}>3 Minutes</option>
                              <option value={300}>5 Minutes</option>
                              <option value={600}>10 Minutes</option>
                              <option value={900}>15 Minutes</option>
                              <option value={1200}>20 Minutes</option>
                              <option value={1800}>30 Minutes</option>
                              <option value={2700}>45 Minutes</option>

                              {/* Hours */}
                              <option value={3600}>1 Hour</option>
                              <option value={7200}>2 Hours</option>
                              <option value={10800}>3 Hours</option>
                              <option value={14400}>4 Hours</option>
                              <option value={18000}>5 Hours</option>

                              {/* Special Option */}
                              <option value={0}>At PC Startup</option>
                            </select>
                          </td>

                          {/* File Quality */}
                          <td>
                            <select
                              value={pc.fileQuality}
                              onClick={() =>
                                showHelp('Quality of the file to be captured.')
                              }
                              onChange={(e) =>
                                handlePcChange(
                                  index,
                                  'fileQuality',
                                  parseInt(e.target.value, 10),
                                )
                              }
                              className="p-2 border rounded"
                            >
                              {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10].map(
                                (quality) => (
                                  <option key={quality} value={quality}>
                                    {`${quality}% Quality`}
                                  </option>
                                ),
                              )}
                            </select>
                          </td>

                          {/* Client Notification Interval */}
                          <td>
                            <select
                              value={pc.clientNotificationInterval}
                              onClick={() =>
                                showHelp(
                                  'Alert interval for your clients about captures. Notification will be shown in your client PC based on this interval',
                                )
                              }
                              onChange={(e) =>
                                handlePcChange(
                                  index,
                                  'clientNotificationInterval',
                                  e.target.value,
                                )
                              }
                              className="p-2 border rounded"
                            >
                              <option value="Do not show any message">
                                Do not show any message
                              </option>
                              <option value="At PC Startup">
                                At PC Startup
                              </option>
                              <option value="Daily Once">Daily Once</option>
                              <option value="Weekly Once">Weekly Once</option>
                              <option value="Monthly Once">Monthly Once</option>
                              <option value="Quarterly Once">
                                Quarterly Once
                              </option>
                              <option value="HalfYearly Once">
                                HalfYearly Once
                              </option>
                              <option value="Yearly Once">Yearly Once</option>
                            </select>
                          </td>

                          {/* Capture Enabled Checkbox */}
                          <td>
                            <input
                              type="checkbox"
                              checked={pc.captureEnabledByAdmin}
                              onClick={() =>
                                showHelp(
                                  'Select to capture. Unselect to stop capture.',
                                )
                              }
                              onChange={(e) =>
                                handlePcChange(
                                  index,
                                  'captureEnabledByAdmin',
                                  e.target.checked,
                                )
                              }
                              style={{
                                color: 'lightgreen',
                                width: '24px',
                                height: '24px',
                              }}
                            />
                          </td>

                          {/* Delete Action */}
                          <td>
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="delete-icon"
                              onClick={() => handleDelete(pc.uuid, pc.nickName)}
                              style={{
                                color: 'red',
                                width: '24px',
                                height: '24px',
                              }} // Adjust size as needed
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        .container {
          width: 100%;
          height: 100%;
          max-width: 100%; /* Ensure no maximum width constraint */
          padding: 20px;
          background-color: #4267b2;
          color: white;
          border-radius: 10px;
          box-sizing: border-box;
          font-family: Verdana, Arial, sans-serif;
        }

        .pc-section {
          width: 100%;
          max-width: 100%; /* Ensure the section takes the full width */
          overflow-x: auto;
          padding-bottom: 20px;
        }

        .table-container {
          width: 100%;
          max-width: 100%; /* Ensure table container takes full width */
          margin-top: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          color: black;
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 6px solid white; /* Full-length divider line */
          padding-bottom: 10px; /* Space below the line */
        }

        .title {
          margin: 0;
          font-size: 32px;
        }

        .form-container {
          display: flex;
          gap: 10px; /* Minimal gap between form fields and help box */
          align-items: flex-start;
          padding: 0px 0px 0px 0px;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 10px; /* Space between each form group */
          width: 65%; /* Allocate 65% width for form fields */
        }

        .form-group-inline {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-group-inline label {
          width: 40%; /* Fixed width for labels */
          font-weight: bold;
        }

        .form-group-inline input,
        .form-group-inline select {
          width: 40%; /* Fixed width for input/select boxes */
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          color: black;
        }

        .help-box {
          width: 35%; /* Allocate 35% width for the help box */
          height: 200px;
          padding: 5px 0px 0px 0px;
          background-color: #4267b2; /* Match the main blue color */
          color: white;
          border: 1px solid #365899;
          border-radius: 4px;
          font-size: 16px;
          line-height: 1.4;
          text-align: center;
          word-wrap: break-word;
          overflow-y: auto; /* Vertical scroll for long text */
          box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2); /* Mild black shadow */
        }

        .help-header {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px; /* Space below the header */
          padding-bottom: 5px;
          border-bottom: 1px solid black; /* Divider line under the header */
        }

        .help-content {
          flex: 1; /* Take the remaining vertical space */
          padding: 1px 10px 25px 25px;
          overflow-y: auto; /* Enable scrolling for long content */
        }

        /* ----------------------------
   Table Cell Styling
   ---------------------------- */
        th,
        td {
          height: 50px; /* Set a fixed height for all rows */
          border: 2px solid #ddd;
          padding: 10px;
          text-align: center;
          white-space: normal; /* Allow text wrapping */
          word-wrap: break-word; /* Ensure long words wrap */
          overflow: hidden; /* Hide overflow content */
          text-overflow: ellipsis; /* Add ellipsis for overflowing text */
        }
        th {
          padding: 1px 1px; /* Reduce vertical padding to minimize space */
          line-height: 1.2; /* Adjust line height to minimize space between lines */
          height: 70px; /* Let height adjust automatically based on content */
          white-space: normal; /* Allow text wrapping */
          word-wrap: break-word; /* Wrap long words */
          text-align: center; /* Keep text centered */
          overflow: hidden; /* Hide any overflowing text */
          text-overflow: ellipsis; /* Add ellipsis for text overflow */
          background-color: #3b5998;
          color: white;
          user-select: none;
        }
        td input {
          padding-right: 10px;
          width: 100%; /* Ensure input takes the full width within the cell */
          box-sizing: border-box; /* Include padding in the width calculation */
        }
        /* Delete Icon */
        .delete-icon {
          fill: red;
          cursor: pointer;
          font-size: 20px;
          transition: fill 0.2s;
        }

        .delete-icon:hover {
          fill: darkred;
        }
      `}</style>
    </>
  );
}
