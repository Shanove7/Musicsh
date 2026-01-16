import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Search, Heart, Repeat, Shuffle, Volume2, User, Home, Compass, Zap, ListMusic, Menu, X, Disc, Music2, Share2, MoreHorizontal, Radio } from 'lucide-react';

const ShanoveMusic = () => {
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [searchResults, setSearchResults] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(new Audio());

  const [currentSong, setCurrentSong] = useState({
    id: 'default',
    title: "Stream Music Without Limits",
    artist: "Shanove Select",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=60",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#7C5CFF"
  });

  const trendingSongs = [
    { id: 1, title: "Midnight City", artist: "M83", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=500&auto=format&fit=crop&q=60", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 2, title: "Blinding Lights", artist: "The Weeknd", cover: "https://images.unsplash.com/photo-1621360841012-3f8d38827727?w=500&auto=format&fit=crop&q=60", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { id: 3, title: "Levitating", artist: "Dua Lipa", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&auto=format&fit=crop&q=60", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: 4, title: "Peaches", artist: "Justin Bieber", cover: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&auto=format&fit=crop&q=60", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: 5, title: "Good 4 U", artist: "Olivia Rodrigo", cover: "https://images.unsplash.com/photo-1514525253440-b393452e3383?w=500&auto=format&fit=crop&q=60", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  ];

  const playlists = [
    { id: 1, name: "Neon Nights", count: "42 Songs", cover: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3c?w=500&auto=format&fit=crop&q=60" },
    { id: 2, name: "Coding Focus", count: "128 Songs", cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60" },
    { id: 3, name: "Workout Pump", count: "65 Songs", cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60" },
    { id: 4, name: "Chill Vibes", count: "90 Songs", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60" },
  ];

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback failed (User interaction needed first):", error);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsLoading(true);
    setCurrentView('search');
    
    setTimeout(() => {
      const results = trendingSongs.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (/^https?:\/\//i.test(searchQuery)) {
        const dummySpotResult = {
           id: Date.now(),
           title: "Imported Track",
           artist: "Spotify Link",
           cover: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60",
           url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        };
        setSearchResults([dummySpotResult, ...results]);
      } else {
        setSearchResults(results);
      }
      setIsLoading(false);
    }, 1000);
  };

  const playSong = (song) => {
    if (currentSong.id !== song.id) {
      setCurrentSong(song);
      audioRef.current.src = song.url;
      audioRef.current.load(); 
    }
    setIsPlaying(true);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex h-screen bg-[#0F0F14] text-white font-sans overflow-hidden selection:bg-[#7C5CFF] selection:text-white">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@500;600;700&display=swap');
          
          body { font-family: 'Inter', sans-serif; }
          h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
          
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #7C5CFF; }
          
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          
          .glass-nav { background: rgba(15, 15, 20, 0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
          .glass-card { background: rgba(24, 24, 31, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.03); }
          .glass-player { background: rgba(15, 15, 20, 0.95); backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.05); }

          .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
          
          .equalizer { display: flex; align-items: flex-end; height: 16px; gap: 2px; }
          .bar { width: 3px; background: #1DB954; animation: equalize 1s infinite ease-in-out; }
          .bar:nth-child(1) { animation-delay: 0.1s; }
          .bar:nth-child(2) { animation-delay: 0.3s; }
          .bar:nth-child(3) { animation-delay: 0.5s; }
          .bar:nth-child(4) { animation-delay: 0.2s; }
          @keyframes equalize { 0%, 100% { height: 20%; } 50% { height: 100%; } }
        `}
      </style>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F0F14] border-r border-[#18181F] transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#7C5CFF]">
              <div className="bg-[#7C5CFF] p-1.5 rounded-lg">
                <Music2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Shanove</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-[#B3B3B3] hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-4 py-2">
             <div className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider mb-4 px-2">Menu</div>
             <nav className="space-y-1">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'explore', icon: Compass, label: 'Explore' },
                { id: 'trending', icon: Zap, label: 'Trending' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${currentView === item.id ? 'bg-[#18181F] text-white border-l-2 border-[#7C5CFF]' : 'text-[#B3B3B3] hover:text-white hover:bg-[#18181F]'}`}
                >
                  <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-[#7C5CFF]' : 'text-[#B3B3B3] group-hover:text-white'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="px-4 py-6 mt-2">
            <div className="flex items-center justify-between px-2 mb-4">
               <div className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider">Library</div>
               <ListMusic className="w-4 h-4 text-[#B3B3B3] hover:text-white cursor-pointer"/>
            </div>
            <div className="space-y-1 overflow-y-auto max-h-48 no-scrollbar">
              {['Liked Songs', 'Neon Vibes', 'Chill Lofi', 'Gym Hype', 'Road Trip'].map((pl, i) => (
                <button key={i} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#B3B3B3] hover:text-white hover:bg-[#18181F] transition-colors group">
                   <div className="w-8 h-8 rounded bg-[#18181F] flex items-center justify-center group-hover:bg-[#2A2A35]">
                      <Disc className="w-4 h-4 text-[#7C5CFF]" />
                   </div>
                   <span className="truncate">{pl}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-[#18181F]">
             <button className="flex items-center gap-3 w-full hover:bg-[#18181F] p-2 rounded-lg transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#FF4D8D] p-[2px]">
                   <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" className="rounded-full w-full h-full border-2 border-[#0F0F14]" alt="User"/>
                </div>
                <div className="text-left">
                   <p className="text-sm font-semibold text-white">Guest User</p>
                   <p className="text-xs text-[#1DB954]">Free Plan</p>
                </div>
             </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative w-full h-full">
        <header className="absolute top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between glass-nav h-[70px]">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-white p-1 hover:bg-[#18181F] rounded-md">
                <Menu className="w-6 h-6" />
             </button>
             <div className="flex items-center gap-4 w-full md:w-[400px]">
                <div className="flex-1 flex items-center bg-[#18181F] rounded-full px-4 py-2 border border-transparent focus-within:border-[#7C5CFF] transition-all">
                  <Search className="w-4 h-4 text-[#B3B3B3]" />
                  <form onSubmit={handleSearch} className="flex-1">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for songs, artists, or paste URL..." 
                      className="w-full bg-transparent border-none focus:outline-none text-sm text-white px-3 placeholder-[#555]"
                    />
                  </form>
                  {isLoading && <div className="w-4 h-4 border-2 border-[#7C5CFF] border-t-transparent rounded-full animate-spin"></div>}
                </div>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
             <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors"><Zap className="w-5 h-5"/></button>
             <button className="px-5 py-2 bg-[#7C5CFF] hover:bg-[#6c4ef0] text-white rounded-full text-sm font-semibold shadow-lg shadow-[#7C5CFF]/30 transition-all transform hover:scale-105">
                Install App
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-[70px] pb-[100px] scroll-smooth">
          {currentView === 'home' && (
            <div className="p-6 md:p-8 space-y-12 max-w-7xl mx-auto">
              
              <section className="relative w-full h-[320px] rounded-3xl overflow-hidden group">
                 <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=1200&auto=format&fit=crop&q=80')` }}></div>
                 <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                 <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12 max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-[#1DB954] text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">New Release</span>
                      <span className="text-[#B3B3B3] text-sm flex items-center gap-1"><Disc className="w-3 h-3"/> Album • 2024</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-white">Feel The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#FF4D8D]">Rhythm</span> <br/> Of The Future</h1>
                    <p className="text-[#ccc] text-sm md:text-base mb-8 max-w-md line-clamp-2">Immerse yourself in high-fidelity audio with our latest collection of synthwave and electronic masterpieces.</p>
                    <div className="flex gap-4">
                      <button onClick={() => playSong(trendingSongs[0])} className="px-8 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-[#1DB954]/20">
                        <Play className="w-5 h-5 fill-current" /> Play Now
                      </button>
                      <button className="px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full transition-all text-white font-medium">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                 </div>
              </section>

              <section>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Trending Now</h2>
                    <p className="text-sm text-[#B3B3B3]">Top picks for you based on your location</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-2 rounded-full border border-[#333] hover:border-white transition-colors"><SkipBack className="w-4 h-4"/></button>
                     <button className="p-2 rounded-full border border-[#333] hover:border-white transition-colors"><SkipForward className="w-4 h-4"/></button>
                  </div>
                </div>
                
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x">
                  {trendingSongs.map((song, idx) => (
                    <div 
                      key={song.id}
                      onClick={() => playSong(song)}
                      className="min-w-[180px] w-[180px] snap-start group cursor-pointer"
                    >
                      <div className="relative mb-3 overflow-hidden rounded-2xl">
                        <img src={song.cover} alt={song.title} className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                           <button className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                             <Play className="w-5 h-5 fill-black text-black ml-1" />
                           </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-white truncate group-hover:text-[#7C5CFF] transition-colors">{song.title}</h3>
                      <p className="text-sm text-[#B3B3B3] truncate">{song.artist}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                 <h2 className="text-2xl font-bold text-white mb-6">Your Playlists</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {playlists.map((pl) => (
                       <div key={pl.id} className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:bg-[#2A2A35] transition-colors cursor-pointer group">
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                             <img src={pl.cover} alt={pl.name} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-6 h-6 text-white fill-white"/>
                             </div>
                          </div>
                          <div className="overflow-hidden">
                             <h4 className="font-bold text-white truncate">{pl.name}</h4>
                             <p className="text-xs text-[#B3B3B3] mt-1">{pl.count}</p>
                          </div>
                          <button className="ml-auto w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-[#B3B3B3] hover:text-white hover:border-white opacity-0 group-hover:opacity-100 transition-all">
                             <MoreHorizontal className="w-4 h-4" />
                          </button>
                       </div>
                    ))}
                 </div>
              </section>

            </div>
          )}

          {currentView === 'search' && (
             <div className="p-6 md:p-8 max-w-5xl mx-auto min-h-[60vh]">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">Search Results</h2>
                  <button onClick={() => { setSearchQuery(''); setCurrentView('home'); }} className="text-sm text-[#B3B3B3] hover:text-white underline">Clear Search</button>
               </div>
               
               {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                     <div className="w-10 h-10 border-4 border-[#7C5CFF] border-t-transparent rounded-full animate-spin mb-4"></div>
                     <p>Searching for beats...</p>
                  </div>
               ) : searchResults.length > 0 ? (
                 <div className="space-y-2">
                    {searchResults.map((song, i) => (
                       <div key={i} onClick={() => playSong(song)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1F1F27] cursor-pointer group transition-colors border border-transparent hover:border-[#333]">
                          <div className="relative w-12 h-12 flex-shrink-0">
                             <img src={song.cover} alt="" className="w-full h-full rounded object-cover" />
                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Play className="w-4 h-4 text-white fill-white"/>
                             </div>
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="font-bold text-white truncate">{song.title}</h4>
                             <p className="text-sm text-[#B3B3B3] truncate">{song.artist}</p>
                          </div>
                          <div className="hidden md:block text-sm text-[#555]">
                             2:45
                          </div>
                          <button className="p-2 text-[#B3B3B3] hover:text-[#7C5CFF]"><Heart className="w-5 h-5"/></button>
                       </div>
                    ))}
                 </div>
               ) : (
                  <div className="text-center py-20">
                     <div className="inline-block p-4 rounded-full bg-[#18181F] mb-4">
                        <Search className="w-8 h-8 text-[#333]" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                     <p className="text-[#B3B3B3]">Try searching for "M83", "Dua Lipa", or paste a link.</p>
                  </div>
               )}
             </div>
          )}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 h-[90px] glass-player z-50 px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 w-[30%] min-w-[140px]">
               <div className="relative group">
                  <img src={currentSong.cover} alt="" className={`w-14 h-14 rounded-lg shadow-lg object-cover ${isPlaying ? 'animate-pulse-slow' : ''}`} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                     <button onClick={() => setIsSidebarOpen(true)} className="text-white"><MoreHorizontal className="w-5 h-5"/></button>
                  </div>
               </div>
               <div className="hidden sm:block overflow-hidden">
                  <h4 className="font-bold text-sm text-white truncate max-w-[150px]">{currentSong.title}</h4>
                  <p className="text-xs text-[#B3B3B3] truncate">{currentSong.artist}</p>
               </div>
               <button className="text-[#B3B3B3] hover:text-[#1DB954] transition-colors ml-2 hidden lg:block"><Heart className="w-4 h-4" /></button>
            </div>

            <div className="flex flex-col items-center justify-center w-[40%] max-w-lg">
               <div className="flex items-center gap-4 md:gap-6 mb-2">
                  <button className="text-[#555] hover:text-white transition-colors hidden sm:block"><Shuffle className="w-4 h-4" /></button>
                  <button className="text-[#B3B3B3] hover:text-white transition-colors"><SkipBack className="w-5 h-5 fill-current" /></button>
                  
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 text-black fill-black" /> : <Play className="w-5 h-5 md:w-6 md:h-6 text-black fill-black ml-1" />}
                  </button>
                  
                  <button className="text-[#B3B3B3] hover:text-white transition-colors"><SkipForward className="w-5 h-5 fill-current" /></button>
                  <button className="text-[#555] hover:text-white transition-colors hidden sm:block"><Repeat className="w-4 h-4" /></button>
               </div>
               
               <div className="w-full flex items-center gap-3 text-[10px] md:text-xs text-[#B3B3B3] font-medium font-mono select-none">
                  <span className="w-8 text-right">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-1 bg-[#333] rounded-full relative group cursor-pointer">
                     <div 
                       className="absolute top-0 left-0 h-full bg-[#1DB954] rounded-full group-hover:bg-[#1ed760] transition-all" 
                       style={{ width: `${(currentTime / duration) * 100}%` }}
                     >
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                     <input 
                       type="range" 
                       min="0" 
                       max={duration || 0} 
                       value={currentTime} 
                       onChange={(e) => {
                          const val = Number(e.target.value);
                          audioRef.current.currentTime = val;
                          setCurrentTime(val);
                       }}
                       className="absolute inset-0 w-full opacity-0 cursor-pointer"
                     />
                  </div>
                  <span className="w-8">{formatTime(duration)}</span>
               </div>
            </div>

            <div className="flex items-center justify-end gap-3 w-[30%] min-w-[140px]">
               {isPlaying && (
                  <div className="equalizer mr-2 hidden lg:flex">
                     <div className="bar"></div>
                     <div className="bar"></div>
                     <div className="bar"></div>
                     <div className="bar"></div>
                  </div>
               )}
               <div className="flex items-center gap-2 group">
                  <button onClick={() => setVolume(v => v === 0 ? 0.8 : 0)} className="text-[#B3B3B3] hover:text-white">
                     {volume === 0 ? <Volume2 className="w-5 h-5 opacity-50"/> : <Volume2 className="w-5 h-5"/>}
                  </button>
                  <div className="w-16 md:w-24 h-1 bg-[#333] rounded-full relative overflow-hidden hidden sm:block">
                     <div className="absolute top-0 left-0 h-full bg-[#B3B3B3] group-hover:bg-[#7C5CFF]" style={{ width: `${volume * 100}%` }}></div>
                     <input 
                       type="range" 
                       min="0" 
                       max="1" 
                       step="0.05"
                       value={volume}
                       onChange={(e) => setVolume(Number(e.target.value))}
                       className="absolute inset-0 w-full opacity-0 cursor-pointer"
                     />
                  </div>
               </div>
               <button className="text-[#B3B3B3] hover:text-white hidden lg:block ml-2"><Share2 className="w-4 h-4"/></button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default ShanoveMusic;

