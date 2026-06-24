import React, { useState, useEffect } from "react";
import { Search as SearchIcon, X, TrendingUp, Users, Utensils, Dumbbell, Zap, PlayCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../app/components/ui";
import { fetchExploreSearch, fetchExploreTrending, fetchExploreTrainers, fetchExploreVideos, fetchExploreArticles } from "../api/endpoints";
import { toast } from "sonner";

const tabs = [
  { id: "all", label: "All", icon: TrendingUp },
  { id: "workouts", label: "Workouts", icon: Dumbbell },
  { id: "nutrition", label: "Nutrition", icon: Utensils },
  { id: "trainers", label: "Trainers", icon: Users },
  { id: "supplements", label: "Supplements", icon: Zap },
];

export default function Search() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchIntent, setSearchIntent] = useState("");

  // Default content
  const [trending, setTrending] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loadingDefaults, setLoadingDefaults] = useState(true);

  useEffect(() => {
    const loadDefaults = async () => {
      try {
        setLoadingDefaults(true);
        const [tr, trn, vid, art] = await Promise.all([
          fetchExploreTrending().catch(() => ({ data: { results: [] } })),
          fetchExploreTrainers().catch(() => ({ data: { results: [] } })),
          fetchExploreVideos().catch(() => ({ data: { results: [] } })),
          fetchExploreArticles().catch(() => ({ data: { results: [] } }))
        ]);
        setTrending(tr.data?.results || []);
        setTrainers(trn.data?.results || []);
        setVideos(vid.data?.results || []);
        setArticles(art.data?.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingDefaults(false);
      }
    };
    loadDefaults();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchIntent("");
      return;
    }
    
    setIsSearching(true);
    try {
      const { data } = await fetchExploreSearch(searchQuery);
      setSearchIntent(data.intent);
      setSearchResults(data.results || []);
    } catch (err) {
      toast.error("Search failed");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const renderArticleCard = (item) => (
    <motion.a href={item.url} target="_blank" rel="noreferrer" whileHover={{ y: -4 }} key={item.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
      <div className="h-40 w-full overflow-hidden bg-gray-50 relative">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-brand-text">Article</div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h4 className="font-black text-brand-text mb-2 line-clamp-2">{item.title}</h4>
        <p className="text-sm font-medium text-brand-muted line-clamp-3 mb-4">{item.summary}</p>
        <span className="text-brand-orange text-sm font-bold mt-auto flex items-center gap-1 group-hover:gap-2 transition-all">Read More &rarr;</span>
      </div>
    </motion.a>
  );

  const renderVideoCard = (item) => (
    <motion.a href={item.url} target="_blank" rel="noreferrer" whileHover={{ y: -4 }} key={item.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
      <div className="h-40 w-full overflow-hidden bg-gray-900 relative flex items-center justify-center">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" />
        <PlayCircle size={48} className="text-white absolute drop-shadow-md group-hover:scale-110 transition-transform" />
      </div>
      <div className="p-4">
        <h4 className="font-black text-brand-text mb-1 line-clamp-2 leading-tight text-sm">{item.title}</h4>
        <p className="text-xs font-bold text-brand-muted">{item.channel}</p>
      </div>
    </motion.a>
  );

  const renderFoodCard = (item) => (
    <motion.div whileHover={{ y: -4 }} key={item.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all p-4 flex gap-4">
      <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 p-2">
        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h4 className="font-black text-brand-text text-sm mb-1 line-clamp-2">{item.title || item.name}</h4>
        <div className="flex gap-2 text-xs font-bold text-brand-muted">
          <span>{(item.nutrition?.calories || 0)} kcal</span>
          <span className="text-brand-orange">{(item.nutrition?.protein || 0)}g protein</span>
        </div>
      </div>
    </motion.div>
  );

  const renderWorkoutCard = (item) => (
    <motion.div whileHover={{ y: -4 }} key={item.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
      <div className="h-40 bg-gray-50 p-4">
        <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply" />
      </div>
      <div className="p-4 border-t border-gray-50">
        <h4 className="font-black text-brand-text text-sm mb-1">{item.title}</h4>
        <div className="flex gap-2">
          <span className="bg-brand-orange/10 text-brand-orange text-[10px] px-2 py-1 rounded-md font-bold uppercase">{item.target}</span>
          <span className="bg-gray-100 text-brand-muted text-[10px] px-2 py-1 rounded-md font-bold uppercase">{item.equipment}</span>
        </div>
      </div>
    </motion.div>
  );

  const renderTrainerCard = (item) => (
    <motion.div whileHover={{ y: -4 }} key={item.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-brand-orange/20">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <h4 className="font-black text-brand-text text-lg">{item.title}</h4>
      <p className="text-brand-orange text-xs font-black uppercase tracking-wider mb-2">{item.specialization}</p>
      <span className="text-brand-muted text-sm font-bold bg-gray-50 px-3 py-1 rounded-full">{item.followers} Followers</span>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 pb-24">
      {/* Search Header */}
      <div className="mb-8 relative z-20">
        <h1 className="text-3xl font-black text-brand-text tracking-tighter mb-6">Explore</h1>
        
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <SearchIcon size={20} className="text-brand-muted group-focus-within:text-brand-orange transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workouts, diets, trainers, supplements..."
            className="w-full pl-13 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-brand-text font-bold placeholder:text-brand-muted placeholder:font-medium focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all shadow-sm text-lg"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setSearchResults([]); setSearchIntent(""); }}
              className="absolute inset-y-0 right-4 flex items-center text-brand-muted hover:text-brand-text"
            >
              <X size={20} />
            </button>
          )}
        </form>
      </div>

      {/* Main Content */}
      {searchQuery && searchResults.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6 bg-brand-orange/10 p-4 rounded-2xl border border-brand-orange/20">
            <Zap className="text-brand-orange" size={24} />
            <div>
              <p className="text-sm font-bold text-brand-muted">AI recognized your intent as:</p>
              <p className="font-black text-brand-orange text-lg capitalize">{searchIntent.replace('_', ' ')}</p>
            </div>
          </div>
          
          <h2 className="text-xl font-black text-brand-text tracking-tight mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {searchResults.map((item, index) => {
              const key = item.id || index;
              if (item.type === "article") return renderArticleCard({...item, id: key});
              if (item.type === "video") return renderVideoCard({...item, id: key});
              if (item.type === "workout") return renderWorkoutCard({...item, id: key});
              if (item.nutrition) return renderFoodCard({...item, id: key});
              if (item.type === "trainer") return renderTrainerCard({...item, id: key});
              return null;
            })}
          </div>
        </div>
      ) : isSearching ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-brand-text">AI is searching the fitness universe...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Tabs - UI only, could filter defaults later */}
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar sticky top-0 bg-brand-bg/80 backdrop-blur-md z-10 py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 flex-shrink-0 border",
                  activeTab === tab.id
                    ? "bg-brand-text text-white border-brand-text shadow-md"
                    : "bg-white text-brand-muted hover:text-brand-text border-gray-200 hover:border-gray-300 shadow-sm"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {loadingDefaults ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin"></div></div>
          ) : (
            <>
              {/* Trending */}
              {(activeTab === "all" || activeTab === "trending") && trending.length > 0 && (
                <section>
                  <h2 className="text-2xl font-black text-brand-text tracking-tight mb-6 flex items-center gap-2">
                    <TrendingUp className="text-brand-orange" /> Trending This Week
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {trending.map(renderArticleCard)}
                  </div>
                </section>
              )}

              {/* Workout Videos */}
              {(activeTab === "all" || activeTab === "workouts") && videos.length > 0 && (
                <section>
                  <h2 className="text-2xl font-black text-brand-text tracking-tight mb-6 flex items-center gap-2">
                    <PlayCircle className="text-brand-orange" /> Popular Workouts
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {videos.map(renderVideoCard)}
                  </div>
                </section>
              )}

              {/* Trainers */}
              {(activeTab === "all" || activeTab === "trainers") && trainers.length > 0 && (
                <section>
                  <h2 className="text-2xl font-black text-brand-text tracking-tight mb-6 flex items-center gap-2">
                    <Users className="text-brand-orange" /> Popular Trainers
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {trainers.map(renderTrainerCard)}
                  </div>
                </section>
              )}

              {/* Articles */}
              {(activeTab === "all" || activeTab === "nutrition" || activeTab === "supplements") && articles.length > 0 && (
                <section>
                  <h2 className="text-2xl font-black text-brand-text tracking-tight mb-6 flex items-center gap-2">
                    <BookOpen className="text-brand-orange" /> Fitness Science
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {articles.map(renderArticleCard)}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
