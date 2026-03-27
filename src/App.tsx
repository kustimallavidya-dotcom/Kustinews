import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Upload, Image as ImageIcon, Type, Layout, RefreshCw, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [logo, setLogo] = useState<string | null>(null);
  const [articleImage, setArticleImage] = useState<string | null>(null);
  const [title, setTitle] = useState('कुस्ती मल्लविद्या');
  const [slogan, setSlogan] = useState('गे मायभु तुझे मी फेडीन पांग सारे, आणिन आरतीला हे चंद्र, सुर्य, तारे');
  const [content, setContent] = useState('येथे तुमचा लेख पेस्ट करा. हा लेख वर्तमानपत्राच्या शैलीत दोन स्तंभांमध्ये आपोआप विभागला जाईल. तुम्ही वरून फोटो देखील अपलोड करू शकता जो लेखाच्या मध्यभागी दिसेल.');
  const [date, setDate] = useState(new Date().toLocaleDateString('mr-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [isExporting, setIsExporting] = useState<'png' | 'pdf' | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setLogo(readerEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArticleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setArticleImage(readerEvent.target?.result as string);
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
        scale: 3, // Slightly lower scale for PDF to keep file size manageable
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 3, canvas.height / 3] // Adjust to original size
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-mukta">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Controls */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit sticky top-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Layout className="text-red-800" size={24} />
            <h2 className="text-xl font-bold text-gray-800">डॅशबोर्ड</h2>
          </div>

          <div className="space-y-4">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon size={16} /> लोगो अपलोड करा
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-gray-300 group-hover:border-red-800 rounded-xl p-4 transition-colors flex flex-col items-center justify-center bg-gray-50">
                  <Upload className="text-gray-400 group-hover:text-red-800 mb-2" size={24} />
                  <span className="text-xs text-gray-500">PNG/JPG निवडा</span>
                </div>
              </div>
            </div>

            {/* Article Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon size={16} /> लेखाचा फोटो
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleArticleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-gray-300 group-hover:border-red-800 rounded-xl p-4 transition-colors flex flex-col items-center justify-center bg-gray-50">
                  <Upload className="text-gray-400 group-hover:text-red-800 mb-2" size={24} />
                  <span className="text-xs text-gray-500">मुलाखत किंवा लेखाचा फोटो</span>
                </div>
              </div>
            </div>

            {/* Slogan Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Type size={16} /> घोषवाक्य (Slogan)
              </label>
              <input 
                type="text" 
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Type size={16} /> लेख / मजकूर
              </label>
              <textarea 
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none transition-all resize-none"
                placeholder="येथे तुमचा लेख पेस्ट करा..."
              />
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={exportAsImage}
                disabled={!!isExporting}
                className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${isExporting === 'png' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-800 hover:bg-red-900 active:scale-95'}`}
              >
                {isExporting === 'png' ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    PNG तयार होत आहे...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    HD इमेज (PNG)
                  </>
                )}
              </button>
              
              <button 
                onClick={exportAsPDF}
                disabled={!!isExporting}
                className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${isExporting === 'pdf' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-black active:scale-95'}`}
              >
                {isExporting === 'pdf' ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    PDF तयार होत आहे...
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    PDF डाउनलोड करा
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[10px] text-center text-gray-400 italic">
              टीप: व्हॉट्सअ‍ॅप स्टेटससाठी PNG सर्वोत्तम आहे.
            </p>
          </div>
        </motion.div>

        {/* Right Panel: Preview Canvas */}
        <div className="lg:col-span-8 flex justify-center overflow-x-auto pb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            ref={canvasRef}
            id="newspaper-canvas"
            className="w-[1080px] min-h-[1350px] bg-white shadow-2xl p-12 flex flex-col border-[12px] border-double border-gray-200 relative overflow-hidden"
            style={{ minWidth: '1080px' }}
          >
            {/* Header Section */}
            <header className="flex items-start gap-8 mb-8 pb-6 border-b-4 border-double border-red-800">
              {/* Logo Area */}
              <div className="w-32 h-32 border-2 border-red-800 flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-50">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-red-800 font-bold text-center p-2 text-xs">लोगो येथे दिसेल</div>
                )}
              </div>

              {/* Title Area */}
              <div className="flex-grow text-center">
                <h1 className="font-tiro text-8xl font-bold text-red-800 leading-tight mb-2 tracking-tight">
                  {title}
                </h1>
                <p className="font-tiro text-2xl font-medium text-gray-800 italic">
                  "{slogan}"
                </p>
              </div>

              {/* Date Area */}
              <div className="w-32 text-right flex flex-col justify-end h-32">
                <div className="text-sm font-bold text-gray-600 uppercase tracking-widest border-t border-gray-400 pt-1">
                  दिनांक
                </div>
                <div className="text-lg font-bold text-red-800">
                  {date}
                </div>
              </div>
            </header>

            {/* Content Section */}
            <main className="flex-grow">
              <div className="newspaper-columns text-xl leading-relaxed text-gray-900 drop-cap">
                <AnimatePresence mode="wait">
                  {articleImage && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mb-4 float-left w-1/2 pr-4 pt-2"
                    >
                      <img 
                        src={articleImage} 
                        alt="Article" 
                        className="w-full rounded-sm shadow-md border border-gray-300" 
                        referrerPolicy="no-referrer"
                      />
                      <p className="text-xs text-gray-500 mt-1 italic text-center">छायाचित्र: कुस्ती मल्लविद्या</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="whitespace-pre-wrap">
                  {content}
                </div>
              </div>
            </main>

            {/* Footer Section */}
            <footer className="mt-12 pt-4 border-t border-gray-300 flex justify-between items-center text-gray-500 text-sm italic">
              <div>© कुस्ती मल्लविद्या - सर्व हक्क राखीव</div>
              <div>डिजिटल आवृत्ती | www.kustimallavidya.org</div>
            </footer>

            {/* Texture Overlay (Subtle newspaper feel) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
