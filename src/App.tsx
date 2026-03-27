import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Upload, Image as ImageIcon, Type, Layout, RefreshCw, FileText, User, UserCircle, PenTool, Calendar } from 'lucide-react';
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

  // Dynamic content styling logic
  const getContentStyles = () => {
    const len = content.length;
    // More granular scaling for very long text
    if (len < 500) return { fontSize: '38px', columnCount: 1, lineHeight: '1.6' };
    if (len < 1200) return { fontSize: '30px', columnCount: 2, lineHeight: '1.6' };
    if (len < 2500) return { fontSize: '24px', columnCount: 2, lineHeight: '1.7' };
    if (len < 4500) return { fontSize: '19px', columnCount: 3, lineHeight: '1.7' };
    if (len < 7000) return { fontSize: '16px', columnCount: 3, lineHeight: '1.6' };
    if (len < 10000) return { fontSize: '13px', columnCount: 4, lineHeight: '1.5' };
    if (len < 13000) return { fontSize: '11px', columnCount: 4, lineHeight: '1.4' };
    return { fontSize: '10px', columnCount: 5, lineHeight: '1.3' };
  };

  const getTitleFontSize = (text: string) => {
    const len = text.length;
    if (len < 15) return '80px';
    if (len < 25) return '65px';
    if (len < 40) return '50px';
    return '40px';
  };

  const getAuthorNameStyles = (text: string) => {
    const len = text.length;
    if (len < 12) return { fontSize: 'text-4xl', photoSize: 'w-28 h-28' };
    if (len < 20) return { fontSize: 'text-3xl', photoSize: 'w-24 h-24' };
    return { fontSize: 'text-2xl', photoSize: 'w-20 h-20' };
  };

  const dynamicStyles = getContentStyles();
  const titleFontSize = getTitleFontSize(title);
  const authorStyles = getAuthorNameStyles(authorName);

  const [isExporting, setIsExporting] = useState<'png' | 'pdf' | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Function to split text into N roughly equal parts for manual columns
  const getSplitContent = (text: string, numCols: number) => {
    if (numCols <= 1) return [[text]];
    
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    const totalChars = text.length;
    const targetPerCol = totalChars / numCols;
    
    const columns: string[][] = Array.from({ length: numCols }, () => []);
    let currentCol = 0;
    let currentChars = 0;
    
    paragraphs.forEach(p => {
      // Improved splitting logic to prevent large gaps
      if (currentCol < numCols - 1 && currentChars > targetPerCol * (currentCol + 0.9)) {
        currentCol++;
      }
      columns[currentCol].push(p);
      currentChars += p.length;
    });
    
    return columns;
  };

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
    const element = canvasRef.current;
    if (!element) {
      alert('कॅनव्हास सापडला नाही. कृपया पेज रिफ्रेश करा.');
      return;
    }
    setIsExporting('png');
    
    try {
      // Ensure we are at the top for capture
      window.scrollTo(0, 0);
      // Wait for fonts to be ready
      if (document.fonts) {
        await document.fonts.ready;
      }
      // Give more time for images and fonts to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#fffdfa',
        logging: false,
        imageTimeout: 30000,
        width: 1080,
        height: 1920,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1080,
        windowHeight: 1920,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('newspaper-canvas-export');
          if (el) {
            el.style.transform = 'none';
            el.style.position = 'absolute';
            el.style.left = '0';
            el.style.top = '0';
            el.style.margin = '0';
            el.style.boxShadow = 'none';
            el.style.border = '4px solid #000000';
            
            // Fix for potential overlap in cloned version
            const header = el.querySelector('header');
            if (header) header.style.marginBottom = '30px';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `kusti-mallavidya-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error: any) {
      console.error('Export failed:', error);
      alert(`इमेज डाउनलोड करताना त्रुटी आली: ${error?.message || 'तांत्रिक अडचण'}. कृपया पुन्हा प्रयत्न करा.`);
    } finally {
      setIsExporting(null);
    }
  };

  const exportAsPDF = async () => {
    const element = canvasRef.current;
    if (!element) {
      alert('कॅनव्हास सापडला नाही.');
      return;
    }
    setIsExporting('pdf');
    
    try {
      window.scrollTo(0, 0);
      // Wait for fonts to be ready
      if (document.fonts) {
        await document.fonts.ready;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#fffdfa',
        logging: false,
        width: 1080,
        height: 1920,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1080,
        windowHeight: 1920,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('newspaper-canvas-export');
          if (el) {
            el.style.transform = 'none';
            el.style.position = 'absolute';
            el.style.left = '0';
            el.style.top = '0';
            el.style.margin = '0';
            el.style.boxShadow = 'none';
            el.style.border = '4px solid #000000';
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
    } catch (error: any) {
      console.error('PDF Export failed:', error);
      alert(`PDF डाउनलोड करताना त्रुटी आली: ${error?.message || 'तांत्रिक अडचण'}.`);
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
              <Layout className="text-black" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">संपादक पॅनेल</h2>
            </div>
            <div className="px-3 py-1 bg-black text-white text-[10px] font-black rounded-md tracking-tighter">9:16 HD</div>
          </div>

          <div className="space-y-6">
            {/* Image Uploads */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">लोगो (PNG)</label>
                <div className="relative h-28 border-2 border-dashed border-gray-200 rounded-xl hover:border-black transition-all flex flex-col items-center justify-center bg-gray-50 overflow-hidden group">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setLogo)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {logo ? <img src={logo} className="w-full h-full object-contain p-2" /> : <Upload size={24} className="text-gray-300 group-hover:text-black" />}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">लेखक फोटो</label>
                <div className="relative h-28 border-2 border-dashed border-gray-200 rounded-xl hover:border-black transition-all flex flex-col items-center justify-center bg-gray-50 overflow-hidden group">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAuthorPhoto)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {authorPhoto ? <img src={authorPhoto} className="w-full h-full object-cover" /> : <User size={24} className="text-gray-300 group-hover:text-black" />}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">बातमीचे मुख्य चित्र</label>
              <div className="relative h-40 border-2 border-dashed border-gray-200 rounded-xl hover:border-black transition-all flex flex-col items-center justify-center bg-gray-50 overflow-hidden group">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setArticleImage)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                {articleImage ? <img src={articleImage} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-gray-300 group-hover:text-black" />}
              </div>
            </div>

            {/* Panchang / Date Section */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center gap-2 text-black font-bold text-sm">
                <Calendar size={18} /> दिनांक व पंचांग विभाग
              </div>
              <div className="grid grid-cols-1 gap-3">
                <input type="text" placeholder="दिनांक" value={dateText} onChange={(e) => setDateText(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
                <input type="text" placeholder="तिथी / माहिती" value={tithi} onChange={(e) => setTithi(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
                <input type="text" placeholder="पंचांग (पर्यायी)" value={panchang} onChange={(e) => setPanchang(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
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
              <button onClick={exportAsImage} disabled={!!isExporting} className={`w-full py-4 rounded-2xl font-black text-white flex flex-col items-center justify-center gap-1 transition-all shadow-xl ${isExporting === 'png' ? 'bg-gray-400' : 'bg-black hover:bg-gray-900 active:scale-95'}`}>
                <div className="flex items-center gap-3">
                  {isExporting === 'png' ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
                  STATUS इमेज डाउनलोड करा (PNG)
                </div>
                {isExporting === 'png' && <span className="text-[10px] font-bold opacity-80 animate-pulse">कृपया थोडा वेळ थांबा...</span>}
              </button>
              <button onClick={exportAsPDF} disabled={!!isExporting} className={`w-full py-4 rounded-2xl font-black text-white flex flex-col items-center justify-center gap-1 transition-all shadow-xl ${isExporting === 'pdf' ? 'bg-gray-400' : 'bg-gray-800 hover:bg-black active:scale-95'}`}>
                <div className="flex items-center gap-3">
                  {isExporting === 'pdf' ? <RefreshCw className="animate-spin" size={20} /> : <FileText size={20} />}
                  PDF डाउनलोड करा
                </div>
                {isExporting === 'pdf' && <span className="text-[10px] font-bold opacity-80 animate-pulse">कृपया थोडा वेळ थांबा...</span>}
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
              <header className="mb-8 pb-6 border-b-4 border-black">
                <div className="grid grid-cols-[180px_1fr_220px] items-center gap-4">
                  {/* Logo Area */}
                  <div className="flex items-center justify-start">
                    {logo ? (
                      <img src={logo} alt="Logo" className="max-w-[150px] max-h-[150px] object-contain" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-32 h-32 text-[#8b0000] font-black text-center text-lg border-4 border-[#8b0000] flex items-center justify-center p-2">लोगो</div>
                    )}
                  </div>

                  {/* Masthead Center */}
                  <div className="text-center overflow-hidden px-2">
                    <h1 
                      className="creative-title-main whitespace-nowrap"
                      style={{ fontSize: titleFontSize }}
                    >
                      {title}
                    </h1>
                    <div className="slogan-text">
                      {slogan}
                    </div>
                  </div>

                  {/* Date Section */}
                  <div className="text-right">
                    <div className="panchang-section inline-block py-2">
                      <div className="font-black text-[#b45309] text-3xl mb-1">{dateText}</div>
                      <div className="font-bold text-[#1e3a8a] text-xl">{tithi}</div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Content Section */}
              <main className="flex-grow flex flex-col overflow-hidden">
                <div 
                  className="flex gap-8 mb-6 h-[1300px] overflow-hidden"
                  style={{ 
                    fontSize: dynamicStyles.fontSize, 
                    lineHeight: dynamicStyles.lineHeight
                  }}
                >
                  {getSplitContent(content, dynamicStyles.columnCount).map((colParagraphs, colIdx) => (
                    <div key={colIdx} className="flex-1 text-justify text-[#1a1a1a] relative overflow-hidden">
                      {/* Floating Article Image in the first column if it exists */}
                      {colIdx === 0 && articleImage && (
                        <div className="mb-6 w-full">
                          <div className="p-3 bg-white border-2 border-gray-100 shadow-xl">
                            <img src={articleImage} alt="Article" className="w-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex items-center gap-2 mt-3 text-gray-400 font-bold italic text-sm border-b border-gray-100 pb-2">
                            <ImageIcon size={14} /> छायाचित्र: कुस्ती मल्लविद्या
                          </div>
                        </div>
                      )}
                      
                      <div className="whitespace-pre-wrap">
                        {colParagraphs.map((p, pIdx) => (
                          <p key={pIdx} className={`${colIdx === 0 && pIdx === 0 ? 'drop-cap' : ''} mb-4`}>
                            {p}
                          </p>
                        ))}
                      </div>
                      
                      {/* Column divider line except for the last column */}
                      {colIdx < dynamicStyles.columnCount - 1 && (
                        <div className="absolute top-0 -right-4 w-[1px] h-full bg-black/10" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Author Credit Section */}
                <div className="mt-auto pt-6 flex justify-end">
                  <div className="author-card-premium flex items-center gap-4 min-w-[350px] max-w-[600px] shadow-sm">
                    <div className={`${authorStyles.photoSize} rounded-full border-4 border-black overflow-hidden bg-white shadow-lg flex-shrink-0 transition-all duration-300`}>
                      {authorPhoto ? (
                        <img src={authorPhoto} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <UserCircle className="w-full h-full text-gray-200" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2 text-black font-black text-xs uppercase tracking-[0.2em] mb-1">
                        <PenTool size={14} /> विशेष लेख
                      </div>
                      <div className={`${authorStyles.fontSize} font-black text-gray-900 leading-tight mb-1 truncate`}>{authorName}</div>
                      <div className="text-lg text-gray-600 font-bold truncate">{authorDesignation}</div>
                    </div>
                  </div>
                </div>
              </main>

              {/* Footer Section */}
              <footer className="mt-auto pt-10 border-t-2 border-black flex justify-between items-end">
                <div className="flex flex-col gap-2">
                  <div className="font-black text-[#8b0000] text-4xl tracking-tighter">कुस्ती मल्लविद्या</div>
                  <div className="text-xl font-bold text-gray-500 italic">महाराष्ट्राची अस्मिता, कुस्तीची परंपरा</div>
                </div>
                <div className="text-right space-y-2">
                  <div className="inline-block px-4 py-1 bg-[#8b0000] text-white text-sm font-black uppercase tracking-widest rounded-full">डिजिटल आवृत्ती</div>
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
