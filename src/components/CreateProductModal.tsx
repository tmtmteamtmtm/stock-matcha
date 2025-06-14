import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { Result } from "@zxing/library";

type CreateProductModalProps = {
  onClose: () => void;
  onCreate: (product: { id: number; name: string; quantity: number }) => void;
  branchId: number;
};

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onClose: () => void;
}

function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const controls = useRef<any>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
  let reader = new BrowserMultiFormatReader();
  codeReader.current = reader;

  const startScanner = async () => {
    try {
      const videoDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      const backCamera = videoDevices.find((d) =>
        d.label.toLowerCase().includes("back")
      );

      const selectedDeviceId =
        backCamera?.deviceId || videoDevices[0]?.deviceId;

      if (!videoRef.current || !selectedDeviceId) return;

      controls.current = await reader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            onDetected(result.getText());
            controls.current?.stop(); // ✅ ใช้ได้เพราะเป็น object แล้ว
          }
          if (err && err.name !== "NotFoundException") {
            console.error(err);
          }
        }
      );
    } catch (err) {
      console.error("Scanner error:", err);
    }
  };

  startScanner();

  return () => {
    controls.current?.stop();
    controls.current = null;
    codeReader.current = null;
  };
}, [onDetected]);


  const toggleTorch = async (): Promise<void> => {
    try {
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as any; // Type assertion for torch support
        
        if (capabilities?.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !torchEnabled } as any] // Type assertion for torch constraint
          });
          setTorchEnabled(!torchEnabled);
        } else {
          console.log('Torch not supported on this device');
        }
      }
    } catch (error) {
      console.error('Torch control failed:', error);
      // Reset torch state if operation fails
      setTorchEnabled(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60">
      <div className="relative w-full max-w-lg mx-4">
        {/* Header */}
        <div className="bg-white rounded-t-lg px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-gray-800">สแกน Barcode</h3>
          </div>
          <button
            onClick={() => {
              controls.current?.stop();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative bg-black rounded-b-lg overflow-hidden">
          {hasPermission === false ? (
            <div className="w-full h-80 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white p-6">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
                <h4 className="text-lg font-semibold mb-2">ไม่สามารถเข้าถึงกล้องได้</h4>
                <p className="text-sm text-gray-300 mb-4">กรุณาอนุญาตให้เข้าถึงกล้องหรือป้อนข้อมูลด้วยตนเอง</p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-80 object-cover"
              muted
              playsInline
              autoPlay
              style={{ 
                width: "100%", 
                height: "320px", 
                objectFit: "cover",
                backgroundColor: "#000"
              }}
            />
          )}
          
          {/* Scanning Overlay - only show if camera is working */}
          {hasPermission !== false && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Corner Brackets */}
              <div className="relative w-64 h-32 border-2 border-transparent">
                {/* Top Left */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400"></div>
                {/* Top Right */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400"></div>
                {/* Bottom Left */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400"></div>
                {/* Bottom Right */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400"></div>
                
                {/* Scanning Line */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          {hasPermission !== false && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-center text-sm">
                วาง barcode ให้อยู่ในกรอบสี่เหลี่ยม
              </p>
            </div>
          )}

          {/* Controls */}
          {hasPermission !== false && (
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <button
                onClick={toggleTorch}
                className={`p-3 rounded-full ${
                  torchEnabled 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-black/50 text-white hover:bg-black/70'
                } transition-all duration-200`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-white text-xs">
                  {isScanning ? 'กำลังสแกน...' : 'พร้อมใช้งาน'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="bg-white rounded-b-lg px-6 py-4 flex justify-center space-x-4">
          <button
            onClick={() => {
              controls.current?.stop();
              onClose();
            }}
            className="flex items-center space-x-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>ยกเลิก</span>
          </button>
          
          <button
            onClick={() => {
              // Manual input option
              const manualCode = prompt('กรุณาป้อน barcode ด้วยตนเอง:');
              if (manualCode) {
                onDetected(manualCode);
                controls.current?.stop();
              }
            }}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>ป้อนเอง</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateProductModal({
  onClose,
  onCreate,
  branchId,
}: CreateProductModalProps) {
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const newProduct = { name, quantity: Number(quantity), branchId };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const data = await res.json();
      onCreate(data);
      onClose();
    } catch (err) {
      console.error("Create product failed:", err);
      alert("Failed to create product. Please try again.");
    }
  };

  const handleDetected = (barcode: string): void => {
    setName(barcode);
    setIsScanning(false);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setQuantity(val);
    }
  };

  return (
    <>
      {isScanning ? (
        <BarcodeScanner
          onDetected={handleDetected}
          onClose={() => setIsScanning(false)}
        />
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-all duration-300 ease-in-out scale-95 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">เพิ่มสินค้าใหม่</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อสินค้า
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                    placeholder="ชื่อสินค้า หรือกดสแกน barcode"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {name && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  จำนวน
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="จำนวน"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>

              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={() => setIsScanning(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M16 8h4.01M12 8h.01m0 0V4.01" />
                  </svg>
                  <span>สแกน Barcode</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    เพิ่มสินค้า
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}