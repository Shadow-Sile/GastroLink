import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeDisplay = ({
  value,
  title = "Escanea para ver el menú",
  size = 200,
  includeMargin = true,
  bgColor = "#FFFFFF",
  fgColor = "#000000",
  level = "H",
  renderAs = "canvas"
}) => {
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    if (renderAs === "canvas") {
      const canvas = document.getElementById("qr-code");
      if (canvas) {
        setDownloadUrl(canvas.toDataURL("image/png"));
      }
    }
  }, [value, size, includeMargin, bgColor, fgColor, level, renderAs]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "menu-qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 flex flex-col items-center max-w-xs mx-auto">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="bg-white p-4 rounded-lg shadow-inner">
        <QRCodeCanvas
          id="qr-code"
          value={value}
          size={size}
          includeMargin={includeMargin}
          bgColor={bgColor}
          fgColor={fgColor}
          level={level}
        />
      </div>
      <Button className="mt-4 bg-menuOrange hover:bg-menuOrange-dark" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Descargar QR
      </Button>
    </Card>
  );
};

export default QRCodeDisplay;
