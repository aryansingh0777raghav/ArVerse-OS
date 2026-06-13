import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAppState } from '../contexts/AppStateContext';

export default function Settings() {
  const { 
    theme, toggleTheme, 
    wallpaper, selectWallpaper,
    focusMode, setFocusMode,
    profileName, setProfileName,
    profileAvatar, setProfileAvatar,
    pinEnabled, setPinEnabled,
    pinCode, setPinCode
  } = useTheme();

  const { vaultEntries, files, activities, addActivity } = useAppState();

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileAvatar(event.target.result);
      addActivity('Updated lock screen profile avatar image', 'Settings');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setProfileAvatar('');
    addActivity('Removed profile avatar image (fallback to monogram)', 'Settings');
  };

  const handleBackup = () => {
    const backupData = {
      version: '1.2',
      timestamp: new Date().toISOString(),
      theme,
      wallpaper,
      vault: vaultEntries,
      files,
      activities
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `arverse_os_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addActivity('Created storage backup file', 'Settings');
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.vault && parsed.files) {
          localStorage.setItem('arverse_vault', JSON.stringify(parsed.vault));
          localStorage.setItem('arverse_files', JSON.stringify(parsed.files));
          localStorage.setItem('arverse_activities', JSON.stringify(parsed.activities || []));
          
          addActivity('Restored storage database from backup', 'Settings');
          alert("Database restored successfully! Restarting ArVerse OS to apply changes.");
          window.location.reload();
        } else {
          alert("Invalid backup file structure.");
        }
      } catch (err) {
        alert("Failed to parse backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to restore ArVerse OS to default factory settings? This will clear your second brain and custom files.")) {
      localStorage.clear();
      alert("System reset completed. Restarting OS.");
      window.location.reload();
    }
  };

  return (
    <div className="window-content" style={{ display: 'flex', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)' }}>
      
      {/* Settings Sections */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* User Profile Settings */}
        <div style={sectionStyle}>
          <h4 style={sectionHeaderStyle}>User Profile Settings</h4>
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Username Input */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <div>
                <strong>Profile Display Name</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Used on the screen Lock and Welcome headers</div>
              </div>
              <input 
                type="text" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
                className="glass-input" 
                style={{ fontSize: '12.5px', padding: '6px 12px', width: '180px', borderRadius: '8px' }}
              />
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'var(--panel-border)' }} />

            {/* Profile Photo Upload */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Avatar Preview */}
                {profileAvatar ? (
                  <img 
                    src={profileAvatar} 
                    alt={profileName} 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--panel-border)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2997ff, #0071e3)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: '600',
                    fontSize: '18px',
                    color: '#ffffff',
                    border: '2px solid var(--panel-border)'
                  }}>
                    {profileName ? profileName.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
                <div>
                  <strong>Profile Avatar Image</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Upload a custom image to display on the Lock Screen</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <label className="glass-button" style={{ fontSize: '11px', cursor: 'pointer' }}>
                  🖼️ Upload Photo
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                </label>
                {profileAvatar && (
                  <button 
                    onClick={handleRemoveAvatar}
                    className="glass-button" 
                    style={{ fontSize: '11px', color: '#ff3b30', borderColor: 'rgba(255,59,48,0.15)', background: 'transparent' }}
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div style={sectionStyle}>
          <h4 style={sectionHeaderStyle}>System Appearance</h4>
          <div className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Interface Color Theme</strong>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Toggle global light and dark aesthetic mode</div>
            </div>
            <button className="glass-button" onClick={toggleTheme} style={{ fontSize: '11px' }}>
              {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div style={sectionStyle}>
          <h4 style={sectionHeaderStyle}>Security & Privacy</h4>
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* PIN Enable Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Lock Screen Passcode (PIN)</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Require a 4-digit PIN code to unlock the screen</div>
              </div>
              <button 
                className="glass-button" 
                onClick={() => {
                  if (pinEnabled) {
                    setPinEnabled(false);
                    setPinCode('');
                  } else {
                    setPinEnabled(true);
                  }
                }} 
                style={{ fontSize: '11px', fontWeight: '600', color: pinEnabled ? '#ff3b30' : 'var(--text-primary)' }}
              >
                {pinEnabled ? '🔴 Disable PIN Lock' : '🟢 Enable PIN Lock'}
              </button>
            </div>

            {/* PIN Code Configuration */}
            {pinEnabled && (
              <>
                <div style={{ height: '1px', backgroundColor: 'var(--panel-border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                  <div>
                    <strong>Set 4-Digit Passcode</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Enter a passcode of exactly 4 numbers</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="password"
                      maxLength={4}
                      placeholder="PIN"
                      value={pinCode}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          setPinCode(val);
                        }
                      }}
                      className="glass-input" 
                      style={{ 
                        fontSize: '14px', 
                        padding: '6px 12px', 
                        width: '100px', 
                        borderRadius: '8px', 
                        textAlign: 'center',
                        letterSpacing: '4px',
                        fontWeight: '700'
                      }}
                    />
                    {pinCode.length === 4 ? (
                      <span style={{ fontSize: '12px', color: '#34c759', fontWeight: '600' }}>✓ Saved</span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#ff9500' }}>{4 - pinCode.length} digits left</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Shortcut Keys Maps */}
        <div style={sectionStyle}>
          <h4 style={sectionHeaderStyle}>Keyboard Shortcuts</h4>
          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { keys: 'Ctrl + K', desc: 'Spotlight search / Raycast command modal' },
              { keys: 'Alt + Q', desc: 'App switcher cycle window list' },
              { keys: 'Escape', desc: 'Close modals and spotlight search overlays' },
              { keys: 'Double-Click Title', desc: 'Maximize or scale window size' }
            ].map(s => (
              <div key={s.keys} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{s.desc}</span>
                <kbd style={{ background: 'var(--panel-border)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{s.keys}</kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Backups & Restore DB */}
        <div style={sectionStyle}>
          <h4 style={sectionHeaderStyle}>Database & Backups Utility</h4>
          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Export Database Backup</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Download a snapshot of your second brain, files, and activity logs</div>
              </div>
              <button className="glass-button glass-button-primary" onClick={handleBackup} style={{ fontSize: '11px' }}>
                📥 Backup Database
              </button>
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'var(--panel-border)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Import Database Backup</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Select a previously exported .json file to restore your workspace</div>
              </div>
              <label className="glass-button" style={{ fontSize: '11px', cursor: 'pointer' }}>
                📤 Restore Database
                <input type="file" accept=".json" onChange={handleRestore} style={{ display: 'none' }} />
              </label>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--panel-border)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#ff3b30' }}>Reset System Environment</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Clear local storage database and restore default layout nodes</div>
              </div>
              <button 
                onClick={handleReset}
                style={{
                  background: 'rgba(255,59,48,0.1)',
                  color: '#ff3b30',
                  border: '1px solid rgba(255,59,48,0.2)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ⚠ Factory Reset
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const sectionHeaderStyle = {
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
  color: 'var(--text-secondary)'
};
