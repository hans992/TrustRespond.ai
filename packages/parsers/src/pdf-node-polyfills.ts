import CSSMatrix from "dommatrix";

/**
 * pdfjs-dist (pulled in by pdf-parse v2) expects browser globals. Vercel / Node
 * serverless do not provide them. Import this module before any `pdf-parse` import.
 */
function install(): void {
  if (typeof globalThis.DOMMatrix === "undefined") {
    globalThis.DOMMatrix = CSSMatrix as unknown as typeof DOMMatrix;
  }
  if (typeof globalThis.DOMMatrixReadOnly === "undefined") {
    globalThis.DOMMatrixReadOnly = CSSMatrix as unknown as typeof DOMMatrixReadOnly;
  }
  if (typeof globalThis.DOMPoint === "undefined") {
    globalThis.DOMPoint = class DOMPoint {
      x: number;
      y: number;
      z: number;
      w: number;
      constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
      }
    } as unknown as typeof DOMPoint;
  }
  if (typeof globalThis.ImageData === "undefined") {
    globalThis.ImageData = class ImageData {
      data: Uint8ClampedArray;
      width: number;
      height: number;
      constructor(dataOrWidth: number | Uint8ClampedArray, widthOrHeight?: number, height?: number) {
        if (dataOrWidth instanceof Uint8ClampedArray) {
          this.data = dataOrWidth;
          this.width = widthOrHeight as number;
          this.height = height as number;
        } else {
          this.width = dataOrWidth;
          this.height = widthOrHeight as number;
          this.data = new Uint8ClampedArray(this.width * this.height * 4);
        }
      }
    } as unknown as typeof ImageData;
  }
  if (typeof globalThis.Path2D === "undefined") {
    globalThis.Path2D = class Path2D {
      addPath() {}
      arc() {}
      arcTo() {}
      bezierCurveTo() {}
      closePath() {}
      ellipse() {}
      lineTo() {}
      moveTo() {}
      quadraticCurveTo() {}
      rect() {}
      roundRect() {}
    } as unknown as typeof Path2D;
  }
}

install();
