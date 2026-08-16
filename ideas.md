# SRT Burmese Translator — Design Direction

## Approach 1
**Theme Name:** စာတန်းထိုး စာကြည့်တိုက်

**Very Brief Intro:** စာအုပ်စာကြည့်တိုက်၏ တည်ငြိမ်မှုနှင့် subtitle editor ၏ စနစ်ကျမှုကို ပေါင်းစပ်ထားသော နွေးထွေးသည့် editorial interface ဖြစ်သည်။ ဖတ်ရလွယ်ကူမှု၊ ယုံကြည်စိတ်ချရမှုနှင့် ဖိုင်အလုပ်စီးဆင်းမှုကို အဓိကထားသည်။

**Probability:** 0.07

## Approach 2
**Theme Name:** ဘာသာပြန် အလုပ်ရုံ

**Very Brief Intro:** လက်ရာလုပ်ငန်းခွင်လို ရှင်းလင်းပြီး အလုပ်လုပ်ရလွယ်သော tool interface ဖြစ်သည်။ Upload, translate, review, download အဆင့်များကို မြင်သာသော workspace တစ်ခုအဖြစ် တည်ဆောက်မည်။

**Probability:** 0.04

## Approach 3
**Theme Name:** သံစဉ်အလင်း

**Very Brief Intro:** ရုပ်ရှင်နှင့် အသံသွင်းခန်းများ၏ အမှောင်နောက်ခံအတွင်း အနီရောင်မှတ်သားချက်များဖြင့် subtitle workflow ကို အာရုံစိုက်စေသော cinematic interface ဖြစ်သည်။

**Probability:** 0.08

## ရွေးချယ်ထားသော Approach — ဘာသာပြန် အလုပ်ရုံ

### Design Movement
Swiss International Typographic Style ကို modern utility editorial design နှင့် ပေါင်းစပ်ထားသည်။ စာကြောင်းများစွာပါသော SRT ကို အမြန်ဖတ်ရှုနိုင်ရန် အလွှာလိုက် information hierarchy နှင့် ခွဲခြားထားသော workbench layout ကို သုံးမည်။

### Core Principles
1. **စာကြောင်းထက် workflow ကို ဦးစားပေးခြင်း:** Upload မှ download အထိ နောက်တစ်ဆင့်ကို အမြဲမြင်ရမည်။
2. **စနစ်ကျသော်လည်း မတင်းကျပ်ခြင်း:** Timestamp နှင့် cue number များကို technical rail အဖြစ် သီးခြားမြင်စေပြီး စာသားအတွက် နေရာလွတ်ပေးမည်။
3. **ယုံကြည်စိတ်ချရသော feedback:** ဖိုင်အမည်၊ cue အရေအတွက်၊ timestamp မပျက်ကြောင်းနှင့် technical terms ထိန်းသိမ်းမှုကို ပြတ်သားစွာ ပြမည်။
4. **လူသုံးစကားဖြင့် tool စကားပြောခြင်း:** မြန်မာစာ UI ကို အဓိကထားပြီး English technical terms ကို လိုအပ်သည့်နေရာတွင် မပြောင်းဘဲထားမည်။

### Color Philosophy
နွေးသော paper-white background သည် ဖတ်ရလွယ်ကူမှုနှင့် စာတည်းဖြတ်ခန်း၏ တည်ငြိမ်မှုကို ကိုယ်စားပြုမည်။ အနက်ရောင်စာသားသည် contrast အတွက် ဖြစ်ပြီး **တီလ်အစိမ်းရောင်** ကို brand signature အဖြစ် အသုံးပြုမည်—ဘာသာစကားနှစ်ခုကြား bridge လုပ်ပေးသည့် စိတ်ခံစားချက်နှင့် အမှန်တကယ် tool ဖြစ်ကြောင်းကို ဖော်ပြသည်။ လိမ္မော်ရောင်ကို အရေးကြီးသော status/attention အတွက်သာ အသုံးပြုမည်။

### Layout Paradigm
အလယ်တည့်တည့် landing page မဟုတ်ဘဲ ဘယ်ဘက်တွင် အမြဲမြင်ရမည့် brand/workflow rail နှင့် ညာဘက်တွင် ကျယ်ပြန့်သော editing workbench ပါသော asymmetric layout ဖြစ်မည်။ Upload state တွင် dashed dropzone၊ result state တွင် two-column comparison board အဖြစ် ပြောင်းလဲမည်။

### Signature Elements
- Cue number နှင့် timestamp များအတွက် monospaced technical rail။
- တီလ်ရောင် vertical progress rule နှင့် active step marker။
- အကြောင်းအရာကို card အများကြီးဖြင့် မခွဲဘဲ မျက်နှာပြင်တစ်ခုလုံးကို workbench slab အဖြစ် သုံးခြင်း။

