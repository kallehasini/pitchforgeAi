import PptxGenJS from 'pptxgenjs';
import type { Deck, Slide } from '@/types';
import { AUDIENCE_LABELS } from '@/types';

const BG = '07060D';
const SURFACE = '0F0D1C';
const ACCENT = '8B5CF6';
const ACCENT_2 = 'A78BFA';
const INK = 'F5F3FF';
const INK_MUTED = 'B9B3D8';
const INK_DIM = '7E78A3';

export async function exportPptx(deck: Deck): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'PitchForge', width: 13.333, height: 7.5 });
  pptx.layout = 'PitchForge';
  pptx.author = 'PitchForge AI';
  pptx.title = deck.slides[0]?.title ?? 'Pitch Deck';

  for (const slide of deck.slides) {
    renderSlide(pptx, slide, deck);
  }

  await pptx.writeFile({ fileName: `${deck.slides[0]?.title ?? 'pitchforge'}-${deck.audience}.pptx` });
}

function renderSlide(pptx: PptxGenJS, slide: Slide, deck: Deck) {
  const s = pptx.addSlide();
  s.background = { color: BG };

  // Accent bar at top
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.08, fill: { color: ACCENT } });

  // Slide number
  s.addText(`${deck.slides.indexOf(slide) + 1} / ${deck.slides.length}`, {
    x: 12.2, y: 0.25, w: 1, h: 0.3,
    fontSize: 9, color: INK_DIM, align: 'right', fontFace: 'Inter',
  });

  // Audience tag
  s.addText(AUDIENCE_LABELS[deck.audience].toUpperCase(), {
    x: 0.5, y: 0.25, w: 4, h: 0.3,
    fontSize: 9, color: ACCENT_2, fontFace: 'Inter', bold: true, charSpacing: 2,
  });

  if (slide.type === 'title') {
    s.addText(slide.title, {
      x: 0.8, y: 2.4, w: 11.7, h: 1.5,
      fontSize: 44, bold: true, color: INK, fontFace: 'Sora', align: 'center',
    });
    if (slide.subtitle) {
      s.addText(slide.subtitle, {
        x: 1.5, y: 4, w: 10.3, h: 0.6,
        fontSize: 20, color: INK_MUTED, fontFace: 'Inter', align: 'center',
      });
    }
    if (slide.highlight) {
      s.addText(slide.highlight, {
        x: 3, y: 5, w: 7.3, h: 0.5,
        fontSize: 13, color: ACCENT_2, fontFace: 'Inter', align: 'center', italic: true,
      });
    }
    return;
  }

  if (slide.type === 'closing') {
    s.addText(slide.title, {
      x: 0.8, y: 2.6, w: 11.7, h: 1.2,
      fontSize: 36, bold: true, color: INK, fontFace: 'Sora', align: 'center',
    });
    if (slide.subtitle) {
      s.addText(slide.subtitle, {
        x: 1.5, y: 4, w: 10.3, h: 0.6,
        fontSize: 22, color: ACCENT_2, fontFace: 'Inter', align: 'center',
      });
    }
    if (slide.highlight) {
      s.addText(slide.highlight, {
        x: 2, y: 5, w: 9.3, h: 0.5,
        fontSize: 14, color: INK_MUTED, fontFace: 'Inter', align: 'center',
      });
    }
    return;
  }

  // Standard slide layout
  s.addText(slide.title, {
    x: 0.7, y: 0.7, w: 12, h: 0.8,
    fontSize: 30, bold: true, color: INK, fontFace: 'Sora',
  });

  let bodyY = 1.7;

  if (slide.body) {
    s.addText(slide.body, {
      x: 0.7, y: bodyY, w: slide.bullets?.length ? 6.8 : 12, h: 1.5,
      fontSize: 15, color: INK_MUTED, fontFace: 'Inter', lineSpacingMultiple: 1.4, valign: 'top',
    });
    bodyY += 1.6;
  }

  if (slide.bullets && slide.bullets.length) {
    const bx = slide.body ? 7.8 : 0.7;
    const by = slide.body ? 1.8 : bodyY;
    const bulletItems = slide.bullets.map((b) => ({ text: b, options: { bullet: { code: '2022', indent: 12 } } }));
    s.addText(bulletItems, {
      x: bx, y: by, w: slide.body ? 4.8 : 12, h: 3.5,
      fontSize: 14, color: INK, fontFace: 'Inter', lineSpacingMultiple: 1.5, valign: 'top',
    });
  }

  if (slide.highlight) {
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.7, y: 6.3, w: 4.5, h: 0.7,
      rectRadius: 0.12, fill: { color: SURFACE }, line: { color: ACCENT, width: 1 },
    });
    s.addText(slide.highlight, {
      x: 0.9, y: 6.35, w: 4.1, h: 0.6,
      fontSize: 13, bold: true, color: ACCENT_2, fontFace: 'Inter', align: 'left', valign: 'middle',
    });
  }
}

export async function exportNotesPdf(deck: Deck): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'Notes', width: 8.5, height: 11 });
  pptx.layout = 'Notes';

  const s = pptx.addSlide();
  s.background = { color: 'FFFFFF' };
  s.addText(`${deck.slides[0]?.title ?? 'PitchForge'} — Presenter Notes`, {
    x: 0.5, y: 0.4, w: 7.5, h: 0.6, fontSize: 22, bold: true, color: '1A1A2E', fontFace: 'Sora',
  });
  s.addText(`Audience: ${AUDIENCE_LABELS[deck.audience]}  •  Generated ${new Date(deck.created_at).toLocaleDateString()}`, {
    x: 0.5, y: 1.05, w: 7.5, h: 0.3, fontSize: 11, color: '6B7280', fontFace: 'Inter',
  });

  const notes = deck.presenter_notes ?? [];
  let y = 1.6;
  for (let i = 0; i < deck.slides.length; i++) {
    const slide = deck.slides[i];
    const note = notes.find((n) => n.slideId === slide.id);
    s.addText(`Slide ${i + 1}: ${slide.title}`, {
      x: 0.5, y, w: 7.5, h: 0.35, fontSize: 12, bold: true, color: '6D28D9', fontFace: 'Inter',
    });
    y += 0.4;
    s.addText(note?.text ?? '', {
      x: 0.5, y, w: 7.5, h: 0.7, fontSize: 11, color: '374151', fontFace: 'Inter', lineSpacingMultiple: 1.3, valign: 'top',
    });
    y += 0.8;
  }

  await pptx.writeFile({ fileName: `${deck.slides[0]?.title ?? 'pitchforge'}-notes.pdf` });
}
