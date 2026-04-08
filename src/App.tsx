 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { 
  Menu, X, ChevronRight, Factory, Recycle, Award, Users, 
  History, Settings, ShieldCheck, Mail, Phone, MapPin, 
  CheckCircle2, ArrowUpRight, ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";

// --- Constants ---
const furnaceImg = "/Hwarim.jpg";
const alsite00B = "/ALSITE-00-B.png";
const alsite00G = "/ALSITE-00-G.png";
const alsite00P = "/ALSITE-00P.png";
const alsite40P = "/ALSITE-40P.png";
const alsite85P = "/ALSITE-85P.png";
const slagDeoxidizer = "/SLAG_DEOXIDIZER.png";
const testFurnace = "/TEST_FURNACE.png";
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
    <nav className={fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-nav py-3" : "bg-transparent py-6"}}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Recycle className="w-full h-full text-brand" strokeWidth={2.5} />
            <span className="absolute text-[9px] font-black text-slate-700 mt-0.5">HR</span>
          </div>
          <span className={font-bold text-xl tracking-tight ${isScrolled ? "text-slate-900" : "text-white"}}>
            (주)화림 <span className="text-xs font-medium opacity-60 ml-1">HWARIM</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={text-sm font-medium transition-colors hover:text-brand ${isScrolled ? "text-slate-600" : "text-white/90"}}
            >
              {link.name}
            </a>
          ))}
          <a href="#contact" className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-full text-sm font-semibold transition-all">
            문의하기
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-brand" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} className={isScrolled ? "text-slate-900" : "text-white"} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden shadow-xl"
        >
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-700 hover:text-brand"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-brand text-white text-center py-3 rounded-lg font-bold"
          >
            문의하기
          </a>
        </motion.div>
      )}
    </nav>
  );
};