### Interaction Philosophy
User ကို အဆင့်များစွာထဲ မပို့ဘဲ ဖိုင်တစ်ဖိုင်ထည့်ခြင်း၊ option တစ်ခုသတ်မှတ်ခြင်း၊ translate ခလုတ်တစ်ချက်နှိပ်ခြင်းဖြင့် ပြီးမြောက်စေမည်။ Drag-and-drop အပြင် keyboard ဖြင့် file picker အသုံးပြုနိုင်မည်။ ပြောင်းလဲနိုင်သော setting များသည် အရိုးရှင်းဆုံး default များဖြင့် စတင်မည်။

### Animation
Initial content သည် 220ms ease-out ဖြင့် ဘယ်ဘက်မှ တဖြည်းဖြည်းပေါ်လာမည်။ Dropzone hover သည် border နှင့် background tint ပေါ်တွင်သာ အနည်းငယ်ပြောင်းမည်။ Translate state တွင် progress bar သည် 180ms linear pulse ဖြစ်မည်။ Download success သည် button ၏ 140ms press response နှင့် status mark တစ်ချက်သာ သုံးမည်။ `prefers-reduced-motion` ကို လေးစားမည်။

### Typography System
Display နှင့် Burmese heading များအတွက် **Noto Sans Myanmar** ကို 700 weight ဖြင့် သုံးမည်။ Body copy အတွက် **Noto Sans Myanmar** 400/500 ဖြစ်ပြီး technical metadata အတွက် **IBM Plex Mono** ကို သုံးမည်။ Heading hierarchy သည် 48/56 desktop hero, 30/38 section title, 16/24 body, 12/16 metadata ဖြစ်မည်။

### Brand Essence
**စာတန်းထိုးဖိုင်ကို timestamp မပျက်ဘဲ မြန်မာလို သေသေချာချာ ပြန်လည်အသုံးချနိုင်အောင် ပြုလုပ်ပေးသော ရိုးရှင်းသည့် subtitle workbench ဖြစ်သည်။**

**Personality:** တိကျသော၊ အေးဆေးသော၊ အသုံးဝင်သော။

### Brand Voice
Headline များသည် တိုတောင်းပြီး အမိန့်ပေးသံမဟုတ်ဘဲ အလုပ်လုပ်သည့်အခိုက်အတန့်ကို ရှင်းပြသည့် အသံဖြစ်မည်။ CTA များသည် လုပ်ဆောင်ချက်ကို တိုက်ရိုက်ပြမည်။

- “စာတန်းထိုးကို ထည့်ပါ။ အချိန်ကုဒ်ကို ကျွန်ုပ်တို့ မထိပါ။”
- “မြန်မာစာဖြင့် ပြန်ယူရန် အဆင်သင့်ဖြစ်ပါပြီ”

### Wordmark & Logo
Logo mark သည် subtitle cue bracket နှစ်ခုကို တီလ်ရောင် bridge stroke တစ်ခုဖြင့် ချိတ်ထားသည့် bold graphic symbol ဖြစ်မည်။ စာသားမပါဘဲ favicon အဖြစ်လည်း ဖတ်ရလွယ်ကူစေရန် ပြတ်သားသော geometry ကို သုံးမည်။

### Signature Brand Color
**Workbench Teal — #0E827B**

## Implementation Reminder
ဒီ design philosophy ကို `client/src/index.css`, `client/src/App.tsx`, `client/src/pages/Home.tsx`, `client/src/lib/srt.ts` တို့တွင် file-specific comment ဖြင့် ထည့်သွင်းထားမည်။ ဆုံးဖြတ်ချက်တိုင်းတွင် “ဒါက ဘာသာပြန် အလုပ်ရုံ၏ တိကျမှုနဲ့ ရှင်းလင်းမှုကို တိုးစေသလား၊ ဒါမှမဟုတ် လျော့စေသလား” ဟု ပြန်စစ်မည်။

## Style Decisions

- Primary UI language rule: Burmese leads all user-facing headings, instructions, steps, and CTAs; English remains for technical terms such as SRT, UTF-8, timestamp, browser, file picker, and download formats.
- Workflow rail rule: the left rail is the product spine, with a continuous Workbench Teal progress rule connecting upload, translate, and download states.
- Visual motif rule: decorative imagery comes from subtitle artifacts—cue numbers, timestamps, brackets, line breaks, and comparison columns—not generic technology imagery.
- Workbench slab rule: the operational surface must feel like one broad translation desk, integrating file metadata, status, preview, and the next action rather than floating as a generic landing-page card.
