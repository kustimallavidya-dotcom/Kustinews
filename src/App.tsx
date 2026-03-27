import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Upload, Image as ImageIcon, Type, Layout, RefreshCw, FileText, User, UserCircle, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // State for images
  const [logo, setLogo] = useState<string | null>(null);
  const [articleImage, setArticleImage] = useState<string | null>(null);
  const [authorPhoto, setAuthorPhoto] = useState<string | null>(null);
  
  // State for text content
  const [title, setTitle] = useState('कुस्ती मल्लविद्या');
  const [slogan, setSlogan] = useState('गे मायभु तुझे मी फेडीन पांग सारे, आणिन आरतीला हे चंद्र, सुर्य, तारे');
  const [content, setContent] = useState('येथे तुमचा लेख पेस्ट करा. हा लेख वर्तमानपत्राच्या शैलीत दोन स्तंभांमध्ये आपोआप विभागला जाईल. तुम्ही वरून फोटो देखील अपलोड करू शकता जो लेखाच्या मध्यभागी दिसेल. कुस्ती ही महाराष्ट्राची अस्मिता आहे आणि ती जोपासणे आपले कर्तव्य आहे.');
  
  // State for author details
  const [authorName, setAuthorName] = useState('लेखकाचे नाव');
  const [authorDesignation, setAuthorDesignation] = useState('संपादक / क्रीडा पत्रकार');
  
  const [date, setDate] = useState(new Date().toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
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
    if (!canvasRef.current) return;
    setIsExporting('png');
    
    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 4,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `kusti-mallavidya-${Date.now()}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const exportAsPDF = async () => {
    if (!canvasRef.current) return;
    setIsExporting('pdf');
    
    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 3, canvas.height / 3]
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`kusti-mallavidya-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-mukta">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4 space-y-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 h-fit lg:sticky lg:top-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layout className="text-red-800" size={24} />
              <h2 className="text-xl font-bold text-gray-800">डॅशबोर्ड</h2>
            </div>
            <div className="px-3 py-1 bg-red-50 text-red-800 text-xs font-bold rounded-full">PRO EDITOR</div>
          </div>

          <div className="space-y-5">
            {/* Image Uploads Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">लोगो</label>
                <div className="relative h-24 border-2 border-dashed border-gray-200 rounded-xl hover:border-red-800 transition-colors flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setLogo)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {logo ? <img src={logo} className="w-full h-full object-contain" /> : <Upload size={20} className="text-gray-400" />}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">लेखक फोटो</label>
                <div className="relative h-24 border-2 border-dashed border-gray-200 rounded-xl hover:border-red-800 transition-colors flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAuthorPhoto)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {authorPhoto ? <img src={authorPhoto} className="w-full h-full object-cover" /> : <User size={20} className="text-gray-400" />}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">लेखाचा मुख्य फोटो</label>
              <div className="relative h-32 border-2 border-dashed border-gray-200 rounded-xl hover:border-red-800 transition-colors flex flex-col items-center justify-center bg-gray-50 overflow-hidden">
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setArticleImage)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                {articleImage ? <img src={articleImage} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-gray-400" />}
              </div>
            </div>

            {/* Author Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">लेखकाचे नाव</label>
                <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">लेखकाचे पद</label>
                <input type="text" value={authorDesignation} onChange={(e) => setAuthorDesignation(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">घोषवाक्य</label>
              <input type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">लेख / मजकूर</label>
              <textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring text-sm resize-none" />
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              <button onClick={exportAsImage} disabled={!!isExporting} className={`w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${isExporting === 'png' ? 'bg-gray-400' : 'bg-red-800 hover:bg-red-900 active:scale-95'}`}>
                {isExporting === 'png' ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                HD PNG डाउनलोड करा
              </button>
              <button onClick={exportAsPDF} disabled={!!isExporting} className={`w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${isExporting === 'pdf' ? 'bg-gray-400' : 'bg-gray-800 hover:bg-black active:scale-95'}`}>
                {isExporting === 'pdf' ? <RefreshCw className="animate-spin" size={18} /> : <FileText size={18} />}
                PDF डाउनलोड करा
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Panel: Preview Canvas */}
        <div className="lg:col-span-8 flex justify-center overflow-x-auto pb-12">
          <div className="scale-[0.4] md:scale-[0.6] lg:scale-[0.8] xl:scale-100 origin-top transition-transform">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              ref={canvasRef}
              className="w-[1080px] min-h-[1350px] bg-white shadow-2xl p-14 flex flex-col border-[16px] border-double border-gray-200 relative overflow-hidden"
              style={{ minWidth: '1080px' }}
            >
              {/* Header Section */}
              <header className="flex items-start gap-10 mb-10 pb-8 border-b-[6px] border-double border-red-800">
                {/* Logo Area */}
                <div className="w-36 h-36 border-[3px] border-red-800 flex-shrink-0 flex items-center justify-center overflow-hidden bg-white shadow-sm">
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="text-red-800 font-bold text-center p-2 text-xs">लोगो</div>
                  )}
                </div>

                {/* Title Area */}
                <div className="flex-grow text-center">
                  <div className="relative inline-block">
                    <h1 className="creative-title text-9xl font-bold leading-none mb-4 tracking-tighter">
                      {title}
                    </h1>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-red-800 opacity-20"></div>
                  </div>
                  <p className="font-tiro text-3xl font-medium text-gray-700 italic mt-4">
                    "{slogan}"
                  </p>
                </div>

                {/* Date Area */}
                <div className="w-36 text-right flex flex-col justify-end h-36">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] border-t-2 border-gray-200 pt-2 mb-1">
                    दिनांक
                  </div>
                  <div className="text-xl font-bold text-red-800">
                    {date}
                  </div>
                </div>
              </header>

              {/* Content Section */}
              <main className="flex-grow">
                <div className="newspaper-columns text-2xl leading-[1.7] text-gray-900 drop-cap">
                  <AnimatePresence mode="wait">
                    {articleImage && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 float-left w-[55%] pr-8 pt-2"
                      >
                        <div className="p-2 bg-gray-50 border border-gray-200 shadow-sm">
                          <img src={articleImage} alt="Article" className="w-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <p className="text-sm text-gray-500 mt-2 font-bold italic text-center border-b border-gray-100 pb-1">छायाचित्र: कुस्ती मल्लविद्या</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="whitespace-pre-wrap">
                    {content}
                  </div>
                </div>

                {/* Author Credit Section */}
                <div className="mt-12 flex justify-end">
                  <div className="author-card flex items-center gap-4 p-4 pr-8 rounded-r-xl shadow-sm min-w-[350px]">
                    <div className="w-20 h-20 rounded-full border-2 border-red-800 overflow-hidden bg-gray-100 flex-shrink-0">
                      {authorPhoto ? (
                        <img src={authorPhoto} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <UserCircle className="w-full h-full text-gray-300" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-red-800 font-bold text-sm uppercase tracking-widest mb-1">
                        <PenTool size={14} /> लेखक
                      </div>
                      <div className="text-2xl font-bold text-gray-900 leading-tight">{authorName}</div>
                      <div className="text-sm text-gray-600 font-medium">{authorDesignation}</div>
                    </div>
                  </div>
                </div>
              </main>

              {/* Footer Section */}
              <footer className="mt-16 pt-6 border-t-2 border-gray-200 flex justify-between items-end text-gray-400">
                <div className="flex flex-col gap-1">
                  <div className="font-bold text-gray-500 text-lg">© कुस्ती मल्लविद्या</div>
                  <div className="text-sm">महाराष्ट्राची अस्मिता, कुस्तीची परंपरा</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold uppercase tracking-widest text-red-800 opacity-50 mb-1">डिजिटल आवृत्ती</div>
                  <div className="text-xs font-medium">www.kustimallavidya.org</div>
                </div>
              </footer>

              {/* Texture Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
