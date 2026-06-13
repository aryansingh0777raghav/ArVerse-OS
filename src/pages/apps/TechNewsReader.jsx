import React, { useState, useEffect, useRef } from 'react';

const NEWS_MOCK = [
  {
    id: 'system-mock-1',
    category: 'arverse',
    title: 'Show HN: ArVerse OS - A premium glassmorphic React workspace',
    author: 'kabir_sharma',
    score: 342,
    time: '2 hours ago',
    timestamp: Date.now() - 7200000,
    url: 'github.com/aryansingh0777raghav/ArVerse-OS',
    summary: 'ArVerse OS is an open-source, high-performance web desktop simulator built on React 19 and Vite 8. It ships with a virtual filesystem, process manager, custom themes context, and interactive modular applications. The architecture utilizes context providers to sync states between docks, spotlight controllers, and multiple windows.'
  },
  {
    id: 'system-mock-2',
    category: 'arverse',
    title: 'ArVerse OS release notes: 14 modular glass apps loaded',
    author: 'arverse_core',
    score: 550,
    time: '1 day ago',
    timestamp: Date.now() - 86400000,
    url: 'github.com/aryansingh0777raghav/ArVerse-OS',
    summary: 'Version 1.1 includes 14 fresh glassmorphic applications: System Cleaner, Retro Terminal, Lofi Player, Pixel Paint, Sticky Notes, Pomodoro, and more. All applications are isolated, clean React modules loaded dynamically into the WindowManager frame.'
  }
];

