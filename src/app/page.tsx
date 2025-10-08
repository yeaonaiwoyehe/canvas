"use client";

import { useState, useEffect } from "react";
import CanvasBoard from "@/components/CanvasBoard";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);

  // Handle responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.8;
      
      let newWidth = 800;
      let newHeight = 600;
      
      // Adjust aspect ratio if needed
      if (maxWidth < newWidth) {
        const ratio = maxWidth / newWidth;
        newWidth = maxWidth;
        newHeight = 600 * ratio;
      }
      
      if (maxHeight < newHeight) {
        const ratio = maxHeight / newHeight;
        newHeight = maxHeight;
        newWidth = 800 * ratio;
      }
      
      setCanvasSize({ width: newWidth, height: newHeight });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Export functionality
  const exportCanvas = (format: string) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `canvas.${format}`;
    
    if (format === 'jpeg') {
      format = 'image/jpeg';
    } else if (format === 'webp') {
      format = 'image/webp';
    } else {
      format = 'image/png';
    }
    
    link.href = canvas.toDataURL(format);
    link.click();
  };

  // Clear canvas
  const clearCanvas = () => {
    // Trigger clear canvas in the CanvasBoard component
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="container-fluid">
      {/* Top menu bar for mobile */}
      <div className="top-menu mobile-only">
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰ Menu
        </button>
        <h1 className="logo">aicanvas</h1>
      </div>

      <div className="main-content row">
        {/* Sidebar menu for PC, hidden on mobile */}
        <aside className="sidebar col-2 desktop-only">
          <h2>Tools</h2>
          <div className="tool-group">
            <label>Tool:</label>
            <select 
              value={tool} 
              onChange={(e) => setTool(e.target.value)}
              className="form-control"
            >
              <option value="pen">Pen</option>
              <option value="eraser">Eraser</option>
            </select>
          </div>
          
          <div className="tool-group">
            <label>Color:</label>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="form-control"
            />
          </div>
          
          <div className="tool-group">
            <label>Brush Size:</label>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="form-control"
            />
            <span>{brushSize}px</span>
          </div>
          
          <div className="tool-group">
            <button 
              className="btn btn-primary full-width"
              onClick={clearCanvas}
            >
              Clear Canvas
            </button>
          </div>
          
          <div className="tool-group">
            <h3>Export</h3>
            <button 
              className="btn btn-success full-width"
              onClick={() => exportCanvas('png')}
            >
              Export as PNG
            </button>
            <button 
              className="btn btn-success full-width"
              onClick={() => exportCanvas('jpeg')}
            >
              Export as JPEG
            </button>
            <button 
              className="btn btn-success full-width"
              onClick={() => exportCanvas('webp')}
            >
              Export as WebP
            </button>
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <div className="mobile-menu-content">
              <div className="tool-group">
                <label>Tool:</label>
                <select 
                  value={tool} 
                  onChange={(e) => setTool(e.target.value)}
                  className="form-control"
                >
                  <option value="pen">Pen</option>
                  <option value="eraser">Eraser</option>
                </select>
              </div>
              
              <div className="tool-group">
                <label>Color:</label>
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="form-control"
                />
              </div>
              
              <div className="tool-group">
                <label>Brush Size:</label>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={brushSize} 
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="form-control"
                />
                <span>{brushSize}px</span>
              </div>
              
              <div className="tool-group">
                <button 
                  className="btn btn-primary full-width"
                  onClick={clearCanvas}
                >
                  Clear Canvas
                </button>
              </div>
              
              <div className="tool-group">
                <h3>Export</h3>
                <button 
                  className="btn btn-success full-width"
                  onClick={() => exportCanvas('png')}
                >
                  Export as PNG
                </button>
                <button 
                  className="btn btn-success full-width"
                  onClick={() => exportCanvas('jpeg')}
                >
                  Export as JPEG
                </button>
                <button 
                  className="btn btn-success full-width"
                  onClick={() => exportCanvas('webp')}
                >
                  Export as WebP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Canvas area */}
        <main className="canvas-area col-10">
          <CanvasBoard 
            width={canvasSize.width} 
            height={canvasSize.height} 
            tool={tool}
            color={tool === 'eraser' ? '#FFFFFF' : color}
            brushSize={brushSize}
          />
        </main>
      </div>

      <style jsx>{`
        .top-menu {
          display: none;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
        }
        
        .mobile-menu-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .desktop-only {
          display: block;
        }
        
        .mobile-only {
          display: none;
        }
        
        .main-content {
          display: flex;
          min-height: 100vh;
          margin-top: 0;
          padding-top: 60px;
        }
        
        .sidebar {
          background-color: #f8f9fa;
          padding: 20px;
          min-height: calc(100vh - 60px);
          width: 250px;
          overflow-y: auto;
          border-right: 1px solid #dee2e6;
        }
        
        .canvas-area {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 20px;
          background-color: #e9ecef;
          flex: 1;
          overflow: auto;
        }
        
        .tool-group {
          margin-bottom: 20px;
        }
        
        .tool-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #495057;
        }
        
        .tool-group input, 
        .tool-group select {
          width: 100%;
          margin-bottom: 8px;
          padding: 8px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .tool-group span {
          display: block;
          text-align: center;
          margin-top: 5px;
          font-size: 14px;
          color: #6c757d;
        }
        
        .full-width {
          width: 100%;
          margin-bottom: 10px;
          padding: 10px;
        }
        
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.7);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 60px;
        }
        
        .mobile-menu-content {
          background-color: white;
          width: 85%;
          max-width: 320px;
          padding: 20px;
          border-radius: 8px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .logo {
          margin: 0;
          color: #007bff;
          font-size: 24px;
          font-weight: bold;
        }
        
        /* Mobile styles */
        @media (max-width: 768px) {
          .top-menu {
            display: flex;
          }
          
          .desktop-only {
            display: none;
          }
          
          .mobile-only {
            display: flex;
          }
          
          .main-content {
            flex-direction: column;
            padding-top: 60px;
          }
          
          .sidebar {
            display: none;
          }
          
          .canvas-area {
            width: 100%;
            padding: 10px;
            min-height: calc(100vh - 60px);
          }
          
          .tool-group h3 {
            font-size: 1.2em;
            margin-top: 20px;
            margin-bottom: 10px;
            color: #495057;
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 5px;
          }
        }
      `}</style>
    </div>
  );
}
