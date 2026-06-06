import { Heart, MessageSquare, Share2, CheckCircle, MoreHorizontal } from "lucide-react";
import React from 'react';
import { motion } from 'motion/react';

export const PostCard = ({ author, content, image, likes, comments, timestamp }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-12 h-12 rounded-2xl object-cover"
            />
            {author.verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <CheckCircle size={14} className="text-blue-600 fill-blue-600/10" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-tight">{author.name}</h4>
            <p className="text-xs text-slate-400 font-medium">{timestamp}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed font-medium">
          {content}
        </p>

        {image && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-100">
            <img
              src={image}
              alt="Post visual"
              className="w-full aspect-[4/3] object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-sm">
            <Heart size={18} className="group-hover:fill-blue-600/10" />
            <span>{likes}</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-sm">
            <MessageSquare size={18} />
            <span>{comments}</span>
          </button>
        </div>
        <button className="text-slate-400 hover:text-blue-600 transition-colors">
          <Share2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};
