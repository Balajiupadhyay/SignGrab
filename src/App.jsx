import React, { useRef, useEffect, useState } from 'react';
import { HiDownload } from "react-icons/hi";
import { TbReload } from "react-icons/tb";
import { FaSignature } from "react-icons/fa";
import { MdColorLens } from "react-icons/md";
import { PiPaintBrushHouseholdFill } from "react-icons/pi";
import { TbResize } from "react-icons/tb";
import Tooltip from '@mui/material/Tooltip';
import { BiSolidFileImage } from "react-icons/bi";

import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const isDrawing = useRef(false);
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [brushColor, setBrushColor] = useState('black');
  const [brushSize, setBrushSize] = useState(5);
  const [height, setHeight] = useState(canvasRef.height);
  const [width, setWidth] = useState(canvasRef.width);
  const [imageFormat, setImageFormat] = useState('jpg');

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContainer = canvasContainerRef.current;
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, [backgroundColor, brushSize, brushColor]);

  const startDrawing = (event) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = getEventCoordinates(event);
    const context = canvasRef.current.getContext('2d');
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const draw = (event) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = getEventCoordinates(event);
    const context = canvasRef.current.getContext('2d');
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const finishDrawing = () => {
    isDrawing.current = false;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;

    // Get the specified width and height from the input boxes
    const specifiedWidthCm = parseFloat(width);
    const specifiedHeightCm = parseFloat(height);

    // Convert cm to pixels (assuming 1cm = 37.8px)
    const specifiedWidthPx = specifiedWidthCm * 37.7952755906;
    const specifiedHeightPx = specifiedHeightCm * 37.7952755906;

    // Create a temporary canvas with the specified dimensions
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = specifiedWidthPx;
    tempCanvas.height = specifiedHeightPx;

    // Draw the canvas onto the temporary canvas with the specified dimensions
    tempCtx.drawImage(canvas, 0, 0, specifiedWidthPx, specifiedHeightPx);
    const dataUrl = tempCanvas.toDataURL(`image/${imageFormat}`);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `signature_image.${imageFormat}`;
    a.click();
  };

  const handleBackgroundColorChange = () => {
    setBackgroundColor(backgroundColor === 'transparent' ? 'white' : 'transparent');
  };

  const handleBrushColorChange = (event) => {
    setBrushColor(event.target.value);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleBrushSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setBrushSize(newSize);
  };

  const handleImageFormat = (event) => {
    setImageFormat(event.target.value);
  };

  const getEventCoordinates = (event) => {
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    return { offsetX, offsetY };
  };

  const date = new Date();
  const currentYear = date.getFullYear();

  return (
    <>
      <div className='flex flex-col gap-5 justify-center items-center bg-zinc-900 w-full h-screen'>
        <div className='flex gap-4 justify-center items-center  w-[100%]  flex-wrap text-sm font-medium'>
          <Tooltip title="Download signature" TransitionProps={{ timeout: 500 }}>
            <button onClick={handleDownload}><HiDownload className='bg-zinc-200/50 p-1 h-8 w-8 rounded-full'/></button>
          </Tooltip>
          <Tooltip title="New Signature">
            <button onClick={handleReload}><TbReload className='bg-zinc-200/50 p-1 h-8 w-8 rounded-full'/></button>
          </Tooltip>
          <div className='flex bg-zinc-200/50 rounded-full'>
            <Tooltip title="Change canvas color">
              <button>
                <MdColorLens  className='p-1 h-8 w-8 rounded-full'/>
              </button>
            </Tooltip>
            <select value={backgroundColor} onChange={handleBackgroundColorChange} className='bg-zinc-200/30 p-1 rounded-full'>
              <option value={'transparent'}>Transparent</option>
              <option value={'white'}>White</option>
            </select>
          </div>
          <div className='flex bg-zinc-200/50 rounded-full'>
            <Tooltip title="Change brush size">
              <button>
                <FaSignature className='p-1 h-8 w-8 rounded-full'/>
              </button>
            </Tooltip>
            <select value={brushSize} onChange={handleBrushSizeChange} className='bg-zinc-200/30 p-1 rounded-full'>
              <option value={2}>2px</option>
              <option value={3}>3px</option>
              <option value={4}>4px</option>
              <option value={5}>5px</option>
              <option value={8}>8px</option>
            </select>
          </div>
          <div className='flex bg-zinc-200/50 rounded-full'>
            <Tooltip title="Change brush color">
              <button>
                <PiPaintBrushHouseholdFill className='p-1 h-8 w-8 rounded-full'/>
              </button>
            </Tooltip>
            <select value={brushColor} onChange={handleBrushColorChange} className='bg-zinc-200/30 p-1 rounded-full'>
              <option value={'black'}>Black</option>
              <option value={'green'}>Green</option>
              <option value={'red'}>Red</option>
              <option value={'blue'}>Blue</option>
            </select>
          </div>
          <div className="flex bg-zinc-200/50 rounded-full">
            <Tooltip title="Change image size">
              <button>
                <TbResize className=' p-1 h-8 w-8 rounded-full' />
              </button>
            </Tooltip>
              <input type="number" value={width} onChange={(e) => setWidth(parseInt(e.target.value))} className="bg-zinc-200/50 p-1 rounded-s-full w-[85px]  placeholder:text-zinc-900 placeholder:px-1" placeholder="Width (cm)" />
              <input type="number" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} className="bg-zinc-200/50 p-1 rounded-e-full w-[90px] placeholder:text-zinc-900 placeholder:px-1" placeholder="Height (cm)" />
          </div>
          <div className='flex bg-zinc-200/50 rounded-full'>
            <Tooltip title="Change image format">
              <button>
                <BiSolidFileImage className='p-1 h-8 w-8 rounded-full'/>
              </button>
            </Tooltip>
              <select value={imageFormat} onChange={handleImageFormat} className='bg-zinc-200/30 p-1 rounded-full'>
                <option value={'jpg'}>JPG</option>
                <option value={'png'}>PNG</option>
                {/* <option value={'pdf'}>PDF</option> */}
              </select>
          </div>
        </div>
        <div
          className='flex bg-zinc-800 w-[60%] h-[70%] rounded-2xl overflow-hidden'
          ref={canvasContainerRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={finishDrawing}
        >
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className=' text-zinc-400'>
          &#169; Balaji Upadhyay {currentYear}
        </div>
      </div>
    </>
    
  );
}

export default App;
