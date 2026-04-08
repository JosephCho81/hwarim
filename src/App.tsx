/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Menu, X, ChevronRight, Factory, Recycle, Award, Users,
  History, Settings, ShieldCheck, Mail, Phone, MapPin,
  CheckCircle2, ArrowUpRight, ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";

// --- Constants ---
const furnaceImg = "/Hwarim.jpg";
const alsite00B = "/1.jpg";
const alsite00G = "/1.jpg";
const alsite00P = "/2.jpg";
const alsite40P = "/2.jpg";
const alsite85P = "/2.jpg";
const slagDeoxidizer = "/2.jpg";
const test1 = "/test1.png";
const test2 = "/test2.png";
const certInnoBiz = "/cert_inno_biz.png";
const certIso9001 = "/cert_iso_9001.png";
const patent0338465 = "/patent_0338465.png";
const patent0406492 = "/patent_0406492.png";
const patent0517524 = "/patent_0517524.png";
const patent0557004 = "/patent_0557004.png";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "회사소개", href: "#about" },
    { name: "연혁", href: "#history" },
    { name: "제품정보", href: "#products" },
    { name: "설비/공정", href: "#facilities" },
    { name: "인증현황", href: "#certifications" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-nav py-3" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Recycle className="w-full h-full text-brand" strokeWidth={2.5} />
            <span className="absolute text-[9px] font-black text-slate-700 mt-0.5">HR</span>
          </div>
          <span className={`font-bold text-xl tracking-tight ${isScrolled ? "text-slate-900" : "text-white"}`}>
            (주)화림
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium">
              {link.name}
            </a>
          ))}
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

// --- Main App ---

export default function App() {
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // ✅ Hook 위치 수정
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // ✅ 카카오맵 스크립트 정상 useEffect 처리
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";
    script.async = true;

    script.onload = () => {
      if ((window as any).daum?.roughmap) {
        new (window as any).daum.roughmap.Lander({
          timestamp: "1775634738188",
          key: "kcri6awg79c",
          mapWidth: "100%",
          mapHeight: "400",
        }).render();
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="relative">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60] origin-left" style={{ scaleX }} />

      <Navbar />

      {/* 최소 렌더 구조 유지 */}
      <section className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <h1 className="text-4xl font-bold">(주)화림</h1>
      </section>

      {/* 지도 */}
      <section className="p-10">
        <div
          id="daumRoughmapContainer1775634738188"
          className="w-full h-[400px]"
        ></div>
      </section>
    </div>
  );
}