export default function TechNewsReader() {
  const [activeTab, setActiveTab] = useState('all'); // all, hackernews, techcrunch, producthunt, arverse, bookmarks
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, popular
  
  // Enabled feeds config
  const [enabledFeeds, setEnabledFeeds] = useState(() => {
    try {
      const saved = localStorage.getItem('arnews_enabled_feeds');
      return saved ? JSON.parse(saved) : {
        hackernews: true,
        techcrunch: true,
        producthunt: true,
        arverse: true
      };
    } catch (e) {
      return { hackernews: true, techcrunch: true, producthunt: true, arverse: true };
    }
  });

  // Custom feeds list
  const [customFeeds, setCustomFeeds] = useState(() => {
    try {
      const saved = localStorage.getItem('arnews_custom_feeds');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Articles state
  const [rawArticles, setRawArticles] = useState(() => {
    return [...NEWS_MOCK];
  });
  
  const [selectedArticle, setSelectedArticle] = useState(NEWS_MOCK[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Custom feed inputs
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedErr, setNewFeedErr] = useState('');

  // Reader mode state
  const [readerMode, setReaderMode] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState(15); // in pixels
  const [readerContrast, setReaderContrast] = useState('normal'); // normal, sepia, dark

  // Text to speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('arnews_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Share overlay state
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('arnews_enabled_feeds', JSON.stringify(enabledFeeds));
  }, [enabledFeeds]);

  useEffect(() => {
    localStorage.setItem('arnews_custom_feeds', JSON.stringify(customFeeds));
  }, [customFeeds]);

  useEffect(() => {
    localStorage.setItem('arnews_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Clean speech when article changes or component unmounts
  useEffect(() => {
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [selectedArticle]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Format relative time helper
  const formatRelativeTime = (dateInput) => {
    try {
      if (!dateInput) return 'recently';
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return 'recently';
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch (e) {
      return 'recently';
    }
  };

  // HTML tag stripper helper
  const cleanSummary = (htmlText) => {
    if (!htmlText) return '';
    try {
      const doc = new DOMParser().parseFromString(htmlText, 'text/html');
      const text = doc.body.textContent || '';
      if (text.length > 350) {
        return text.substring(0, 350).trim() + '...';
      }
      return text.trim();
    } catch (e) {
      const stripped = htmlText.replace(/<\/?[^>]+(>|$)/g, "");
      if (stripped.length > 350) {
        return stripped.substring(0, 350).trim() + '...';
      }
      return stripped.trim();
    }
  };

  // RSS Feed parser via rss2json
  const fetchRssFeed = async (feedUrl, categoryName, customTitle = '') => {
    try {
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
      if (!res.ok) throw new Error('Network error loading RSS');
      const data = await res.json();
      if (data.status !== 'ok') throw new Error('RSS parser error');
      
      return data.items.map((item, idx) => {
        const desc = item.description || item.content || '';
        return {
          id: `${categoryName}-${idx}-${Date.now()}-${Math.random()}`,
          category: categoryName,
          customFeedName: customTitle,
          title: item.title,
          author: item.author || customTitle || categoryName,
          score: Math.floor(Math.random() * 40) + 15, // Simulated starting weight score
          time: formatRelativeTime(item.pubDate),
          timestamp: new Date(item.pubDate).getTime(),
          url: item.link,
          summary: cleanSummary(desc)
        };
      });
    } catch (e) {
      console.error(`Error loading feed: ${feedUrl}`, e);
      return [];
    }
  };

  // Core live feeds fetcher
  const loadAllFeeds = async () => {
    setRefreshing(true);
    let HNList = [];
    let TCList = [];
    let PHList = [];
    let customLists = [];

    // Local system news feeds (ArVerse OS updates)
    const systemNews = [
      {
        id: 'system-1',
        category: 'arverse',
        title: 'ArVerse OS 1.1 released with 14 modular desktop apps!',
        author: 'arverse_core',
        score: 485,
        time: 'Just now',
        timestamp: Date.now(),
        url: 'github.com/aryansingh0777raghav/ArVerse-OS',
        summary: 'We are thrilled to announce ArVerse OS v1.1. This release introduces 14 standalone desktop utilities including ArCalc (Scientific Calculator), ArTune (Lofi Player), ArTerm (Matrix Terminal), ArMemo (Sticky Notes), and ArNews (this news reader!). We have also implemented Lock Screen profile customization and native app launchers.'
      },
      {
        id: 'system-2',
        category: 'arverse',
        title: 'Integrating ArCh: The Semantic Search engine for your second brain',
        author: 'aryan_raghav',
        score: 324,
        time: '5 hours ago',
        timestamp: Date.now() - 5 * 3600000,
        url: 'producthunt.com/arch-search',
        summary: 'ArCh Search indexer matches user queries against local document databases using embeddings. It is lightweight, completely runs in-memory, and provides local micro-services ports diagnostics.'
      },
      {
        id: 'system-3',
        category: 'arverse',
        title: 'ArLip Creator 2.0 is now live for cinematic storyboard generation',
        author: 'aryan_raghav',
        score: 210,
        time: '12 hours ago',
        timestamp: Date.now() - 12 * 3600000,
        url: 'producthunt.com/arlip-creator',
        summary: 'ArLip Creator 2.0 is a cinematic storyboard builder that lets filmmakers write screenplays in Fountain format and generate visual storyboard reels. The new version syncs scene files with memory vaults and supports custom rendering outputs.'
      }
    ];

    const promises = [];

    // 1. HackerNews
    if (enabledFeeds.hackernews) {
      promises.push((async () => {
        try {
          const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
          if (res.ok) {
            const ids = await res.json();
            const topIds = ids.slice(0, 12);
            const storyDetails = await Promise.all(topIds.map(async (id) => {
              try {
                const sRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                if (sRes.ok) {
                  const item = await sRes.json();
                  if (item && item.type === 'story') {
                    return {
                      id: `hn-${item.id}`,
                      category: 'hackernews',
                      title: item.title,
                      author: item.by || 'anonymous',
                      score: item.score || 0,
                      time: formatRelativeTime(item.time * 1000),
                      timestamp: item.time * 1000,
                      url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
                      summary: item.text ? cleanSummary(item.text) : `Hacker News top story by ${item.by} with ${item.descendants || 0} comments and ${item.score || 0} points. Click to visit thread for full details.`
                    };
                  }
                }
              } catch (e) {}
              return null;
            }));
            HNList = storyDetails.filter(Boolean);
          }
        } catch (err) {
          console.error("Failed to load HN:", err);
        }
      })());
    }

    // 2. TechCrunch
    if (enabledFeeds.techcrunch) {
      promises.push((async () => {
        const feeds = await fetchRssFeed('https://techcrunch.com/feed/', 'techcrunch');
        TCList = feeds;
      })());
    }

    // 3. ProductHunt
    if (enabledFeeds.producthunt) {
      promises.push((async () => {
        const feeds = await fetchRssFeed('https://www.producthunt.com/feed', 'producthunt');
        PHList = feeds;
      })());
    }

    // 4. Custom Feeds
    customFeeds.forEach(cf => {
      promises.push((async () => {
        const feeds = await fetchRssFeed(cf.url, 'custom', cf.name);
        customLists = [...customLists, ...feeds];
      })());
    });

    await Promise.allSettled(promises);

    let combined = [];
    if (enabledFeeds.arverse) {
      combined = [...systemNews];
    }
    combined = [...combined, ...HNList, ...TCList, ...PHList, ...customLists];

    // Fallback if all fetch outputs are empty (offline / rate limited)
    if (combined.length === 0) {
      combined = [...NEWS_MOCK];
    }

    setRawArticles(combined);
    
    // Maintain selection
    if (combined.length > 0) {
      setSelectedArticle(prev => {
        if (!prev) return combined[0];
        const exists = combined.find(a => a.id === prev.id);
        return exists || combined[0];
      });
    }
    setRefreshing(false);
  };

  // Fetch feeds on load and settings changes
  useEffect(() => {
    loadAllFeeds();
  }, [enabledFeeds, customFeeds]);

  // Sort and filter computation
  const sortedArticles = [...rawArticles].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.score - a.score;
    }
    const tA = a.timestamp || 0;
    const tB = b.timestamp || 0;
    return tB - tA;
  });

  const filteredArticles = (activeTab === 'bookmarks' ? bookmarks : sortedArticles).filter(art => {
    const matchesTab = activeTab === 'all' || activeTab === 'bookmarks' || art.category === activeTab;
    const matchesQuery = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         art.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const handleUpvote = (id, e) => {
    e.stopPropagation();
    setRawArticles(prev => prev.map(art => 
      art.id === id ? { ...art, score: art.score + 1 } : art
    ));
    if (selectedArticle?.id === id) {
      setSelectedArticle(prev => ({ ...prev, score: prev.score + 1 }));
    }
  };

  // Text-To-Speech reader trigger
  const speakArticle = (article) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const textToRead = `Article: ${article.title}. Written by ${article.author}. Summary: ${article.summary}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech reader is not supported in this browser.");
    }
  };

  // Share copy link trigger
  const copyArticleLink = (article) => {
    const link = article.url.startsWith('http') ? article.url : `https://${article.url}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  // Add custom feed validation
  const handleAddCustomFeed = () => {
    setNewFeedErr('');
    if (!newFeedName.trim() || !newFeedUrl.trim()) {
      setNewFeedErr('Feed name and URL are required.');
      return;
    }
    if (!newFeedUrl.startsWith('http://') && !newFeedUrl.startsWith('https://')) {
      setNewFeedErr('URL must start with http:// or https://');
      return;
    }
    
    // Add to feeds list
    const newFeed = {
      name: newFeedName.trim(),
      url: newFeedUrl.trim()
    };

    setCustomFeeds(prev => [...prev, newFeed]);
    setNewFeedName('');
    setNewFeedUrl('');
  };

  const handleRemoveCustomFeed = (index) => {
    setCustomFeeds(prev => prev.filter((_, idx) => idx !== index));
  };

  // Dynamic reading view themes
  const getReaderStyles = () => {
    switch (readerContrast) {
      case 'sepia':
        return {
          background: '#f4ecd8',
          color: '#5b4636',
          fontFamily: 'Georgia, Times, serif',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e1d8be'
        };
      case 'dark':
        return {
          background: '#121212',
          color: '#e0e0e0',
          fontFamily: 'var(--font-sans)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #2b2b2b'
        };
      default:
        return {
          background: 'rgba(255, 255, 255, 0.03)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--panel-border)'
        };
    }
  };

  // Bookmark toggle
  const toggleBookmark = (art, e) => {
    if (e) e.stopPropagation();
    const isSaved = bookmarks.some(b => b.id === art.id);
    if (isSaved) {
      setBookmarks(prev => prev.filter(b => b.id !== art.id));
    } else {
      setBookmarks(prev => [...prev, art]);
    }
  };

  return (
    <div className="window-content" style={{ display: 'flex', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Left Pane - Feeds Feed Column */}
      <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--panel-border)', height: '100%', overflow: 'hidden' }}>
        
        {/* Toolbar controls */}
        <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', borderBottom: '1px solid var(--panel-border)', alignItems: 'center', background: 'rgba(0,0,0,0.05)', flexShrink: 0 }}>
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '10px', fontSize: '12px', opacity: 0.6 }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search tech news..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px 6px 28px',
                borderRadius: '20px',
                border: '1px solid var(--panel-border)',
                background: 'rgba(0,0,0,0.15)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Sorting switcher */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 8px',
              borderRadius: '20px',
              border: '1px solid var(--panel-border)',
              background: 'rgba(0,0,0,0.15)',
              color: 'var(--text-primary)',
              fontSize: '11px',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="date" style={{ background: 'var(--panel-bg-solid)' }}>📅 Newest</option>
            <option value="popular" style={{ background: 'var(--panel-bg-solid)' }}>🔥 Popular</option>
          </select>

          {/* Sync Trigger */}
          <button 
            onClick={loadAllFeeds}
            disabled={refreshing}
            title="Reload News"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid var(--panel-border)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
          >
            {refreshing ? '⏳' : '🔄'}
          </button>

          {/* Settings trigger */}
          <button 
            onClick={() => setShowSettings(true)}
            title="Manage Sources"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid var(--panel-border)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
          >
            ⚙️
          </button>
        </div>

        {/* Tab filters list */}
        <div style={{ display: 'flex', gap: '6px', padding: '10px 16px', overflowX: 'auto', borderBottom: '1px solid var(--panel-border)', flexShrink: 0 }} className="custom-scrollbar">
          {[
            { id: 'all', name: 'All Feeds' },
            { id: 'hackernews', name: 'Hacker News' },
            { id: 'techcrunch', name: 'TechCrunch' },
            { id: 'producthunt', name: 'Product Hunt' },
            { id: 'arverse', name: 'ArVerse OS' },
            { id: 'bookmarks', name: '🔖 Saved' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--accent-color)' : 'rgba(255,255,255,0.03)',
                color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Articles stream feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredArticles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-secondary)', fontSize: '12px' }}>
              {searchQuery ? `No matches found for "${searchQuery}"` : 'No articles available in this feed.'}
            </div>
          ) : (
            filteredArticles.map(art => {
              const isSelected = selectedArticle?.id === art.id;
              const isSaved = bookmarks.some(b => b.id === art.id);
              
              return (
                <div
                  key={art.id}
                  onClick={() => {
                    setSelectedArticle(art);
                    setReaderMode(false);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(0, 113, 227, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                    border: isSelected ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.4' }}>{art.title}</span>
                    <span style={{ fontSize: '9px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontWeight: '700', flexShrink: 0 }}>
                      {art.category === 'hackernews' ? 'HN' : art.category === 'techcrunch' ? 'TC' : art.category === 'producthunt' ? 'PH' : art.category === 'arverse' ? 'OS' : art.customFeedName ? art.customFeedName.substring(0, 4).toUpperCase() : 'FEED'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span>by {art.author}</span>
                      <span>•</span>
                      <span>{art.time}</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button 
                        onClick={(e) => toggleBookmark(art, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          fontSize: '11px'
                        }}
                        title={isSaved ? "Remove Bookmark" : "Save to Bookmarks"}
                      >
                        {isSaved ? '🔖' : '🏷️'}
                      </button>

                      <button 
                        onClick={(e) => handleUpvote(art.id, e)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          color: 'var(--accent-color)',
                          fontSize: '9.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        ▲ {art.score}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane - Article Details / Reader View */}
      <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.02)', overflowY: 'auto' }}>
        {selectedArticle ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
            
            {/* Top Details Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent-color)', fontWeight: '700', letterSpacing: '1px' }}>
                {selectedArticle.category === 'hackernews' ? 'Hacker News Feed' : selectedArticle.category === 'techcrunch' ? 'TechCrunch Article' : selectedArticle.category === 'producthunt' ? 'Product Hunt Release' : selectedArticle.category === 'arverse' ? 'ArVerse Core Update' : selectedArticle.customFeedName || 'External Feed'}
              </span>
              
              <button
                onClick={() => setReaderMode(!readerMode)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid var(--panel-border)',
                  background: readerMode ? 'var(--accent-color)' : 'transparent',
                  color: readerMode ? '#fff' : 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                📖 {readerMode ? 'Exit Reader' : 'Reader View'}
              </button>
            </div>

            {/* Reader view configurations bar */}
            {readerMode && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--panel-border)', flexShrink: 0 }}>
                {/* Font Size controls */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button onClick={() => setReaderFontSize(Math.max(12, readerFontSize - 1))} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', cursor: 'pointer' }}>A-</button>
                  <span style={{ fontSize: '11px' }}>{readerFontSize}px</span>
                  <button onClick={() => setReaderFontSize(Math.min(24, readerFontSize + 1))} style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', cursor: 'pointer' }}>A+</button>
                </div>
                {/* Contrast modes */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['normal', 'sepia', 'dark'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setReaderContrast(mode)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        fontSize: '10px',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        background: mode === 'sepia' ? '#f4ecd8' : mode === 'dark' ? '#121212' : 'rgba(255,255,255,0.05)',
                        color: mode === 'sepia' ? '#5b4636' : mode === 'dark' ? '#e0e0e0' : 'var(--text-primary)',
                        boxShadow: readerContrast === mode ? '0 0 0 1px var(--accent-color)' : 'none'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Article container */}
            <div style={readerMode ? getReaderStyles() : { display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h2 style={{ fontSize: readerMode ? `${readerFontSize + 6}px` : '18px', fontWeight: '700', margin: 0, lineHeight: '1.4' }}>{selectedArticle.title}</h2>
              
              <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>Author: {selectedArticle.author}</span>
                <span>•</span>
                <span>{selectedArticle.time}</span>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--panel-border)', margin: '4px 0' }} />

              <div style={{ fontSize: readerMode ? `${readerFontSize}px` : '13px', lineHeight: '1.6', opacity: 0.95 }}>
                {selectedArticle.summary}
              </div>
            </div>

            {/* Utility actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '16px', flexShrink: 0, flexWrap: 'wrap' }}>
              <button 
                onClick={() => speakArticle(selectedArticle)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: isSpeaking ? '#e03e3e' : 'rgba(255, 255, 255, 0.05)',
                  color: isSpeaking ? '#fff' : 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isSpeaking ? '⏹ Stop Reader' : '🔊 Read Aloud'}
              </button>

              <button 
                onClick={(e) => toggleBookmark(selectedArticle, e)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--panel-border)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {bookmarks.some(b => b.id === selectedArticle.id) ? '🔖 Saved' : '🏷️ Bookmark'}
              </button>

              <button 
                onClick={() => copyArticleLink(selectedArticle)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--panel-border)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  color: 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                🔗 {copyFeedback ? 'Copied!' : 'Share Link'}
              </button>
              
              <a 
                href={selectedArticle.url.startsWith('http') ? selectedArticle.url : `https://${selectedArticle.url}`} 
                target="_blank" 
                rel="noreferrer"
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: 'var(--accent-color)',
                  color: '#fff',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: 'auto'
                }}
              >
                Visit Link ↗
              </a>
            </div>

          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', textAlign: 'center' }}>
            <span style={{ fontSize: '32px' }}>📖</span>
            <span style={{ fontSize: '12px', fontWeight: '600', marginTop: '8px' }}>Select an article to read</span>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>Browse Hacker News, TechCrunch and customize feeds.</span>
          </div>
        )}
      </div>

      {/* Sources / Custom Feeds Settings Overlay Modal */}
      {showSettings && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            width: '400px',
            maxHeight: '90%',
            background: 'var(--panel-bg-solid)',
            border: '1px solid var(--panel-border)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--panel-border)' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>Manage Tech Sources</span>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '14px' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }} className="custom-scrollbar">
              
              {/* Default Feeds Toggle */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Default Feeds</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { key: 'hackernews', label: 'Hacker News (Top Stories)' },
                    { key: 'techcrunch', label: 'TechCrunch RSS' },
                    { key: 'producthunt', label: 'Product Hunt Featured' },
                    { key: 'arverse', label: 'ArVerse OS Core Updates' }
                  ].map(f => (
                    <label key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={enabledFeeds[f.key]} 
                        onChange={(e) => setEnabledFeeds(prev => ({ ...prev, [f.key]: e.target.checked }))}
                        style={{ cursor: 'pointer' }}
                      />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--panel-border)' }} />

              {/* Add Custom RSS Feed */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Add Custom RSS Feed</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Source Name (e.g. Wired Tech)" 
                    value={newFeedName}
                    onChange={(e) => setNewFeedName(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--panel-border)',
                      background: 'rgba(0,0,0,0.15)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <input 
                    type="text" 
                    placeholder="RSS Feed URL (https://...)" 
                    value={newFeedUrl}
                    onChange={(e) => setNewFeedUrl(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--panel-border)',
                      background: 'rgba(0,0,0,0.15)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  {newFeedErr && <span style={{ fontSize: '10px', color: '#ff4d4d' }}>{newFeedErr}</span>}
                  <button 
                    onClick={handleAddCustomFeed}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'var(--accent-color)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ＋ Add Feed
                  </button>
                </div>
              </div>

              {customFeeds.length > 0 && (
                <>
                  <hr style={{ border: 'none', borderBottom: '1px solid var(--panel-border)' }} />
                  {/* Custom Feeds List */}
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Your Feeds ({customFeeds.length})</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {customFeeds.map((feed, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--panel-border)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', marginRight: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>{feed.name}</span>
                            <span style={{ fontSize: '9px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{feed.url}</span>
                          </div>
                          <button 
                            onClick={() => handleRemoveCustomFeed(idx)}
                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '12px', padding: '4px' }}
                            title="Delete Feed"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.05)' }}>
              <button 
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--panel-border)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'var(--text-primary)',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
