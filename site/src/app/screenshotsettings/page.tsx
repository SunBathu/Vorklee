'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { useMessage } from '@/context/MessageContext';
import * as constants from '@/utils/constants';
import { productPricing } from '@/utils/pricing';



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
};

type Plan = {
  purchaseId: string;
  planName: string;
  planActivationDate: string;
  planExpiryDate: string;
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


export default function SettingsPage() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [globalSettings, setGlobalSettings] = useState({storagePath: 'SysFile', dateFormat: 'DD-MM-YYYY', whichFoldersToDeleteWhenStorageFull: 'AmongAll', });
  const [pcSettingsList, setPcSettingsList] = useState<PcSetting[]>([]);
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showMessage } = useMessage();
  const [helpContent, setHelpContent] = useState<string>('');
  const showHelp = (content: string) => { setHelpContent(content); };

  // Fetch Settings on Load
 useEffect(() => {
  const fetchSettingsAndPlans = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch(`/api/screenshotsettings?adminEmail=${session.user.email}`);
      console.log('Admin Email:', session?.user?.email);
      const plansResponse = await fetch(`/api/activePlans?adminEmail=${session.user.email}`);


      if (!response.ok || !plansResponse.ok) {
        showMessage('Failed to fetch settings or plans.', {
          vanishTime: 0,
          blinkCount: 2,
          buttons: 'okCancel',
          icon: 'alert',
        });
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const { plans } = await plansResponse.json();

      console.log('Fetched Active Plans:', plans); // Debug the fetched plans

      setGlobalSettings(data.globalSettings || {});
      setPcSettingsList(data.pcSettings || []);
      setPlans(plans || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      showMessage('An unexpected error occurred. Please try again later.', {
        vanishTime: 0,
        blinkCount: 2,
        buttons: 'okCancel',
        icon: 'danger',
      });
      setIsLoading(false);
    }
  };

  fetchSettingsAndPlans();
}, [session]);



