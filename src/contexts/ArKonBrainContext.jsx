import React, { createContext, useContext, useState } from 'react';
import { useAppState } from './AppStateContext';
import { useTheme } from './ThemeContext';

const ArKonBrainContext = createContext();

export const useArKonBrain = () => useContext(ArKonBrainContext);

export const ArKonBrainProvider = ({ children }) => {
  const { openWindow, addActivity } = useAppState();
  const { toggleTheme, setFocusMode } = useTheme();

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Good day, Aryan. ArKon neural core is online. Command center connected.' }
  ]);
  const [isListening, setIsListening] = useState(false);

  const processCommand = (query) => {
    const text = query.trim().toLowerCase();
    const response = { actionTaken: null, reply: '' };

    // 1. Direct App Launches
    if (text.includes('open arlip') || text.includes('launch arlip') || text.includes('start arlip')) {
      openWindow('arlip', 'ArLip Content Suite');
      response.reply = 'Launching ArLip Content Creation Suite on port 5174.';
      response.actionTaken = 'launch_arlip';
    } 
    else if (text.includes('open arft') || text.includes('launch arft') || text.includes('start arft')) {
      openWindow('arft', 'ArFt Frontend Builder');
      response.reply = 'Launching ArFt Frontend Builder on port 5173.';
      response.actionTaken = 'launch_arft';
    } 
    else if (text.includes('open arch') || text.includes('launch arch') || text.includes('start arch')) {
      openWindow('arch', 'ArCh Search Engine');
      response.reply = 'Launching ArCh Spotlight Search Engine.';
      response.actionTaken = 'launch_arch';
    } 
    else if (text.includes('open arkon') || text.includes('launch arkon')) {
      openWindow('arkon', 'ArKon AI Command Center');
      response.reply = 'Opening the AI Command Center.';
      response.actionTaken = 'launch_arkon';
    }
    // 2. Core Workspaces
    else if (text.includes('open memory vault') || text.includes('show memory vault') || text.includes('memory vault') || text.includes('show my latest film ideas') || text.includes('show film ideas')) {
      openWindow('memory-vault', 'Memory Vault');
      response.reply = 'Accessing your Memory Vault database. Relational graph maps loaded.';
      response.actionTaken = 'open_vault';
    } 
    else if (text.includes('open film studio') || text.includes('show film studio') || text.includes('film studio') || text.includes('filmmaking')) {
      openWindow('film-studio', 'Film Studio');
      response.reply = 'Opening the Filmmaking suite. Loading screenplay drafts and shot lists.';
      response.actionTaken = 'open_film';
    } 
    else if (text.includes('open developer console') || text.includes('show developer console') || text.includes('developer console') || text.includes('open terminal') || text.includes('port status')) {
      openWindow('developer-console', 'Developer Console');
      response.reply = 'Initializing Developer System Monitor. Active services scanner activated.';
      response.actionTaken = 'open_dev';
    } 
    else if (text.includes('open files') || text.includes('show files') || text.includes('files hub') || text.includes('file manager')) {
      openWindow('files-hub', 'Files Hub');
      response.reply = 'Accessing unified Files Hub. Fetching documents, scripts, and exports.';
      response.actionTaken = 'open_files';
    } 
    else if (text.includes('open settings') || text.includes('show settings') || text.includes('system settings')) {
      openWindow('settings', 'Settings');
      response.reply = 'Opening System Preferences panel.';
      response.actionTaken = 'open_settings';
    }
    // 3. System Preferences Command Router
    else if (text.includes('toggle theme') || text.includes('change theme') || text.includes('light mode') || text.includes('dark mode')) {
      toggleTheme();
      response.reply = 'Switching system color theme.';
      response.actionTaken = 'toggle_theme';
    } 
    else if (text.includes('focus mode') || text.includes('distraction free')) {
      setFocusMode(prev => !prev);
      response.reply = 'Focus workspace state toggled.';
      response.actionTaken = 'toggle_focus';
    }
    // 4. Fallback search routing
    else if (text.startsWith('search ') || text.includes('google') || text.includes('query')) {
      const searchQuery = query.replace(/^search\s+/i, '');
      openWindow('arch', 'ArCh Search Engine');
      response.reply = `Routing search query "${searchQuery}" to ArCh Search Engine.`;
      response.actionTaken = 'search_routing';
      
      // Inject search trigger details into local activity
      addActivity(`Routed query "${searchQuery}" to ArCh`, 'ArKon');
    }
    // Conversational Fallback
    else {
      const greetings = ['hello', 'hi', 'hey', 'arkon', 'assistant'];
      const isGreeting = greetings.some(g => text.includes(g));

      if (isGreeting) {
        response.reply = 'Hello Aryan. I am listening. You can ask me to open apps (ArLip, ArFt, ArCh), show film scripts, check system statuses, or query the internet.';
      } else {
        response.reply = `Understood. I will index this command: "${query}". You can access related tools in the Memory Vault or launch ArCh to find answers.`;
      }
      response.actionTaken = 'conversation';
    }

    // Append history
    setMessages(prev => [
      ...prev,
      { role: 'user', content: query },
      { role: 'assistant', content: response.reply }
    ]);

    addActivity(`Processed Brain command: "${query}"`, 'ArKon');
    return response;
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Mock typing after voice delay
      setTimeout(() => {
        setIsListening(false);
        // Randomly simulate a voice prompt
        const voicePrompts = [
          'Show my latest film ideas',
          'Open developer console',
          'Toggle theme',
          'Search React spring animations'
        ];
        const randomCmd = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
        processCommand(randomCmd);
      }, 3000);
    }
  };

  const clearBrainHistory = () => {
    setMessages([
      { role: 'assistant', content: 'History cleared. Core assistant initialized.' }
    ]);
  };

  return (
    <ArKonBrainContext.Provider
      value={{
        messages,
        submitCommand: processCommand,
        isListening,
        toggleListening,
        clearBrainHistory
      }}
    >
      {children}
    </ArKonBrainContext.Provider>
  );
};
