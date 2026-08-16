// Design reminder: this page follows the “ဘာသာပြန် အလုပ်ရုံ” workbench direction—an asymmetric workflow rail, teal progress cues, warm paper texture, and technical metadata kept visibly separate from translatable text.
import { useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowDownToLine, Check, ChevronRight, FileText, Languages, Loader2, LockKeyhole, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { collectTechnicalTerms, parseSrt, serializeSrt, translateCueText, validateOutput, type SrtCue } from '@/lib/srt';

const logoUrl = '/manus-storage/srt-workbench-logo_e309c40e.png';

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/x-subrip;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [source, setSource] = useState<SrtCue[]>([]);
  const [translated, setTranslated] = useState<SrtCue[]>([]);
  const [preserveTerms, setPreserveTerms] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const terms = useMemo(() => collectTechnicalTerms(source), [source]);
  const hasResult = translated.length > 0;
  const canTranslate = source.length > 0 && !isTranslating;

  async function loadFile(file?: File) {
    if (!file) return;
    setError('');
    if (!file.name.toLowerCase().endsWith('.srt')) {
      setError('SRT ဖိုင်သာ ထည့်ပေးပါ။');
      return;
    }
    try {
      const text = await file.text();
      const cues = parseSrt(text);
      if (!cues.length) throw new Error('No cues');
      setFileName(file.name);
      setSource(cues);
      setTranslated([]);
      setProgress(0);
      toast.success(`${cues.length.toLocaleString()} cues ဖတ်ပြီးပါပြီ`);
    } catch {
      setError('ဒီဖိုင်ထဲမှာ ဖတ်လို့ရတဲ့ subtitle cue မတွေ့ပါ။');
    }
  }

  async function translate() {
    if (!canTranslate) return;
    setError('');
    setIsTranslating(true);
    setTranslated([]);
    const output: SrtCue[] = [];
    try {
      for (let i = 0; i < source.length; i += 1) {
        const cue = source[i];
        const context = [source[i - 1]?.text, source[i + 1]?.text].filter(Boolean).join('\n');
        const text = await translateCueText(cue.text, preserveTerms ? terms : [], context);
        output.push({ ...cue, text });
        setProgress(Math.round(((i + 1) / source.length) * 100));
        setTranslated([...output]);
      }
      const validationErrors = validateOutput(source, output);
      if (validationErrors.length) throw new Error(validationErrors[0]);
      toast.success('မြန်မာဘာသာပြန်ပြီးပါပြီ');
    } catch (translationError) {
      setError(translationError instanceof Error ? translationError.message : 'ဘာသာပြန်ရာမှာ အမှားရှိနေပါတယ်။');
      toast.error('ဘာသာပြန်မှု မအောင်မြင်ပါ');
    } finally {
      setIsTranslating(false);
    }
  }

  function reset() {
    setFileName(''); setSource([]); setTranslated([]); setProgress(0); setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  const outputName = fileName ? fileName.replace(/\.srt$/i, '') + '.my.srt' : 'translated-burmese.srt';
  const displayCues = (hasResult ? translated : source).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f5f2ea] text-[#1b2527]">
      <header className="relative z-10 border-b border-[#d9d4c8] bg-[#f5f2ea]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8">
          <div className="relative z-10 flex items-center gap-3 bg-[#f5f2ea]">
            <img src={logoUrl} alt="SRT Workbench" className="h-10 w-10 object-contain" />
            <div><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#0e827b]">ဘာသာပြန် အလုပ်ရုံ</p><p className="font-display text-base font-bold tracking-tight">မြန်မာစာတန်းထိုး ဘာသာပြန်</p></div>
          </div>
          <div className="hidden items-center gap-3 text-xs text-[#667072] sm:flex"><LockKeyhole className="h-3.5 w-3.5" /> ဖိုင်များကို browser flow ထဲမှာသာ အသုံးပြုသည်</div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-[1440px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="relative border-b border-[#d9d4c8] px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#0e827b]">01 / WORKFLOW</p>
          <h1 className="mt-5 max-w-[220px] font-display text-4xl font-bold leading-[1.04] tracking-[-0.05em]">စာတန်းထိုးကို ထည့်ပါ။<br /><span className="text-[#0e827b]">အချိန်ကုဒ်ကို</span><br />ကျွန်ုပ်တို့ မထိပါ။</h1>
          <p className="mt-6 max-w-[220px] text-sm leading-6 text-[#667072]">SRT cue number၊ timestamp နဲ့ line break တွေကို ထိန်းထားပြီး မြန်မာလို ပြန်ပေးတဲ့ ရိုးရှင်းတဲ့ workbench ပါ။</p>
          <div className="relative mt-10 space-y-5"><span className="absolute bottom-5 left-[13px] top-3 w-px bg-[#9bc9bd]" aria-hidden="true" />
            {['ဖိုင်ထည့်ရန်', 'မြန်မာလို ပြန်ရန်', 'SRT ပြန်ယူရန်'].map((label, index) => <div key={label} className="relative z-10 flex items-center gap-3 bg-[#f5f2ea]"><span className={`flex h-7 w-7 items-center justify-center rounded-full border font-mono text-xs ${index === 0 && !hasResult ? 'border-[#0e827b] bg-[#0e827b] text-white' : index === 1 && hasResult ? 'border-[#0e827b] bg-[#0e827b] text-white' : 'border-[#b8b4a9] text-[#7c817e]'}`}>{index + 1}</span><span className="text-sm font-medium text-[#4f595a]">{label}</span>{index < 2 && <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#b8b4a9]" />}</div>)}
          </div>
          <div className="mt-12 hidden border-t border-[#d9d4c8] pt-5 lg:block"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a918c]">အသုံးပြုနိုင်သည်</p><p className="mt-2 text-xs leading-5 text-[#667072]">စာကြောင်းများသော ဖိုင်များ<br />Multi-line cues<br />Technical term lock</p></div>
        </aside>

        <section className="relative overflow-hidden px-5 py-8 sm:px-8 lg:px-14 lg:py-12">
          <div className="relative max-w-[1000px] border-t-4 border-[#0e827b] bg-[#faf9f5] px-4 pt-1 shadow-[0_12px_45px_rgba(49,63,60,0.06)] sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#d9d4c8] pb-6"><div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8a918c]">ဖိုင် / ရလဒ်</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.03em]">ဘာသာပြန် အလုပ်စားပွဲ</h2></div>{source.length > 0 && <button onClick={reset} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#7b8380] transition-colors hover:text-[#c45b3f]"><X className="h-3.5 w-3.5" /> ဖိုင်ဖယ်မည်</button>}</div>

            {!source.length ? <label htmlFor="srt-file" className="group mt-8 flex min-h-[285px] cursor-pointer flex-col items-center justify-center border border-dashed border-[#9ca7a1] bg-[#f8f6f0] px-6 text-center transition-all hover:border-[#0e827b] hover:bg-[#eff6f2] focus-within:ring-2 focus-within:ring-[#0e827b]/30"><input ref={inputRef} id="srt-file" type="file" accept=".srt" className="sr-only" onChange={(event) => loadFile(event.target.files?.[0])} /><span className="mb-5 flex h-14 w-14 items-center justify-center border border-[#b9c9c1] bg-white text-[#0e827b] transition-transform group-hover:-translate-y-1"><UploadCloud className="h-6 w-6" /></span><span className="font-display text-lg font-bold">SRT ဖိုင်ကို ဒီမှာ ဆွဲထည့်ပါ</span><span className="mt-2 text-sm text-[#77817d]">သို့မဟုတ် click လုပ်ပြီး file picker ဖွင့်ပါ</span><span className="mt-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9aa19b]">.SRT / UTF-8 / NO DATABASE</span></label> : <div className="mt-8 border border-[#d9d4c8] bg-[#fbfaf6]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d9d4c8] px-5 py-4"><div className="relative z-10 flex items-center gap-3 bg-[#f5f2ea]"><FileText className="h-5 w-5 text-[#0e827b]" /><div><p className="text-sm font-semibold">{fileName}</p><p className="font-mono text-[10px] uppercase tracking-wider text-[#8a918c]">{source.length.toLocaleString()} cues / အဆင်သင့်</p></div></div><Badge className="rounded-none border-[#c4e0d3] bg-[#e7f3ec] font-mono text-[10px] text-[#26745e] hover:bg-[#e7f3ec]">SRT ထည့်ပြီး</Badge></div>
              <div className="grid md:grid-cols-[1fr_300px]">
                <div className="divide-y divide-[#e4e0d6]">{displayCues.map((cue) => <div key={cue.index} className="grid grid-cols-[72px_1fr] gap-4 px-5 py-4"><div><p className="font-mono text-[11px] font-medium text-[#0e827b]">{String(cue.index).padStart(2, '0')}</p><p className="mt-1 font-mono text-[9px] leading-4 text-[#8a918c]">{cue.start}<br />{cue.end}</p></div><p className="whitespace-pre-line text-sm leading-6 text-[#394446]">{cue.text}</p></div>)}</div>
                <div className="border-t border-[#e4e0d6] bg-[#f4f2eb] px-5 py-5 md:border-l md:border-t-0"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a918c]">ဘာသာပြန် စည်းမျဉ်း</p><label className="mt-5 flex items-start gap-3"><Checkbox checked={preserveTerms} onCheckedChange={(value) => setPreserveTerms(Boolean(value))} className="mt-0.5 rounded-none data-[state=checked]:border-[#0e827b] data-[state=checked]:bg-[#0e827b]" /><span className="text-sm leading-5">Technology terms မပြောင်းပါ<br /><span className="text-xs text-[#7b8380]">{terms.length ? `${terms.length} terms တွေ့ထားသည်` : 'စာလုံးကြီး terms မတွေ့သေးပါ'}</span></span></label><div className="mt-7 border-t border-[#d9d4c8] pt-4"><p className="text-xs leading-5 text-[#6d7774]">Timestamp နှင့် cue number များသည် ဘာသာပြန်ပြီးနောက် auto-check လုပ်မည်။</p></div></div>
              </div>
            </div>}

            {error && <div className="mt-5 flex items-start gap-3 border border-[#e5b5a6] bg-[#fff3ef] px-4 py-3 text-sm text-[#9a422e]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>}
            <div className="mt-7 flex flex-wrap items-center gap-4">{!hasResult ? <Button onClick={translate} disabled={!canTranslate} className="h-12 rounded-none bg-[#0e827b] px-6 font-display text-sm font-bold text-white shadow-[4px_4px_0_#b9d6c5] transition-transform hover:bg-[#096b65] active:translate-x-[2px] active:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-40"><Languages className="mr-2 h-4 w-4" /> {isTranslating ? 'ဘာသာပြန်နေသည်…' : 'မြန်မာလို ပြန်မည်'}</Button> : <Button onClick={() => downloadFile(outputName, serializeSrt(translated))} className="h-12 rounded-none bg-[#0e827b] px-6 font-display text-sm font-bold text-white shadow-[4px_4px_0_#b9d6c5] hover:bg-[#096b65]"><ArrowDownToLine className="mr-2 h-4 w-4" /> {outputName} ကို Download</Button>}{isTranslating && <div className="flex min-w-[220px] items-center gap-3"><Progress value={progress} className="h-1.5 bg-[#d7e5dc] [&>div]:bg-[#0e827b]" /><span className="font-mono text-[11px] text-[#0e827b]">{progress}%</span><Loader2 className="h-4 w-4 animate-spin text-[#0e827b]" /></div>}{hasResult && <span className="flex items-center gap-2 text-xs text-[#26745e]"><Check className="h-4 w-4" /> timestamp စစ်ပြီး</span>}</div>
            <div className="mt-14 grid gap-5 border-t border-[#d9d4c8] pt-6 sm:grid-cols-3"><div><p className="font-mono text-[10px] text-[#0e827b]">01</p><p className="mt-2 text-sm font-semibold">စာကြောင်းများများလည်း ရပါတယ်</p><p className="mt-1 text-xs leading-5 text-[#7a8380]">Cue တစ်ခုချင်းကို စီစဉ်ပြီး ဆောင်ရွက်သည်။</p></div><div><p className="font-mono text-[10px] text-[#0e827b]">02</p><p className="mt-2 text-sm font-semibold">Time stamp မပျက်ပါ</p><p className="mt-1 text-xs leading-5 text-[#7a8380]">မူရင်း start/end timing ကို output ထဲ ပြန်ထားသည်။</p></div><div><p className="font-mono text-[10px] text-[#0e827b]">03</p><p className="mt-2 text-sm font-semibold">ဖိုင်ကို ပြန်ယူနိုင်သည်</p><p className="mt-1 text-xs leading-5 text-[#7a8380]">Translated `.my.srt` ကို browser ကနေ download လုပ်ပါ။</p></div></div>
          </div>
        </section>
      </main>
    </div>
  );
}