const handlePlanAssignment = (index: number, purchaseId: string) => {
  const updatedPcSettings = [...pcSettingsList];
  updatedPcSettings[index] = { ...updatedPcSettings[index], planName: purchaseId };
  setPcSettingsList(updatedPcSettings);
  setIsModified(true);
  console.log('Updated PC Settings List:', updatedPcSettings); // Debugging line
};


  // Save Settings to the Server
  const handleSave = async () => {
    if (!session?.user?.email) {
    showMessage('You are not logged in. Please log in to save settings.', {
      vanishTime: 0,
      blinkCount: 2,
      buttons: 'okCancel',
      icon: 'alert',
    });
    return;
  }

  // Validate that each PC setting has a UUID
  if (pcSettingsList.some((pcSetting) => !pcSetting.uuid)) {
    showMessage(
      'One or more PC settings are missing a UUID. You have to re-install the app in that PC.',
      {
        vanishTime: 0,
        blinkCount: 2,
        buttons: 'okCancel',
        icon: 'danger',
      },
    );
    return;
  }

  try {
    // Fetch active plans

    const activePlansResponse = await fetch('/api/activePlans');
    if (!activePlansResponse.ok) throw new Error('Failed to fetch active plans');

    const activePlansData = await activePlansResponse.json();

    // Extract active quantities for each app-plan combination
const getActivePlanQty = (appName: string, planName: string) => {
  return activePlansData.find((plan: { _id: { appName: string; planName: string }; totalQuantity: number }) =>
    plan._id.appName === appName && plan._id.planName === planName
  )?.totalQuantity || 0;
};



    // **Validation to check plan assignment limits**
    const planUsage: { [key: string]: number } = {};
    pcSettingsList.forEach((pc) => {
      if (pc.planName) {
        planUsage[pc.planName] = (planUsage[pc.planName] || 0) + 1;
      }
    });

  for (const planId in planUsage) {
  const selectedPlan = plans.find((plan) => plan.purchaseId === planId);
  if (selectedPlan) {
    const appName = getAppNameByPlan(selectedPlan.planName);
    if (!appName) {
      showMessage(`Failed to determine app for plan "${selectedPlan.planName}".`, {
        vanishTime: 0,
        blinkCount: 3,
        buttons: 'okCancel',
        icon: 'danger',
      });
      return;
    }

    if (planUsage[planId] > getActivePlanQty(appName, selectedPlan.planName)) {
      showMessage(
        `Cannot assign more than the available quantity for plan "${selectedPlan.planName}" in app "${appName}".`,
        {
          vanishTime: 0,
          blinkCount: 3,
          buttons: 'okCancel',
          icon: 'danger',
        },
      );
      return;
    }
  }
}


    const activeScreenshotBasic = getActivePlanQty(constants.APP_CAPTURE, constants.PLAN_BASIC);
    const activeScreenshotStandard = getActivePlanQty(constants.APP_CAPTURE, constants.PLAN_STANDARD);
    const activeScreenshotPremium = getActivePlanQty(constants.APP_CAPTURE, constants.PLAN_PREMIUM);
    const activeNotesBasic = getActivePlanQty(constants.APP_NOTES, constants.PLAN_BASIC);
    const activeNotesStandard = getActivePlanQty(constants.APP_NOTES,  constants.PLAN_STANDARD);
    const activeNotesPremium = getActivePlanQty(constants.APP_NOTES, constants.PLAN_PREMIUM);

    // Count assigned plans
    const assignedScreenshotBasic = pcSettingsList.filter(pc => pc.nickName === 'Screenshot Capture App' && pc.fileType === 'basic').length;
    const assignedScreenshotStandard = pcSettingsList.filter(pc => pc.nickName === 'Screenshot Capture App' && pc.fileType === 'standard').length;
    const assignedScreenshotPremium = pcSettingsList.filter(pc => pc.nickName === 'Screenshot Capture App' && pc.fileType === 'premium').length;
    const assignedNotesBasic = pcSettingsList.filter(pc => pc.nickName === 'Notes App' && pc.fileType === 'basic').length;
    const assignedNotesStandard = pcSettingsList.filter(pc => pc.nickName === 'Notes App' && pc.fileType === 'standard').length;
    const assignedNotesPremium = pcSettingsList.filter(pc => pc.nickName === 'Notes App' && pc.fileType === 'premium').length;



    // Validation
    if (assignedScreenshotBasic > activeScreenshotBasic ||
        assignedScreenshotStandard > activeScreenshotStandard ||
        assignedScreenshotPremium > activeScreenshotPremium ||
        assignedNotesBasic > activeNotesBasic ||
        assignedNotesStandard > activeNotesStandard ||
        assignedNotesPremium > activeNotesPremium) {
      showMessage(
        `Cannot assign more than the available active plans:\n` +
        `Screenshot Capture App - Basic: ${activeScreenshotBasic}, Standard: ${activeScreenshotStandard}, Premium: ${activeScreenshotPremium}\n` +
        `Notes App - Basic: ${activeNotesBasic}, Standard: ${activeNotesStandard}, Premium: ${activeNotesPremium}`, {
          vanishTime: 0,
          blinkCount: 3,
          buttons: 'okCancel',
          icon: 'danger',
        }
      );
      return;
    }
        console.log('PC Settings List:', pcSettingsList);
console.log('Payload:', {
  globalSettings,
  pcSettingsList: pcSettingsList.map((pc) => ({
    ...pc,
    planName: pc.planName,
  })),
  adminEmail: session.user.email,
});
    const response = await fetch('/api/screenshotsettings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        globalSettings,
        pcSettingsList: pcSettingsList.map((pc) => ({
          ...pc,
          // Highlighted change to ensure planName (purchaseId) is included
          planName: pc.planName,
        })),
        adminEmail: session.user.email,
      }),
    });
