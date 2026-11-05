import jsPDF from 'jspdf';
import { toCanvas } from 'html-to-image';

export interface PdfExportOptions {
  filename?: string;
  pdfTitle?: string;
  marginMm?: number;
  author?: string;
  allowLandscape?: boolean;
}

export interface PrintResult {
  success: boolean;
  message: string;
  method: 'print_dialog' | 'download_fallback';
}

/**
 * Checks whether a horizontal row of pixels on the canvas is mostly white/transparent or uniform background.
 * Used for clean multi-page splitting between paragraphs, cards, or table rows.
 */
function isRowCleanBreak(ctx: CanvasRenderingContext2D, y: number, width: number): boolean {
  try {
    const samples = 30;
    const step = Math.floor(width / samples);
    const rowData = ctx.getImageData(0, Math.floor(y), width, 1).data;
    let whitePixels = 0;

    for (let s = 0; s < samples; s++) {
      const idx = (s * step) * 4;
      const r = rowData[idx];
      const g = rowData[idx + 1];
      const b = rowData[idx + 2];
      const a = rowData[idx + 3];

      // Transparent or near-white pixels count as blank space
      if (a === 0 || (r >= 240 && g >= 240 && b >= 240)) {
        whitePixels++;
      }
    }

    return (whitePixels / samples) >= 0.90;
  } catch {
    return false;
  }
}

/**
 * Generates an optimized jsPDF document from an HTML element strictly formatted for A4.
 */
export async function generateA4Pdf(
  element: HTMLElement,
  options: PdfExportOptions = {}
): Promise<{ pdf: jsPDF; cleanFilename: string }> {
  const marginMm = options.marginMm ?? 12;
  const rawFilename = options.filename || 'documento.pdf';
  const cleanFilename = rawFilename.endsWith('.pdf') ? rawFilename : `${rawFilename}.pdf`;

  // 1. Wait for web fonts if available
  if (document.fonts) {
    await document.fonts.ready;
  }

  // 2. Wait for embedded images
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>(resolve => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    })
  );

  // 3. Capture the FULL element height and width without scrolling clip
  const scrollW = Math.max(element.scrollWidth, element.offsetWidth, 750);
  const scrollH = Math.max(element.scrollHeight, element.offsetHeight);

  const canvas = await toCanvas(element, {
    pixelRatio: 2, // Crisp 2x retina capture
    backgroundColor: '#ffffff',
    cacheBust: false,
    skipFonts: true, // Prevents SecurityError on cross-origin Google Fonts
    width: scrollW,
    height: scrollH,
  });

  // 4. Standard A4 Dimensions (210mm x 297mm)
  const pdfPageWidthMm = 210;
  const pdfPageHeightMm = 297;
  const printableWidthMm = pdfPageWidthMm - (marginMm * 2); // 186 mm
  const printableHeightMm = pdfPageHeightMm - (marginMm * 2); // 273 mm

  // CSS pixels at 96 DPI to millimeters
  const CSS_PX_TO_MM = 25.4 / 96;
  const cssWidth = canvas.width / 2;
  const cssHeight = canvas.height / 2;
  const naturalWidthMm = cssWidth * CSS_PX_TO_MM;
  const naturalHeightMm = cssHeight * CSS_PX_TO_MM;

  // Fit to printable width cleanly (never stretch small items beyond 100%)
  let drawWidth = printableWidthMm;
  if (naturalWidthMm < printableWidthMm) {
    // If element is narrower (like compact receipt), keep natural readable scale
    drawWidth = naturalWidthMm;
  }
  const drawHeight = (naturalHeightMm * drawWidth) / naturalWidthMm;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  if (options.pdfTitle) {
    pdf.setDocumentProperties({
      title: options.pdfTitle,
      author: options.author || 'Órion Eventos e Lazer',
      creator: 'Sistema de Gestão Órion',
    });
  }

  // CASE 1: Single Page Fit
  if (drawHeight <= printableHeightMm) {
    const posX = (pdfPageWidthMm - drawWidth) / 2;
    // For single page receipts / certificates, place with balanced top margin
    const posY = drawHeight < (printableHeightMm * 0.7)
      ? marginMm + 10
      : (pdfPageHeightMm - drawHeight) / 2;

    const pageImgData = canvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(
      pageImgData,
      'JPEG',
      posX,
      posY,
      drawWidth,
      drawHeight,
      undefined,
      'FAST'
    );

    return { pdf, cleanFilename };
  }

  // CASE 2: Multi-Page Document (for long Financial reports or Contracts)
  // Calculate how many canvas pixels correspond to printableHeightMm
  const pageCanvasHeight = Math.floor((canvas.width * printableHeightMm) / drawWidth);
  let currentY = 0;
  let pageNum = 1;
  const mainCtx = canvas.getContext('2d');
  const posX = (pdfPageWidthMm - drawWidth) / 2;

  while (currentY < canvas.height) {
    if (pageNum > 1) {
      pdf.addPage();
    }

    let sliceHeight = Math.min(pageCanvasHeight, canvas.height - currentY);

    // Search for a clean whitespace line in the bottom 15% of the slice to avoid cutting rows in half
    if (currentY + sliceHeight < canvas.height && mainCtx) {
      const searchDepth = Math.min(160, Math.floor(sliceHeight * 0.15));
      const checkStartY = currentY + sliceHeight;

      for (let offset = 0; offset < searchDepth; offset += 4) {
        const testY = checkStartY - offset;
        if (isRowCleanBreak(mainCtx, testY, canvas.width)) {
          sliceHeight = testY - currentY;
          break;
        }
      }
    }

    // Create slice canvas
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const pageCtx = pageCanvas.getContext('2d');
    if (pageCtx) {
      pageCtx.fillStyle = '#ffffff';
      pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageCtx.drawImage(
        canvas,
        0, currentY, canvas.width, sliceHeight, // source
        0, 0, canvas.width, sliceHeight         // destination
      );
    }

    const sliceImgData = pageCanvas.toDataURL('image/jpeg', 0.98);
    const renderedSliceHeightMm = (sliceHeight * drawWidth) / canvas.width;

    pdf.addImage(
      sliceImgData,
      'JPEG',
      posX,
      marginMm,
      drawWidth,
      renderedSliceHeightMm,
      undefined,
      'FAST'
    );

    currentY += sliceHeight;
    pageNum++;
  }

  // Add standard A4 footer pagination
  const totalPages = pdf.getNumberOfPages();
  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(140, 140, 140);
      pdf.text(
        `Página ${i} de ${totalPages} · Demonstrativo emitido em formato A4`,
        pdfPageWidthMm / 2,
        pdfPageHeightMm - 6,
        { align: 'center' }
      );
    }
  }

  return { pdf, cleanFilename };
}

