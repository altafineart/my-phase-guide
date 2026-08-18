/**
 * Exportação em PDF: monta um documento HTML com estilo de impressão e abre a
 * caixa de impressão do navegador (opção "Salvar como PDF").
 */

const ESTILO = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: ui-sans-serif, system-ui, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #3b2e2a;
    margin: 0;
    line-height: 1.6;
    font-size: 11.5pt;
  }
  .capa { padding: 40px 0 28px; border-bottom: 2px solid #c96f4a; margin-bottom: 28px; }
  .capa p.sup { color: #a0705c; letter-spacing: .12em; text-transform: uppercase; font-size: 9pt; margin: 0 0 8px; }
  h1 { font-size: 26pt; margin: 0 0 8px; color: #8c3f24; }
  h2 { font-size: 15pt; margin: 26px 0 10px; color: #8c3f24; page-break-after: avoid; }
  h3 { font-size: 12.5pt; margin: 16px 0 6px; page-break-after: avoid; }
  p { margin: 0 0 10px; }
  ul { margin: 0 0 12px 18px; padding: 0; }
  li { margin-bottom: 4px; }
  img { width: 100%; border-radius: 10px; margin: 10px 0 14px; page-break-inside: avoid; }
  .bloco { page-break-inside: avoid; margin-bottom: 14px; }
  .destaque { background: #f6ece4; border-left: 3px solid #c96f4a; padding: 12px 14px; border-radius: 8px; margin: 0 0 16px; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 18px; font-size: 10pt; }
  th, td { border: 1px solid #e3d5cb; padding: 6px 8px; text-align: left; }
  th { background: #f6ece4; }
  .rodape { margin-top: 26px; padding-top: 12px; border-top: 1px solid #e3d5cb; font-size: 9pt; color: #8a7a72; }
`;

export function escapeHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function exportarPDF(titulo: string, corpoHtml: string) {
  if (typeof window === "undefined") return;

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>${escapeHtml(titulo)}</title><style>${ESTILO}</style></head>
<body>${corpoHtml}</body></html>`;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();

  const imprimir = () => {
    const win = iframe.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
    window.setTimeout(() => iframe.remove(), 1000);
  };

  // espera imagens carregarem antes de imprimir
  const imagens = Array.from(doc.images);
  if (imagens.length === 0) {
    window.setTimeout(imprimir, 200);
    return;
  }
  let pendentes = imagens.length;
  const pronto = () => {
    pendentes -= 1;
    if (pendentes <= 0) window.setTimeout(imprimir, 150);
  };
  for (const img of imagens) {
    if (img.complete) pronto();
    else {
      img.addEventListener("load", pronto);
      img.addEventListener("error", pronto);
    }
  }
  // fallback caso alguma imagem trave
  window.setTimeout(() => {
    if (document.body.contains(iframe)) imprimir();
  }, 4000);
}
