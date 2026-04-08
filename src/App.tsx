/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Menu, X, ChevronRight, Recycle, Award,
  ShieldCheck, Mail, Phone, MapPin,
  CheckCircle2, ArrowUpRight
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

// --- Navbar ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between">
        <span className="font-bold">(주)화림</span>
      </div>
    </nav>
  );
};

// --- App ---
export default function App() {
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // ✅ Hook 정상 위치
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // ✅ 카카오맵 정상 처리
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

      {/* 스크롤 바 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      {/* Hero */}
      <section className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <h1 className="text-5xl font-bold">(주)화림</h1>
      </section>

      {/* 제품 샘플 */}
      <section className="p-20 grid grid-cols-2 gap-10">
        {[alsite00B, alsite00G, alsite00P, alsite40P].map((img, i) => (
          <div key={i} className="border p-4">
            <img src={img} className="w-full h-60 object-cover" />
          </div>
        ))}
      </section>

      {/* 인증 */}
      <section className="p-20 grid grid-cols-4 gap-6">
        {[certIso9001, certInnoBiz, patent0338465, patent0406492].map((img, i) => (
          <div key={i} className="border p-4">
            <img src={img} className="w-full h-40 object-contain" />
          </div>
        ))}
      </section>

      {/* 지도 */}
      <section className="p-10">
        <div
          id="daumRoughmapContainer1775634738188"
          className="w-full h-[400px]"
        ></div>
      </section>

      {/* 연락처 */}
      <section className="p-20">
        <div className="space-y-4">
          <div className="flex gap-3"><MapPin /> 경남 함안군</div>
          <div className="flex gap-3"><Phone /> 055-583-8063</div>
          <div className="flex gap-3"><Mail /> hwarim2@naver.com</div>
        </div>
      </section>

    </div>
  );
}