console.log('Response Status:', response.status);
console.log('Response Text:', await response.text());
      if (response.status === 404) {
        showMessage('You have not purchased. So, you cannot save settings.', {
          vanishTime: 0,
          blinkCount: 3,
          buttons: 'okCancel',
          icon: 'danger',
        });
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save Error:', errorText);
        showMessage(`Failed to save settings: ${errorText}`, {
          vanishTime: 0,
          blinkCount: 3,
          buttons: 'okCancel',
          icon: 'danger',
        });
        return;
      }

      showMessage('Settings saved successfully.', {
        vanishTime: 3000,
        blinkCount: 0,
        buttons: 'okCancel',
        icon: 'important',
      });
      setIsModified(false);
    } catch (error) {
      showMessage('An unexpected error occurred. Please try again.', {
        vanishTime: 0,
        blinkCount: 2,
        buttons: 'okCancel',
        icon: 'danger',
      });
    }
  };

    const isPlanActive = (date: string) => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime()) && parsedDate >= new Date();
};


  const handleDelete = async (uuid: string, nickName: string) => {
    const userInput = prompt(
      `Type the nickname "${nickName}" to confirm deletion:`,
    );

    if (userInput !== nickName) {
      showMessage('Deletion cancelled or nickname did not match.', {
        vanishTime: 0,
        blinkCount: 2,
        buttons: 'okCancel',
        icon: 'danger',
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
          buttons: 'okCancel',
          icon: 'danger',
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
          buttons: 'okCancel',
          icon: 'important',
        },
      );
    } catch (error) {
      showMessage('An unexpected error occurred. Please try again.', {
        vanishTime: 0,
        blinkCount: 2,
        buttons: 'okCancel',
        icon: 'danger',
      });
    }
  };

  // Handle Global Settings Change
  const handleGlobalChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setGlobalSettings((prev) => ({ ...prev, [name]: value }));
    setIsModified(true);
  };

  // Handle PC-Specific Settings Change
  const handlePcChange = (
    index: number,
    field: keyof PcSetting,
    value: string | number | boolean,
  ) => {
    const updatedSettings = [...pcSettingsList];
    updatedSettings[index] = { ...updatedSettings[index], [field]: value };
    setPcSettingsList(updatedSettings);
    setIsModified(true);
  };

  // Render Loading State
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Render Settings Page
  return (
    <div className="container">
      <div className="header-container">
        <h1 className="title">Settings</h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isModified}
          className={`save-button ${isModified ? 'enabled' : ''}`}
        >
          Save Settings
        </button>
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
            <div className="help-content">{helpContent}</div>
          </div>
        </div>

        {/* PC-Specific Settings Table */}
        <div
          className="pc-section"
          style={{ overflowX: 'auto', paddingBottom: '20px' }}
        >
          <div style={{ overflowX: 'auto' }}>
            {/* Table with Clickable Headers */}
            <div className="table-container"></div>{' '}
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
                        'The PC/User name, which you can easily remeber. Screenshot files will be stored in a folder with this name in Google Drive.',
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
                    Screenshot Upload Type{' '}
                  </th>
                  {/* <th onClick={() =>showHelp('It applies only when you select "video" as your file type. Short videos are recommended, such as 5-second clips.',)}>Video Length</th> */}
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
                        'Delete the client permanently. The client app will also be deleted automatically when that PC starts next. If you want to view the screenshots again, you will need to reinstall the client app on that PC.',
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
            <tr key={index}>
<td>
  <select
    value={pc.planName}
    onChange={(e) => handlePlanAssignment(index, e.target.value)}
    className="p-2 border rounded"
  >
    <option value="">Select Plan</option>
    {plans.map((plan) => {
      console.log('Plan Details:', plan); // Debug each plan entry
      return (
        <option key={plan.purchaseId} value={plan.purchaseId}>
          {plan.planName
            ? `${plan.planName} - [${new Date(plan.planActivationDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })} - ${new Date(plan.planExpiryDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}]`
            : 'Invalid Plan'}
        </option>
      );
    })}
  </select>

  {/* Display Selected Plan */}
  <div className="mt-2 text-sm text-gray-600">
    {(() => {
      const selectedPlan = plans.find((plan) => plan.purchaseId === pc.planName);
      return selectedPlan
        ? `${selectedPlan.planName} - [${new Date(selectedPlan.planActivationDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })} - ${new Date(selectedPlan.planExpiryDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}]`
        : 'No Plan';
    })()}
  </div>
