"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

type Props = {
  onScanSuccess: (barcode: string) => void;
  onClose: () => void;
};

export default function BarcodeScanner({ onScanSuccess, onClose }: Props) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScannedRef = useRef(false);
  const isRunningRef = useRef(false);
  const isMountedRef = useRef(true);

  const stopScanner = async () => {
    if (scannerRef.current && isRunningRef.current) {
      try {
        isRunningRef.current = false;
        await scannerRef.current.stop();
      } catch (e) {
        // Ignore
      }
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    const startScanner = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isMountedRef.current) return;
      
      try {
        // Chỉ định các format cần quét
        const formatsToSupport = [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
        ];

        const scanner = new Html5Qrcode("barcode-reader", {
          formatsToSupport,
          verbose: false,
        });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: { width: 280, height: 280 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            if (isScannedRef.current) return;
            isScannedRef.current = true;
            
            console.log("Scanned:", decodedText);
            await stopScanner();
            onScanSuccess(decodedText);
          },
          () => {
            // Không log để tránh spam console
          }
        );
        
        isRunningRef.current = true;
        console.log("Scanner started and running");
      } catch (err: any) {
        console.error("Scanner error:", err);
        if (isMountedRef.current) {
          setError(err?.message || "Không thể mở camera");
        }
      }
    };

    startScanner();

    return () => {
      isMountedRef.current = false;
      stopScanner();
    };
  }, []);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Quét mã barcode</h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
            <p>{error}</p>
            <button
              onClick={handleClose}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Đóng
            </button>
          </div>
        ) : (
          <>
            <div
              id="barcode-reader"
              className="w-full rounded-lg overflow-hidden"
              style={{ height: "300px" }}
            />
            <p className="text-center text-sm text-gray-500 mt-3">
              Đưa mã barcode vào khung hình để quét
            </p>
          </>
        )}
      </div>
    </div>
  );
}
