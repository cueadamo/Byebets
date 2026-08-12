import { jsPDF } from "jspdf";

export interface ClientData {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  plataforma: string;
}

export function generateClientFormPDF(summaryText: string, clientData: ClientData): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  let y = 14;

  // Header Banner
  doc.setFillColor(11, 35, 64); // Navy #0B2340
  doc.rect(margin, y, contentWidth, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ByeBets", margin + 6, y + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(185, 139, 62); // Gold #B98B3E
  doc.text("FORMULÁRIO DO CLIENTE — LEVANTAMENTO APROFUNDADO", margin + 6, y + 18);

  y += 30;

  // Client Info Box
  doc.setFillColor(246, 243, 236); // #F6F3EC
  doc.setDrawColor(228, 223, 211); // #E4DFD3
  doc.rect(margin, y, contentWidth, 22, "FD");

  doc.setTextColor(11, 35, 64);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(clientData.nome || "Cliente", margin + 5, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(107, 101, 88);
  doc.text(
    `Tel: ${clientData.telefone || "-"}  |  E-mail: ${clientData.email || "-"}`,
    margin + 5,
    y + 13
  );
  doc.text(
    `Cidade/UF: ${clientData.cidade || "-"}/${clientData.estado || "-"}  |  Plataforma: ${clientData.plataforma || "-"}`,
    margin + 5,
    y + 18
  );

  y += 28;

  // Summary Lines Formatting
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.setTextColor(34, 32, 27);

  const lines = summaryText.split("\n");

  for (const line of lines) {
    // Check if line is a section header (starts with "—" or "FORMULÁRIO")
    const isHeader = line.startsWith("—") || line.startsWith("FORMULÁRIO");

    if (isHeader) {
      y += 3;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(11, 35, 64);
    } else {
      doc.setFont("courier", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(40, 40, 40);
    }

    const wrappedLines = doc.splitTextToSize(line || " ", contentWidth);

    for (const wl of wrappedLines) {
      if (y > pageHeight - 16) {
        doc.addPage();
        y = 16;
      }
      doc.text(wl, margin, y);
      y += 4.5;
    }
  }

  // Footer page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `ByeBets · Formulário do Cliente · Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
