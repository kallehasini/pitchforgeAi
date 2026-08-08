import type { SourceType } from '@/types';

export interface ParsedFile {
  text: string;
  sourceType: SourceType;
  filename: string;
}

const ACCEPTED: Record<string, SourceType> = {
  'text/markdown': 'readme',
  'text/plain': 'txt',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

const EXT_MAP: Record<string, SourceType> = {
  md: 'readme',
  markdown: 'readme',
  txt: 'txt',
  pdf: 'pdf',
  docx: 'docx',
};

export function detectSourceType(filename: string, mime: string): SourceType | null {
  if (ACCEPTED[mime]) return ACCEPTED[mime];
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return EXT_MAP[ext] ?? null;
}

export async function parseFile(file: File, onProgress?: (pct: number) => void): Promise<ParsedFile> {
  const sourceType = detectSourceType(file.name, file.type);
  if (!sourceType) {
    throw new Error(`Unsupported file type: ${file.name}. Please upload a README.md, PDF, DOCX, or TXT file.`);
  }

  onProgress?.(15);

  let text: string;

  try {
    if (sourceType === 'pdf') {
      text = await parsePdf(file, onProgress);
    } else if (sourceType === 'docx') {
      text = await parseDocx(file, onProgress);
    } else {
      text = await readTextFile(file);
      onProgress?.(80);
    }
  } catch (err) {
    const friendly = friendlyParseError(sourceType, err);
    throw new Error(friendly);
  }

  if (!text || text.trim().length < 20) {
    throw new Error('The file appears to be empty or could not be read. Please try a different file.');
  }

  onProgress?.(100);
  return { text, sourceType, filename: file.name };
}

async function readTextFile(file: File): Promise<string> {
  return await file.text();
}

async function parsePdf(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const pdfjs = await import('pdfjs-dist');

  // Configure the worker properly for Vite + bundler environments
  const pdfjsLib = pdfjs as unknown as {
    getDocument: (args: { data: Uint8Array }) => Promise<{
      numPages: number;
      getPage: (n: number) => Promise<{ getTextContent: () => Promise<{ items: { str: string }[] }> }>;
    }>;
    GlobalWorkerOptions: { workerSrc: string };
    version: string;
  };

  // Use the bundled worker URL so Vite resolves it correctly
  const workerUrl = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
    .then((m) => m.default)
    .catch(() => `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`);

  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask;
  onProgress?.(40);

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    pages.push(pageText);
    onProgress?.(40 + Math.round((i / pdf.numPages) * 35));
  }

  return pages.join('\n\n');
}

async function parseDocx(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  onProgress?.(40);
  const result = await mammoth.extractRawText({ arrayBuffer });
  onProgress?.(75);
  return result.value;
}

function friendlyParseError(type: SourceType, err: unknown): string {
  const detail = err instanceof Error ? err.message : 'unknown error';
  switch (type) {
    case 'pdf':
      return `Could not read this PDF. It may be a scanned image or corrupted. Please try a text-based PDF. (${detail})`;
    case 'docx':
      return `Could not read this DOCX file. It may be corrupted or password-protected. (${detail})`;
    case 'readme':
      return `Could not read this Markdown file. Please check the file is valid. (${detail})`;
    case 'txt':
      return `Could not read this text file. (${detail})`;
    default:
      return `Could not parse the file: ${detail}`;
  }
}