</td>






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
                        className="p-2 border rounded"
                      >
                        <option value="image">Image</option>
                        {/* <option value="video">Video</option> */}
                      </select>
                    </td>
                    {/* <td>
                      <input
                        type="number"
                        value={pc.fileType === 'video' ? pc.videoLength : ''}
                        onChange={(e) =>
                          handlePcChange(index, 'videoLength', e.target.value)
                        }
                        disabled={pc.fileType !== 'video'}
                      />
                    </td> */}
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
                        {/* Seconds */}
                        <option value={1}>1 Second</option>
                        <option value={2}>2 Seconds</option>
                        <option value={3}>3 Seconds</option>
                        <option value={4}>4 Seconds</option>
                        <option value={5}>5 Seconds</option>
                        <option value={6}>6 Seconds</option>
                        <option value={7}>7 Seconds</option>
                        <option value={8}>8 Seconds</option>
                        <option value={9}>9 Seconds</option>
                        <option value={10}>10 Seconds</option>
                        <option value={15}>15 Seconds</option>
                        <option value={20}>20 Seconds</option>
                        <option value={30}>30 Seconds</option>
                        <option value={40}>40 Seconds</option>
                        <option value={50}>50 Seconds</option>
                        <option value={60}>60 Seconds</option>

                        {/* Minutes */}
                        <option value={60}>1 Minute</option>
                        <option value={120}>2 Minutes</option>
                        <option value={180}>3 Minutes</option>
                        <option value={240}>4 Minutes</option>
                        <option value={300}>5 Minutes</option>
                        <option value={600}>10 Minutes</option>
                        <option value={1200}>20 Minutes</option>
                        <option value={1800}>30 Minutes</option>
                        <option value={2400}>45 Minutes</option>

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
                        <option value={100}>100% Quality</option>
                        <option value={90}>90% Quality</option>
                        <option value={80}>80% Quality</option>
                        <option value={70}>70% Quality</option>
                        <option value={60}>60% Quality</option>
                        <option value={50}>50% Quality</option>
                        <option value={40}>40% Quality</option>
                        <option value={30}>30% Quality</option>
                        <option value={20}>20% Quality</option>
                        <option value={10}>10% Quality</option>
                      </select>
                    </td>

                    {/* <td>{pc.storageUsed}</td> */}

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
                        <option value="At PC Startup">At PC Startup</option>
                        <option value="Daily Once">Daily Once</option>
                        <option value="Weekly Once">Weekly Once</option>
                        <option value="Monthly Once">Monthly Once</option>
                        <option value="Quarterly Once">Quarterly Once</option>
                        <option value="HalfYearly Once">HalfYearly Once</option>
                        <option value="Yearly Once">Yearly Once</option>
                      </select>
                    </td>

                    {/* <td>{new Date(pc.lastCapturedTime).toLocaleString()}</td> */}

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
                        style={{ width: '24px', height: '24px' }} // Adjust size as needed
                      />
                    </td>

                    <td>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="delete-icon"
                        onClick={() => handleDelete(pc.uuid, pc.nickName)}
                        style={{ color: 'red', width: '24px', height: '24px' }} // Adjust size as needed
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>

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

        .save-button {
          padding: 10px 20px;
          background-color: #808080;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: default;
          transition: background-color 0.2s, box-shadow 0.2s;
        }

        .save-button.enabled {
          background-color: #008000;
          cursor: pointer;
          box-shadow: 2px 2px 5px black;
        }

        .save-button:disabled {
          background-color: #ccc;
          cursor: default;
          box-shadow: none;
        }
        .form-container {
          display: flex;
          gap: 20px; /* Space between form fields and help box */
          align-items: flex-start; /* Align items at the top */
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 20px; /* Space between each form group */
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
    </div>
  );
}
