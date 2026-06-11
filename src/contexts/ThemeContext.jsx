import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('arverse_theme') || 'dark';
  });
  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem('arverse_wallpaper') || 'glass-waves';
  });
  const [customWallpaper, setCustomWallpaper] = useState(() => {
    return localStorage.getItem('arverse_custom_wallpaper') || '';
  });
  const [isBooting, setIsBooting] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [isSleeping, setIsSleeping] = useState(false);
  const [volume, setVolume] = useState(70); // simulated volume
  const [brightness, setBrightness] = useState(85); // simulated brightness
  const [focusMode, setFocusMode] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState(() => {
    return localStorage.getItem('arverse_profile_avatar') || '';
  });
  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('arverse_profile_name') || 'Aryan';
  });

  useEffect(() => {
    localStorage.setItem('arverse_profile_avatar', profileAvatar);
  }, [profileAvatar]);

  useEffect(() => {
    localStorage.setItem('arverse_profile_name', profileName);
  }, [profileName]);

  // Sync theme changes to DOM class list
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${theme}`);
    localStorage.setItem('arverse_theme', theme);
  }, [theme]);

  // Sync wallpaper select
  useEffect(() => {
    localStorage.setItem('arverse_wallpaper', wallpaper);
  }, [wallpaper]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const selectWallpaper = (wpName) => {
    setWallpaper(wpName);
  };

  const uploadCustomWallpaper = (base64) => {
    setCustomWallpaper(base64);
    setWallpaper('custom');
    localStorage.setItem('arverse_custom_wallpaper', base64);
  };

  // Get current inline styles for wallpaper background
  const getWallpaperBackground = () => {
    if (wallpaper === 'custom' && customWallpaper) {
      return { backgroundImage: `url(${customWallpaper})`, backgroundColor: 'transparent' };
    }
    
    // Fallback based on selected theme options
    const suffix = theme === 'light' ? 'light' : 'dark';
    switch (wallpaper) {
      case 'glass-waves':
        return { backgroundImage: `var(--wp-glass-waves-${suffix})` };
      case 'aurora':
        return { backgroundImage: `var(--wp-aurora-${suffix})` };
      case 'abstract':
        return { backgroundImage: `var(--wp-abstract-${suffix})` };
      case 'pure-dark':
        return { backgroundColor: '#000000', backgroundImage: 'none' };
      case 'pure-light':
        return { backgroundColor: '#ffffff', backgroundImage: 'none' };
      default:
        return { backgroundImage: `var(--wp-glass-waves-${suffix})` };
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        wallpaper,
        selectWallpaper,
        customWallpaper,
        uploadCustomWallpaper,
        getWallpaperBackground,
        isBooting,
        setIsBooting,
        isLocked,
        setIsLocked,
        isSleeping,
        setIsSleeping,
        volume,
        setVolume,
        brightness,
        setBrightness,
        focusMode,
        setFocusMode,
        profileAvatar,
        setProfileAvatar,
        profileName,
        setProfileName
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
