// Design reminder: the “ဘာသာပြန် အလုပ်ရုံ” keeps technical metadata in a monospaced rail and treats subtitle text as the only translatable surface.

export type SrtCue = {
  index: number;
  start: string;
  end: string;
  text: string;
  raw: string;
};

const TIMESTAMP = /^\d{2}:\d{2}:\d{2}[,.]\d{3}\s+-->\s+\d{2}:\d{2}:\d{2}[,.]\d{3}/;

export function parseSrt(source: string): SrtCue[] {
  const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
  if (!normalized) return [];

  const blocks = normalized.split(/\n{2,}/);
  const cues: SrtCue[] = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    const timeLineIndex = lines.findIndex((line) => TIMESTAMP.test(line.trim()));
    if (timeLineIndex < 0) continue;

    const index = Number.parseInt(lines[timeLineIndex - 1]?.trim() ?? '', 10);
    const cueIndex = Number.isFinite(index) ? index : cues.length + 1;
    const timeLine = lines[timeLineIndex].trim();
    const match = timeLine.match(/^(\S+)\s+-->\s+(\S+)/);
    if (!match) continue;

    const text = lines.slice(timeLineIndex + 1).join('\n').trim();
    if (!text) continue;
    cues.push({ index: cueIndex, start: match[1], end: match[2], text, raw: block });
  }

  return cues;
}

export function serializeSrt(cues: SrtCue[]): string {
  return cues
    .map((cue) => `${cue.index}\n${cue.start} --> ${cue.end}\n${cue.text.trim()}`)
    .join('\n\n') + (cues.length ? '\n\n' : '');
}

export function splitForTranslation(text: string, maxChars = 4500): string[] {
  if (text.length <= maxChars) return [text];
  const chunks: string[] = [];
  let current = '';
  for (const line of text.split('\n')) {
    if (current && current.length + line.length + 1 > maxChars) {
      chunks.push(current);
      current = '';
    }
    current += `${current ? '\n' : ''}${line}`;
  }
  if (current) chunks.push(current);
  return chunks;
}

export function collectTechnicalTerms(cues: SrtCue[]): string[] {
  const candidates = cues.flatMap((cue) => cue.text.match(/\b[A-Z][A-Za-z0-9+.#_-]{2,}\b/g) ?? []);
  return Array.from(new Set(candidates)).filter((term) => !/^(The|This|That|You|And|For|With|What|When|Where|How|But|Not|Can|Are|Was|Will)$/i.test(term));
}

export function validateOutput(original: SrtCue[], translated: SrtCue[]): string[] {
  const errors: string[] = [];
  if (original.length !== translated.length) errors.push('Cue count changed');
  original.forEach((cue, i) => {
    const result = translated[i];
    if (!result) return;
    if (cue.index !== result.index) errors.push(`Cue number changed at ${cue.index}`);
    if (cue.start !== result.start || cue.end !== result.end) errors.push(`Timestamp changed at cue ${cue.index}`);
  });
  return errors;
}

export async function translateCueText(text: string, technicalTerms: string[], context = ''): Promise<string> {
  const endpoint = import.meta.env.VITE_TRANSLATE_ENDPOINT || '/api/translate';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage: 'my', technicalTerms, context }),
  });
  const raw = await response.text();
  let data: { translation?: string; error?: string } = {};
  try { data = JSON.parse(raw) as { translation?: string; error?: string }; } catch { /* non-JSON response */ }
  if (!response.ok) {
    const detail = data.error || (raw.includes('<!doctype') ? 'Translation endpoint မချိတ်ရသေးပါ။ Manus server ကို run/deploy လုပ်ထားကြောင်း စစ်ပါ။' : raw.slice(0, 160));
    throw new Error(`Translation service returned ${response.status}: ${detail}`);
  }
  if (!data.translation) throw new Error(data.error || 'Translation service returned no translation');
  return data.translation;
}
