const fs = require('fs');
const path = require('path');

const appHomePath = path.resolve('d:/Acdamic/FitcirclePro/client/src/app/Home.jsx');
let content = fs.readFileSync(appHomePath, 'utf-8');

// 1. Add imports
const importsToAdd = `import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";`;

content = content.replace('import API from "../api/axios";', `import API from "../api/axios";\n${importsToAdd}`);

// 2. Add state and hooks to Home component
const hooksToAdd = `  const [activeTab, setActiveTab] = useState("All");
  const { ref, inView } = useInView();

  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isFeedLoading,
  } = useInfiniteQuery({
    queryKey: ['redditFeed', activeTab],
    queryFn: async ({ pageParam = '' }) => {
      const categoryParam = activeTab === "All" ? "" : activeTab;
      const res = await API.get(\`/feed/reddit?category=\${categoryParam}&after=\${pageParam}\`);
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage?.after || undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const redditPosts = feedData?.pages.flatMap(page => page.posts) || [];

  const formatTime = (utcSeconds) => {
    if (!utcSeconds) return "";
    return formatDistanceToNow(new Date(utcSeconds * 1000), { addSuffix: true });
  };`;

content = content.replace('  const [reelsData, setReelsData] = useState(reels);', `  const [reelsData, setReelsData] = useState(reels);\n\n${hooksToAdd}`);

// 3. Update Feed Filters (Tabs)
const oldFeedHeader = `<div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-10 gap-4 lg:gap-6">
          <div>
            <h2 className="text-2xl lg:text-4xl font-black text-brand-text uppercase tracking-tighter mb-1">Community Feed</h2>
            <p className="text-brand-muted text-xs lg:text-base font-medium">Trending posts from your circle</p>
          </div>
          <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-[1.2rem] shadow-inner w-fit">
            <button className="px-6 py-2.5 bg-white text-brand-text text-[10px] lg:text-xs font-black rounded-xl shadow-sm border border-gray-200 uppercase tracking-widest">Following</button>
            <button className="px-6 py-2.5 text-brand-muted text-[10px] lg:text-xs font-black hover:text-brand-text transition-colors uppercase tracking-widest">Discover</button>
          </div>
        </div>`;

const newFeedHeader = `<div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-10 gap-4 lg:gap-6">
          <div>
            <h2 className="text-2xl lg:text-4xl font-black text-brand-text uppercase tracking-tighter mb-1">Reddit Feed</h2>
            <p className="text-brand-muted text-xs lg:text-base font-medium">Trending posts from fitness communities</p>
          </div>
          <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-[1.2rem] shadow-inner w-fit overflow-x-auto hide-scrollbar">
            {["All", "Fitness", "Nutrition", "Weight Loss", "Muscle Gain"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={\`px-6 py-2.5 text-[10px] lg:text-xs font-black rounded-xl transition-all uppercase tracking-widest whitespace-nowrap \${activeTab === tab ? "bg-white text-brand-text shadow-sm border border-gray-200" : "text-brand-muted hover:text-brand-text"}\`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>`;
content = content.replace(oldFeedHeader, newFeedHeader);

// 4. Update the Posts mapping
const oldPostsMapRegex = /<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">[\s\S]*?(?=<\/section>)/;
const newPostsMap = `<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {redditPosts.map((post) => (
            <motion.article key={post.id} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-brand-orange/10 transition-all duration-500 group flex flex-col">
              <div className="flex items-center justify-between p-5 lg:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-[2.5px] rounded-full bg-gradient-to-br from-brand-orange to-brand-red shadow-md shrink-0">
                    <img src={post.author.avatar} onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=User&background=random' }} alt="" className="w-11 h-11 rounded-full border-2 border-white object-cover bg-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-brand-text group-hover:text-brand-orange transition-colors truncate">u/{post.author.name}</h4>
                    <p className="text-[10px] text-brand-muted font-bold tracking-tight truncate flex items-center gap-1">
                      <span className="text-brand-orange">r/{post.subreddit}</span> • {formatTime(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => window.open(post.url, '_blank')} className="p-2 hover:bg-gray-50 rounded-full text-brand-muted transition-colors"><ExternalLink size={18} /></button>
                </div>
              </div>

              <div className="px-6 pb-4 flex-grow">
                <p className="text-sm text-brand-text/90 font-medium leading-relaxed font-bold">{post.title}</p>
                {post.selftext && (
                  <p className="text-xs text-brand-text/70 mt-2 line-clamp-3">{post.selftext}</p>
                )}
              </div>

              {post.image && (
                <div className="w-full aspect-[16/10] lg:aspect-[16/9] bg-gray-100 overflow-hidden relative group-hover:ring-1 group-hover:ring-brand-orange/10 cursor-pointer" onClick={() => window.open(post.url, '_blank')}>
                  {post.isVideo && post.fallbackUrl ? (
                    <video src={post.fallbackUrl} poster={post.image} controls className="w-full h-full object-contain bg-black" controlsList="nodownload" />
                  ) : (
                    <img src={post.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={(e) => { e.target.style.display = 'none'; }} />
                  )}
                </div>
              )}

              <div className="p-6 lg:p-7">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={() => toggleLike(post.id)} className="flex items-center gap-2 group/like">
                      <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover/like:bg-brand-red/10">
                        <Flame size={20} lg:size={22} className={\`transition-all \${likedPosts.has(post.id) ? "fill-brand-orange text-brand-orange scale-110" : "text-brand-orange"}\`} />
                      </div>
                      <span className="text-xs font-black italic">{post.upvotes > 1000 ? (post.upvotes / 1000).toFixed(1) + 'k' : post.upvotes}</span>
                    </button>
                    <button className="flex items-center gap-2 group/comm" onClick={() => window.open(post.url, '_blank')}>
                      <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover/comm:bg-brand-orange/10">
                        <MessageCircle size={20} lg:size={22} className="text-brand-text" />
                      </div>
                      <span className="text-xs font-black italic">{post.comments}</span>
                    </button>
                    <button className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all" onClick={() => window.open(post.url, '_blank')}>
                      <Share2 size={20} lg:size={22} className="text-brand-text" />
                    </button>
                  </div>
                  <button onClick={() => toggleSave(post.id)} className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all">
                    <Bookmark size={20} lg:size={22} className={\`transition-all \${savedPosts.has(post.id) ? "fill-brand-text text-brand-text" : "text-brand-text"}\`} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        
        <div ref={ref} className="h-10 flex items-center justify-center mt-6">
          {isFetchingNextPage && <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />}
        </div>
        `;
content = content.replace(oldPostsMapRegex, newPostsMap);

fs.writeFileSync(appHomePath, content);
console.log('Successfully updated app/Home.jsx');
