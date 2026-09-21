"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, HeartHandshake } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  snippet: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
}

const ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "5 Tips for Heart Health",
    category: "Cardiology",
    snippet: "Evidence-based cardiovascular recommendations on aerobic exercise, blood pressure monitoring, and omega-3 nutrition.",
    date: "2 months ago",
    readTime: "4 min read",
    author: "Dr. Esita Jabed",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "art-2",
    title: "Understanding Diabetes & Blood Glucose",
    category: "Endocrinology",
    snippet: "How continuous glucose monitors, insulin sensitivity, and glycemic indexing empower everyday health management.",
    date: "2 months ago",
    readTime: "6 min read",
    author: "Dr. Marcus Vance",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "art-3",
    title: "Geriatric & Preventive Care Tips",
    category: "Senior Wellness",
    snippet: "Crucial preventive screenings, medication reviews, and lifestyle tips to keep older adults active, safe, and independent.",
    date: "3 months ago",
    readTime: "5 min read",
    author: "Dr. Elena Rostova",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600&auto=format&fit=crop",
  },
];

export default function HealthArticles() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <section id="articles" className="py-16 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-3 border border-sky-200 dark:border-sky-800">
            <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>CLINICAL KNOWLEDGE &amp; WELLNESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Health Articles
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Expert articles and health guides authored by our board-certified medical specialists.
          </p>
        </div>

        {/* 3 Articles Grid with Image Zoom & Hover Lift */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {ARTICLES.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group cursor-pointer"
            >
              {/* Image Container with Zoom */}
              <div className="relative w-full aspect-[16/10] zoom-container bg-slate-200 dark:bg-slate-800">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-sky-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
                  {art.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {art.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {art.snippet}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    By {art.author}
                  </span>
                  
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Modal preview when an article is clicked */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeInUp">
            <div className="glass-panel bg-white dark:bg-[#0b1426] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-white/20 shadow-2xl relative">
              <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-5">
                <Image
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                {selectedArticle.category}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                {selectedArticle.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                By {selectedArticle.author} • {selectedArticle.date}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {selectedArticle.snippet} This educational resource provides clinical insights, medical precautions, and practical guidance reviewed by our board physicians. Maintain regular check-ups with your doctor for individual conditions.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 rounded-full font-bold text-xs bg-sky-600 text-white hover:bg-sky-700 cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