const SectionHeading = ({ title, subtitle, light = false }: { title: string, subtitle?: string, light?: boolean }) => (
  <div className="mb-12">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={w-12 h-1.5 bg-brand mb-4}
    />
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className={heading-lg mb-4 ${light ? "text-white" : "text-slate-900"}}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className={subheading ${light ? "text-slate-300" : "text-slate-600"}}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

// --- Main App ---

export default function App() {
  const [selectedCert, setSelectedCert] = useState<{ title: string; desc: string; img: string } | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60] origin-left" style={{ scaleX }} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-start overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src={furnaceImg} 
            alt="Industrial Furnace" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/10 to-slate-900/60" />
        </div>
        
        <div className="relative z-10 px-6 max-w-5xl text-left ml-0 md:ml-10 lg:ml-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full border border-brand/30 bg-brand/10 text-brand text-sm font-bold tracking-widest uppercase"
          >
            BRIQUETTE / ALSITE 제조 전문 기업
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tighter"
          >
            (주)화 림
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 mb-10 font-medium max-w-3xl leading-relaxed"
          >
            제철, 제강용 부자재, 알루미늄 Dross처리 전문 기업 <br className="hidden md:block" />
            최고의 기술로 자원 재생의 가치를 더합니다.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#about" className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 group">
              회사 소개 보기 <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#products" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all">
              제품 정보 확인
            </a>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-bold tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand to-transparent" />
        </motion.div>
      </section>

      {/* Intro Section (Page 3) */}
      <section id="about" className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={furnaceImg} 
                  alt="Furnace Detail" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-brand p-8 rounded-2xl shadow-xl hidden md:block">
                <div className="text-white text-center">
                  <div className="text-4xl font-black mb-1">25+</div>
                  <div className="text-sm font-bold opacity-80">Years of Excellence</div>
                </div>
              </div>
            </motion.div>

            <div>
              <SectionHeading 
                title="기술이 앞선 회사, (주)화림" 
                subtitle="우리는 작은 회사이지만 큰 일을 하고 있습니다. 알루미늄 폐기물을 재활용하여 국가 환경 보호에 기여합니다."
              />
              
              <div className="space-y-8">
                {[
                  { 
                    icon: <Award className="text-brand" />, 
                    title: "인정받은 기술력", 
                    desc: "기술신용보증기금 우량기술 기업, 중소기업청 벤처기업, 한국기계연구원 유망중소기업 선정" 
                  },
                  { 
                    icon: <Recycle className="text-brand" />, 
                    title: "환경 보호 앞장", 
                    desc: "알루미늄 폐기물 재활용을 통한 자원 절약 및 국가 환경 보호 실천" 
                  },
                  { 
                    icon: <ArrowUpRight className="text-brand" />, 
                    title: "글로벌 시장 진출", 
                    desc: "금속 슬러지 분쇄장치 기술 및 설비를 일본, 호주 등 선진국으로 수출 추진" 
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Stats (Page 7) */}
      <section className="bg-slate-900 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "대표이사", value: "김정길" },
              { label: "상시종업원", value: "25명" },
              { label: "자본금", value: "6억원" },
              { label: "연간 판매량", value: "45,000톤+" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-brand text-3xl md:text-4xl font-black mb-2">{stat.value}</div>
                <div className="text-slate-400 font-medium tracking-widest uppercase text-xs">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy (Page 8) */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionHeading 
              title="경영 방침" 
              subtitle="신망애덕(信望愛德)의 사훈 아래, 고객 만족과 품질 향상을 위해 최선을 다합니다."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "품질 방침", 
                items: ["전사적 경영능률 향상", "고객만족 제품개발", "사원 자질향상 및 행복추구"] 
              },
              { 
                title: "품질 목표", 
                items: ["원가 절감 실현", "불량률 최소화", "고객 만족 증진"] 
              },
              { 
                title: "경영 목표", 
                items: ["매출 증대 (연간 250억)", "순이익 달성 (연간 30억)", "지속 가능한 성장"] 
              }
            ].map((box, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-2xl font-bold mb-6 text-brand">{box.title}</h3>
                <ul className="space-y-4">
                  {box.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-slate-700">
                      <CheckCircle2 className="text-brand mt-1 flex-shrink-0" size={18} />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Table (Page 4-6) */}
      <section id="history" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="회사 연혁" subtitle="1998년 설립 이후 끊임없는 기술 혁신으로 성장해왔습니다." />
          
          <div className="mt-12 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-900 border-b border-slate-200">
                  <th className="px-6 py-4 font-bold text-sm md:text-base w-32 md:w-48">날짜</th>
                  <th className="px-6 py-4 font-bold text-sm md:text-base">주요 내용</th>
                  <th className="px-6 py-4 font-bold text-sm md:text-base hidden md:table-cell">비고</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { date: "1998. 01. 05", title: "주식회사 화림 설립", desc: "-" },
                  { date: "1998. 07. 31", title: "분쇄공장, 보온제공장 준공", desc: "-" },
                  { date: "1998. 07. 31", title: "분쇄공장 설비가동 개시", desc: "-" },
                  { date: "1998. 08. 10", title: "보온제공장 설비가동 개시", desc: "-" },
                  { date: "1999. 02. 09", title: "자본금 증액", desc: "증액 후 6억원" },
                  { date: "1999. 02. 25", title: "포항종합제철(주)광양제철소 거래업체 등록", desc: "-" },
                  { date: "1999. 12. 01", title: "분쇄시설 증설", desc: "月 2,400M/T 시설완료" },
                  { date: "2000. 10. 07", title: "우량기술기업 선정", desc: "기술신용보증기금 (제 947호)" },
                  { date: "2000. 10. 26", title: "벤처기업 선정", desc: "중소기업청 (제 2000212371-0440호)" },
                  { date: "2001. 03. 06", title: "유망중소기업선정", desc: "한국기계연구원 (NO . 1198)" },
                  { date: "2001. 03. 09", title: "대한민국 재향군인회 불용품 거래업체 등록", desc: "등록번호: KVA-가-152호" },
                  { date: "2002. 05. 16", title: "금속 슬러지 분쇄장치 특허등록", desc: "특허 제 0338465호" },
                  { date: "2003. 06. 25", title: "Ball Mill 증설가동", desc: "-" },
                  { date: "2003. 07. 01", title: "Hammer Mill 증설가동", desc: "-" },
                  { date: "2003. 09. 15", title: "상표등록", desc: "ALSITE, AL-40S, ALSTIE-40S" },
                  { date: "2003. 11. 07", title: "인젝션 투입용 슬래그 환원제 특허등록", desc: "특허 제 0406492호" },
                  { date: "2004. 11. 30", title: "ISO 9001(2008) 인증획득", desc: "-" },
                  { date: "2004. 09. 01", title: "BRIQUETTE LINE 설치(1호기)", desc: "-" },
                  { date: "2005. 09. 21", title: "탈산제 제조방법 특허등록", desc: "알루미늄 DROSS를 이용한 압축 성형 공정 (특허 제 0517524호)" },
                  { date: "2006. 02. 23", title: "탈황첨가제 특허등록", desc: "알루미늄 DROSS를 이용 (특허 제 0557004호)" },
                  { date: "2006. 06. 09", title: "기술혁신형 중소기업 (INNO-BIZ)", desc: "-" },
                  { date: "2006. 06. 01", title: "중소기업 생산 현장 직무 기피 요인 해소사업", desc: "2006.06.01~2007.05.31" },
                  { date: "2006. 08. 01", title: "중소기업기술혁신개발사업", desc: "2006.08.01~2007.07.31" },
                  { date: "2008. 07. 01", title: "BRIQUETTE LINE 설치(2호기)", desc: "-" },
                  { date: "2011. 11. 17", title: "알루미늄계 용강 승온재 특허등록", desc: "승온 효율이 높은 제품 (특허 제 10-1086395호)" },
                  { date: "2016. 01. 03", title: "BRIQUETTE LINE 설치(3호기)", desc: "-" }
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm md:text-base text-brand font-bold whitespace-nowrap">{item.date}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm md:text-base font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500 mt-1 md:hidden">{item.desc !== "-" ? item.desc : ""}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Products Section (Page 15-16) */}
      <section id="products" className="section-padding bg-white text-slate-900">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            title="주요 제품 및 생산 능력" 
            subtitle="최고의 기술력으로 생산되는 고품질 BRIQUETTE 및 ALSITE 제품군입니다." 
          />

          {/* Product Photos Layout (Page 16) */}
          <div className="grid md:grid-cols-2 gap-16 mb-20">
            {/* BRIQUETTE Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold border-l-4 border-brand pl-4 mb-8">[ BRIQUETTE ]</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { name: "ALSITE-00-G", img: alsite00G, desc: "" },
                  { name: "ALSITE-00-B", img: alsite00B, desc: "" },
                  { name: "TEST \"예\" 퍼짐성 TEST", img: "https://picsum.photos/seed/test-spread/600/450", desc: "" },
                  { name: "실 조업로에서 TEST 예 - I사", img: testFurnace, desc: "" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <p className="text-center text-sm font-bold text-slate-900">{item.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ALSITE Section */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold border-l-4 border-brand pl-4 mb-8">[ ALSITE ]</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { name: "ALSITE-40P", sub: "탈산제 / INJECTION용", img: alsite40P },
                  { name: "ALSITE-00P", sub: "탈산제 / INJECTION용", img: alsite00P },
                  { name: "ALSITE-85P", sub: "탈산제", img: alsite85P },
                  { name: "SLAG 탈산제", sub: "INJECTION용", img: slagDeoxidizer }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Production Capacity Table (Page 15) */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-50 text-brand uppercase text-sm md:text-base tracking-widest">
                  <th className="px-6 py-5 border-b border-slate-200">품 명</th>
                  <th className="px-6 py-5 border-b border-slate-200">형 상</th>
                  <th className="px-6 py-5 border-b border-slate-200">생산 능력</th>
                  <th className="px-6 py-4 border-b border-slate-200">주요 납품 업체</th>
                </tr>
              </thead>
              <tbody className="text-base md:text-lg text-slate-700">
                {[
                  { name: "ALSITE 15P", type: "Powder", cap: "1,700 톤/月", client: "주문생산" },
                  { name: "ALSITE 25P", type: "Powder", cap: "1,500 톤/月", client: "주문생산" },
                  { name: "ALSITE 25P", type: "Small packing", cap: "100 톤/月", client: "한국철강" },
                  { name: "ALSITE 30P", type: "Powder", cap: "1,000 톤/月", client: "주문생산" },
                  { name: "ALSITE 15B", type: "Briquette", cap: "1,500 톤/月", client: "현대제철" },
                  { name: "ALSITE 25B", type: "Briquette", cap: "1,500 톤/月", client: "현대제철, 세아베스틸" },
                  { name: "ALSITE 30B", type: "Briquette", cap: "1,000 톤/月", client: "현대제철" },
                  { name: "ALSITE 35B", type: "Briquette", cap: "1,000 톤/月", client: "주문생산" },
                  { name: "ALSITE 40B", type: "Briquette", cap: "800 톤/月", client: "현대제철" },
                  { name: "ALSITE 65B", type: "Briquette", cap: "200 톤/月", client: "주문생산" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 border-b border-slate-100 font-bold text-slate-900 text-lg md:text-xl">{row.name}</td>
                    <td className="px-6 py-5 border-b border-slate-100">{row.type}</td>
                    <td className="px-6 py-5 border-b border-slate-100 text-brand font-bold">{row.cap}</td>
                    <td className="px-6 py-5 border-b border-slate-100">{row.client}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500 text-right">※ 주요 납품 업체는 최종 사용처를 표기 하였음.</p>
        </div>
      </section>

      {/* Facilities & Process (Page 9-11) */}
      <section id="facilities" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <SectionHeading title="제조 및 검사 설비" subtitle="최첨단 설비와 엄격한 품질 검사 시스템을 통해 완벽한 제품을 생산합니다." />
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { name: "BALL MILL 분쇄기", spec: "3톤 / 시간" },
                  { name: "Briquette M/C", spec: "5톤 / 시간 (3set)" },
                  { name: "배합기 / 포장기", spec: "자동화 라인" },
                  { name: "AL 습식 분석기", spec: "정밀 성분 분석" },
                  { name: "MUFFUL FURNACE", spec: "고온 열처리 검사" },
                  { name: "실체 현미경", spec: "조직 및 입도 분석" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="text-brand font-bold mb-1">{item.name}</div>
                    <div className="text-slate-500 text-sm">{item.spec}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading title="생산 공정도" subtitle="DROSS 선별부터 최종 포장까지, 체계적인 공정 관리를 실천합니다." />
              
              <div className="relative p-8 bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
                <div className="flex flex-col gap-6 relative z-10">
                  {/* Main Flow */}
                  <div className="flex justify-center">
                    <div className="bg-brand text-white px-6 py-2 rounded-lg font-bold shadow-sm">DROSS 입고</div>
                  </div>
                  <div className="flex justify-center"><ChevronRight className="rotate-90 text-slate-300" /></div>
                  <div className="flex justify-center">
                    <div className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold shadow-sm">검사 및 선별</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mt-4">
                    {/* Powder Path */}
                    <div className="flex flex-col space-y-4">
                      <div className="text-center font-black text-brand text-xs tracking-widest uppercase">POWDER PATH</div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-center text-sm font-bold shadow-sm">POWDER 분석</div>
                      <div className="flex justify-center"><ChevronRight className="rotate-90 text-slate-300" /></div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-center text-sm font-bold shadow-sm">제강용 부자재 원료</div>
                      <div className="flex justify-center"><ChevronRight className="rotate-90 text-slate-300" /></div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-slate-200 p-2 rounded text-sm font-bold text-center">배합</div>
                        <div className="bg-slate-200 p-2 rounded text-sm font-bold text-center">Briquette</div>
                        <div className="bg-slate-200 p-2 rounded text-sm font-bold text-center">지대</div>
                      </div>
                      <div className="flex justify-center"><ChevronRight className="rotate-90 text-slate-300" /></div>
                      <div className="mt-auto bg-brand/10 p-3 rounded-xl border border-brand/20 text-center text-sm font-bold text-brand h-[60px] flex items-center justify-center">
                        슬라그조재제 / 레들보온제
                      </div>
                    </div>

                    {/* Muguri Path */}
                    <div className="flex flex-col space-y-4">
                      <div className="text-center font-black text-brand text-xs tracking-widest uppercase">MUGURI PATH</div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-center text-sm font-bold shadow-sm">무거리 파쇄</div>
                      <div className="flex justify-center"><ChevronRight className="rotate-90 text-slate-300" /></div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-center text-sm font-bold shadow-sm">화림 밀 (AL-BIT)</div>
                      <div className="flex justify-center"><ChevronRight className="rotate-90 text-slate-300" /></div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-center text-sm font-bold shadow-sm">ALSITE-DROP 원료</div>
                      <div className="flex justify-center"><ChevronRight className="rotate-90 text-slate-300" /></div>
                      <div className="mt-auto bg-brand/10 p-3 rounded-xl border border-brand/20 text-center text-sm font-bold text-brand h-[60px] flex items-center justify-center">
                        제강용 조재제 / 용해 원료
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients (Page 14) */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-slate-400 font-bold tracking-widest uppercase text-sm mb-12">주요 거래처</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-y-16 md:gap-x-20 opacity-60 grayscale hover:grayscale-0 transition-all max-w-4xl mx-auto">
            {["현대제철", "포스코엠텍", "세아베스틸", "동국제강", "한국철강", "한주금속"].map((client) => (
              <div key={client} className="flex items-center justify-center">
                <span className="text-xl md:text-3xl font-black text-slate-400">{client}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications (Page 17-19) */}
      <section id="certifications" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="인증 및 특허 현황" subtitle="품질 경영 시스템과 독자적인 기술력을 공식적으로 인정받았습니다." />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              { title: "ISO 9001", desc: "품질경영시스템 인증", img: certIso9001 },
              { title: "INNO-BIZ", desc: "기술혁신형 중소기업", img: certInnoBiz },
              { title: "벤처기업", desc: "중소기업청 선정", img: "cert-venture" },
              { title: "유망중소기업", desc: "한국기계연구원 선정", img: "cert-promising" },
              { title: "특허 제0338465호", desc: "금속 슬러지 분쇄장치", img: patent0338465 },
              { title: "특허 제0517524호", desc: "탈산제 제조방법", img: patent0517524 },
              { title: "특허 제0557004호", desc: "탈황첨가제", img: patent0557004 },
              { title: "특허 제0406492호", desc: "슬래그 환원제", img: patent0406492 }
            ].map((cert, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedCert(cert)}
                className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center hover:bg-brand hover:text-white transition-all duration-300 cursor-pointer"
              >
                <ShieldCheck className="mx-auto mb-4 text-brand group-hover:text-white transition-colors" size={40} />
                <h4 className="font-bold mb-1">{cert.title}</h4>
                <p className="text-xs opacity-70">{cert.desc}</p>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedCert && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCert(null)}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
                >
                  <button 
                    onClick={() => setSelectedCert(null)}
                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10"
                  >
                    <X size={20} />
                  </button>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                        <Award size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedCert.title}</h3>
                        <p className="text-slate-500">{selectedCert.desc}</p>
                      </div>
                    </div>
                    <div className="aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                      <img 
                        src={selectedCert.img.includes('.') || selectedCert.img.startsWith('data:') || selectedCert.img.startsWith('http') ? selectedCert.img : https://picsum.photos/seed/${selectedCert.img}/800/1066} 
                        alt={selectedCert.title} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <p className="mt-6 text-center text-xs text-slate-400">
                      ※ 위 이미지는 샘플이며 실제 인증서 파일로 교체 가능합니다.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-white text-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <SectionHeading 
                title="문의하기" 
                subtitle="제품 상담 및 기술 문의는 아래 연락처로 언제든 연락 주시기 바랍니다." 
              />
              
              <div className="space-y-8 mt-12">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-brand">
                    <MapPin />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">본사 및 공장</h4>
                    <p className="text-slate-600">경상남도 함안군 군북면 유전 1길 31</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-brand">
                    <Phone />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">전화번호</h4>
                    <p className="text-slate-600">055-583-8063 / 055-583-8066</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-brand">
                    <Mail />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">이메일</h4>
                    <p className="text-slate-600">hwarim2@naver.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200">
              <h3 className="text-2xl font-bold mb-8">빠른 문의</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">성함 / 업체명</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors" placeholder="홍길동" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">연락처</label>
                    <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors" placeholder="010-0000-0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">문의 내용</label>
                  <textarea rows={4} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors" placeholder="문의하실 내용을 입력해주세요."></textarea>
                </div>
                <button className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-xl font-bold text-lg transition-all">
                  문의 보내기
                </button>
                <p className="text-center text-xs text-slate-400">
                  * 본 양식은 데모용이며 실제 데이터는 저장되지 않습니다. 이메일로 직접 문의 부탁드립니다.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <Recycle className="w-full h-full text-brand" strokeWidth={2.5} />
              <span className="absolute text-[7px] font-black text-slate-700 mt-0.5">HR</span>
            </div>
            <span className="font-bold text-white tracking-tight">
              (주)화림 <span className="text-xs font-medium opacity-50 ml-1">HWARIM CO., LTD.</span>
            </span>
          </div>
          
          <div className="text-slate-500 text-sm text-center md:text-right">
            <p>© 2026 HWARIM CO., LTD. All Rights Reserved.</p>
            <p className="mt-1">Designed for Excellence in Manufacturing.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