/**
 * Captures an HTML element and exports it as a downloaded A4 PDF file.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string = 'documento.pdf',
  options: PdfExportOptions = {}
): Promise<boolean> {
  try {
    const { pdf, cleanFilename } = await generateA4Pdf(element, { ...options, filename });
    pdf.save(cleanFilename);
    return true;
  } catch (error) {
    console.error('Erro ao gerar arquivo PDF A4:', error);
    return false;
  }
}

/**
 * Handles printing an element. In sandboxed iframes (like AI Studio preview),
 * direct window.print() is blocked by browser security. This function:
 * 1. Generates the exact A4 PDF
 * 2. Attempts to trigger native browser printing via an invisible iframe / blob
 * 3. Falls back smoothly to downloading the printable A4 PDF file directly with clear feedback.
 */
export async function printElementAsPdf(
  element: HTMLElement,
  filename: string = 'documento_impressao.pdf',
  options: PdfExportOptions = {}
): Promise<PrintResult> {
  try {
    const { pdf, cleanFilename } = await generateA4Pdf(element, { ...options, filename });
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    // Try iframe printing
    let printedSuccessfully = false;
    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);

      await new Promise(resolve => setTimeout(resolve, 500));

      if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        printedSuccessfully = true;
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(blobUrl);
      }, 3000);
    } catch {
      printedSuccessfully = false;
    }

    // If iframe print failed or is blocked by sandbox, save the PDF for user
    if (!printedSuccessfully) {
      pdf.save(cleanFilename);
      return {
        success: true,
        method: 'download_fallback',
        message: `Arquivo para impressão (${cleanFilename}) gerado e baixado no formato A4!`
      };
    }

    return {
      success: true,
      method: 'print_dialog',
      message: 'Enviando documento A4 para impressão...'
    };
  } catch (error) {
    console.error('Erro ao imprimir documento A4:', error);
    return {
      success: false,
      method: 'download_fallback',
      message: 'Não foi possível processar a impressão. Tente baixar o PDF diretamente.'
    };
  }
}
