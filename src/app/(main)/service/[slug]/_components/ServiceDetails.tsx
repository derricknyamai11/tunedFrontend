"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Clock, Zap, MessageSquare, Award } from "lucide-react";
// import { cn } from "@/lib/utils";
import type { ServiceDetailsProps } from "@/lib/props/service.props";

export function ServiceDetails({ service }: ServiceDetailsProps) {
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: "100% Original Content",
      desc: "Every project is crafted from scratch with zero tolerance for plagiarism."
    },
    {
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
      title: "Punctual Delivery",
      desc: "We respect your deadlines and ensure timely completion of every task."
    },
    {
      icon: <Award className="w-5 h-5 text-emerald-500" />,
      title: "Expert Quality",
      desc: "Work reviewed by specialized quality assurance teams before delivery."
    }
  ];

  const highlights = [
    "Plagiarism Report Included",
    "Unlimited Revisions",
    "Subject Matter Experts",
    "24/7 Priority Support",
    "Confidential & Secure",
    "Direct Expert Communication"
  ];

  return (
    <section className="relative bg-white py-24 lg:py-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-slate-50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 xl:col-span-8"
          >
            <div className="flex flex-col gap-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
                  <Zap size={14} className="text-emerald-600 fill-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Deep Dive</span>
                </div>
                <h2 id="overview" className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Comprehensive Service <span className="text-emerald-600">Overview</span>
                </h2>
              </div>

              <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-[17px] prose-strong:text-slate-900 prose-strong:font-bold prose-li:text-slate-600 prose-li:marker:text-emerald-500 prose-blockquote:border-emerald-500 prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-img:rounded-2xl prose-img:shadow-xl">
                <div>
                  <p>{service.description}</p>
                </div> 
                
              </article>

              {/* Tag Cloud */}
              {service.tags && service.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-100">
                  {service.tags.map((tag) => (
                    <span 
                      key={tag.id}
                      className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-sm font-bold border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 cursor-default"
                    >
                      # {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar / Feature Area */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-10">
            
            {/* Feature Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-3">
                <div className="h-1.5 w-8 bg-emerald-500 rounded-full" />
                Key Benefits
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-100 transition-all duration-300 active:scale-[0.98]"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 w-fit group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                        {feature.icon}
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">{feature.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sticky Highlight List */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/20 blur-[60px] group-hover:bg-emerald-500/30 transition-colors duration-500" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    <MessageSquare size={18} className="text-white" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">Standard Features</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 group/item">
                      <CheckCircle2 size={16} className="text-emerald-400 group-hover/item:scale-110 transition-transform" />
                      <span className="text-sm font-bold text-slate-300 group-hover/item:text-white transition-colors">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800">
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Trust</span>
                     <div className="flex gap-1 text-emerald-400">
                       {[1, 2, 3, 4, 5].map(i => <Zap key={i} size={10} className="fill-emerald-400" />)}
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
