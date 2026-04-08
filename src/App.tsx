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
    <nav className={`fixed w-full z-50 transition ${isScrolled ? "bg-white shadow" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto flex justify-between p-6">
        <div className="flex items-center gap-2 font-bold">
          <Recycle /> (주)화림
        </div>
      </div>
    </nav>
  );
};

// --- Section Heading ---
const SectionHeading = ({ title, subtitle }: any) => (
  <div className="mb-12 text-center">
    <h2 className="text-3xl font-bold mb-2">{title}</h2>
    <p className="text-slate-500">{subtitle}</p>
  </div>
);

// --- App ---
export default function App() {
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // ✅ 정상 위치
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // ✅ 카카오맵
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
    <div>

      {/* Scroll Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left" style={{ scaleX }} />

      <Navbar />

      {/* Hero */}
      <section className="h-screen flex items-center justify-center bg-slate-900 text-white text-center">
        <div>
          <h1 className="text-6xl font-bold mb-4">(주)화림</h1>
          <p className="text-xl text-slate-300">
            알루미늄 Dross 처리 및 제강 부자재 전문 기업
          </p>
        </div>
      </section>

      {/* About */}
      <section className="p-20 bg-slate-50">
        <SectionHeading
          title="회사 소개"
          subtitle="알루미늄 폐기물 재활용을 통한 환경 보호 기업"
        />
        <div className="grid md:grid-cols-3 gap-10">
          {[
            "기술력 인정",
            "환경 보호",
            "글로벌 진출"
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded shadow">
              <h3 className="font-bold mb-2">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="p-20">
        <SectionHeading title="제품" subtitle="ALSITE & BRIQUETTE" />
        <div className="grid md:grid-cols-4 gap-6">
          {[alsite00B, alsite00G, alsite40P, alsite85P].map((img, i) => (
            <div key={i}>
              <img src={img} className="w-full h-48 object-cover rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="p-20 bg-slate-50">
        <SectionHeading title="인증" subtitle="품질 인증 및 특허" />
        <div className="grid md:grid-cols-4 gap-6">
          {[certIso9001, certInnoBiz, patent0338465, patent0406492].map((img, i) => (
            <div key={i} onClick={() => setSelectedCert(img)}>
              <img src={img} className="w-full h-40 object-contain cursor-pointer" />
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center"
            onClick={() => setSelectedCert(null)}>
            <motion.img
              src={selectedCert}
              className="max-w-lg bg-white p-4"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact */}
      <section className="p-20">
        <SectionHeading title="문의" subtitle="연락처 정보" />
        <div className="space-y-4">
          <div className="flex gap-3"><MapPin /> 경남 함안군 군북면</div>
          <div className="flex gap-3"><Phone /> 055-583-8063</div>
          <div className="flex gap-3"><Mail /> hwarim2@naver.com</div>
        </div>

        {/* Map */}
        <div className="mt-10">
          <div id="daumRoughmapContainer1775634738188" className="w-full h-[400px]" />
        </div>
      </section>

    </div>
  );
}
