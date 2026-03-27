import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Upload, Image as ImageIcon, Type, Layout, RefreshCw, FileText, User, UserCircle, PenTool, Calendar, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // State for images
  const [logo, setLogo] = useState<string | null>(null);
  const [articleImage, setArticleImage] = useState<string | null>(null);
  const [authorPhoto, setAuthorPhoto] = useState<string | null>(null);
  
  // State for text content
  const [title, setTitle] = useState('कुस्ती मल्लविद्या');
  const [slogan, setSlogan] = useState('महाराष्ट्राची अस्मिता, कुस्तीची परंपरा');
  const [content, setContent] = useState('येथे तुमचा लेख पेस्ट करा. हा लेख वर्तमानपत्राच्या शैलीत दोन स्तंभांमध्ये आपोआप विभागला जाईल. तुम्ही वरून फोटो देखील अपलोड करू शकता जो लेखाच्या मध्यभागी दिसेल. कुस्ती ही महाराष्ट्राची अस्मिता आहे आणि ती जोपासणे आपले कर्तव्य आहे.');
  
  // State for author details
  const [authorName, setAuthorName] = useState('लेखकाचे नाव');
  const [authorDesignation, setAuthorDesignation] = useState('संपादक / क्रीडा पत्रकार');
  
  // State for Panchang/Date section
  const [dateText, setDateText] = useState(new Date().toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [tithi, setTithi] = useState('शुक्ल पक्ष, एकादशी');
  const [panchang, setPanchang] = useState('पंचांग: शुभ मुहूर्त');
  const [suvichar, setSuvichar] = useState('सुविचार: कष्टाशिवाय फळ नाही.');

  const [isExporting, setIsExporting] = useState<'png' | 'pdf' | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setter(readerEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportAsImage = async () => {
    const element = document.getElementById('newspaper-canvas-export');
    if (!element) return;
    setIsExporting('png');
    
    try {
      // Ensure element is fully rendered
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const canvas = await html2canvas(element, {
        scale: 2, // 2 is enough for 1080x1920 to be crisp
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 1080,
        height: 1920,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('newspaper-canvas-export');
          if (el) {
            el.style.transform = 'none';
            el.style.position = 'static';
            el.style.display = 'flex';
            el.style.margin = '0';
          }
        }
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `kusti-mallavidya-${Date.now()}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('इमेज डाउनलोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsExporting(null);
    }
  };

  const exportAsPDF = async () => {
    const element = document.getElementById('newspaper-canvas-export');
    if (!element) return;
    setIsExporting('pdf');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 1080,
        height: 1920,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('newspaper-canvas-export');
          if (el) {
            el.style.transform = 'none';
            el.style.position = 'static';
            el.style.display = 'flex';
            el.style.margin = '0';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1080, 1920]
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1920);
      pdf.save(`kusti-mallavidya-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
      alert('PDF डाउनलोड करताना त्रुटी आली.');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-mukta">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">
        
        {/* Left Panel: Controls */}
        <div className="lg:col-span-4 p-4 md:p-8 space-y-6 bg-white shadow-xl border-r border-gray-200 h-screen overflow-y-auto no-scrollbar lg:sticky lg:top-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layout className="text-red-800" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">संपादक पॅनेल</h2>
            </div>
            <div className="px-3 py-1 bg-red-800 text-white text-[10px] font-black rounded-md tracking-tighter">9:16 HD</div>
          </div>

          <div className="space-y-6">
            {/* Image Uploads */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">लोगो (PNG)</label>
                <div className="relative h-28 border-2 border-dashed border-gray-200 rounded-xl hover:border-red-800 transition-all flex flex-col items-center justify-center bg-gray-50 overflow-hidden group">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setLogo)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {logo ? <img src={logo} className="w-full h-full object-contain p-2" /> : <Upload size={24} className="text-gray-300 group-hover:text-red-800" />}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">लेखक फोटो</label>
                <div className="relative h-28 border-2 border-dashed border-gray-200 rounded-xl hover:border-red-800 transition-all flex flex-col items-center justify-center bg-gray-50 overflow-hidden group">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAuthorPhoto)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {authorPhoto ? <img src={authorPhoto} className="w-full h-full object-cover" /> : <User size={24} className="text-gray-300 group-hover:text-red-800" />}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">बातमीचे मुख्य चित्र</label>
              <div className="relative h-40 border-2 border-dashed border-gray-200 rounded-xl hover:border-red-800 transition-all flex flex-col items-center justify-center bg-gray-50 overflow-hidden group">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setArticleImage)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                {articleImage ? <img src={articleImage} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-gray-300 group-hover:text-red-800" />}
              </div>
            </div>

            {/* Panchang / Date Section */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                <Calendar size={18} /> दिनांक व पंचांग विभाग
              </div>
              <div className="grid grid-cols-1 gap-3">
                <input type="text" placeholder="दिनांक" value={dateText} onChange={(e) => setDateText(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
                <input type="text" placeholder="तिथी" value={tithi} onChange={(e) => setTithi(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
                <input type="text" placeholder="पंचांग" value={panchang} onChange={(e) => setPanchang(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
                <input type="text" placeholder="सुविचार" value={suvichar} onChange={(e) => setSuvichar(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
              </div>
            </div>

            {/* Author Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase">लेखक नाव</label>
                <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase">लेखक पद</label>
                <input type="text" value={authorDesignation} onChange={(e) => setAuthorDesignation(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase">मुख्य शीर्षक</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase">स्लोगन</label>
              <input type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase">बातमी / लेख</label>
              <textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm resize-none" />
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-4">
              <button onClick={exportAsImage} disabled={!!isExporting} className={`w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all shadow-xl ${isExporting === 'png' ? 'bg-gray-400' : 'bg-red-800 hover:bg-red-900 active:scale-95'}`}>
                {isExporting === 'png' ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
                STATUS इमेज डाउनलोड करा (PNG)
              </button>
              <button onClick={exportAsPDF} disabled={!!isExporting} className={`w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all shadow-xl ${isExporting === 'pdf' ? 'bg-gray-400' : 'bg-gray-800 hover:bg-black active:scale-95'}`}>
                {isExporting === 'pdf' ? <RefreshCw className="animate-spin" size={20} /> : <FileText size={20} />}
                PDF डाउनलोड करा
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Preview Canvas */}
        <div className="lg:col-span-8 canvas-container min-h-screen">
          <div className="scale-[0.25] sm:scale-[0.35] md:scale-[0.45] lg:scale-[0.4] xl:scale-[0.5] 2xl:scale-[0.6] origin-top transition-all duration-500">
            <div 
              ref={canvasRef}
              id="newspaper-canvas-export"
              className="newspaper-canvas-9-16"
            >
              {/* Header Section */}
              <header className="flex items-center justify-between mb-12 pb-10 border-b-[12px] border-double border-red-800">
                {/* Logo Area */}
                <div className="w-56 h-56 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {logo ? (
                    <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-red-800 font-black text-center text-2xl border-4 border-red-800 p-4">लोगो</div>
                  )}
                </div>

                {/* Title Area */}
                <div className="flex-grow text-center px-10">
                  <h1 className="creative-title-main">
                    {title}
                  </h1>
                  <div className="slogan-text">
                    {slogan}
                  </div>
                </div>

                {/* Panchang Section */}
                <div className="w-72 flex-shrink-0">
                  <div className="panchang-section">
                    <div className="font-black text-red-800 text-3xl mb-1">{dateText}</div>
                    <div className="font-bold text-gray-600 text-xl">{tithi}</div>
                    <div className="text-gray-500 text-lg italic mb-3">{panchang}</div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 shadow-sm">
                      <div className="flex items-center gap-2 text-red-800 font-black text-xs uppercase mb-1">
                        <Quote size={12} /> सुविचार
                      </div>
                      <div className="text-gray-700 text-base font-medium leading-relaxed">
                        {suvichar}
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Content Section */}
              <main className="flex-grow">
                <div className="newspaper-columns drop-cap">
                  {articleImage && (
                    <div className="mb-8 float-left w-[60%] pr-10 pt-2">
                      <div className="p-3 bg-white border-2 border-gray-100 shadow-xl">
                        <img src={articleImage} alt="Article" className="w-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-gray-400 font-bold italic text-sm border-b border-gray-100 pb-2">
                        <ImageIcon size={14} /> छायाचित्र: कुस्ती मल्लविद्या
                      </div>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {content}
                  </div>
                </div>

                {/* Author Credit Section */}
                <div className="mt-20 flex justify-end">
                  <div className="author-card-premium flex items-center gap-6 min-w-[450px] shadow-sm">
                    <div className="w-28 h-28 rounded-full border-4 border-red-800 overflow-hidden bg-white shadow-lg flex-shrink-0">
                      {authorPhoto ? (
                        <img src={authorPhoto} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <UserCircle className="w-full h-full text-gray-200" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-red-800 font-black text-sm uppercase tracking-[0.2em] mb-2">
                        <PenTool size={16} /> विशेष लेख
                      </div>
                      <div className="text-4xl font-black text-gray-900 leading-tight mb-1">{authorName}</div>
                      <div className="text-xl text-gray-600 font-bold">{authorDesignation}</div>
                    </div>
                  </div>
                </div>
              </main>

              {/* Footer Section */}
              <footer className="mt-20 pt-10 border-t-[4px] border-gray-100 flex justify-between items-end">
                <div className="flex flex-col gap-2">
                  <div className="font-black text-red-800 text-4xl tracking-tighter">कुस्ती मल्लविद्या</div>
                  <div className="text-xl font-bold text-gray-400 italic">महाराष्ट्राची अस्मिता, कुस्तीची परंपरा</div>
                </div>
                <div className="text-right space-y-2">
                  <div className="inline-block px-4 py-1 bg-red-800 text-white text-sm font-black uppercase tracking-widest rounded-full">डिजिटल आवृत्ती</div>
                  <div className="text-lg font-bold text-gray-400">www.kustimallavidya.org</div>
                </div>
              </footer>

              {/* Texture Overlay */}
              <div className="paper-texture"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
