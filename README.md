# SRT Burmese Translator

Database မသုံးဘဲ SRT subtitle file ကို upload လုပ်ပြီး timestamp နှင့် cue number မပျက်ဘဲ မြန်မာလို ဘာသာပြန်ကာ `.my.srt` အဖြစ် download လုပ်နိုင်သော web workbench ဖြစ်သည်။ UI သည် Burmese-first ဖြစ်ပြီး technology terms များကို placeholder protection ဖြင့် မပြောင်းအောင် ထိန်းထားသည်။

## Architecture

| အပိုင်း | လုပ်ဆောင်ချက် |
|---|---|
| React frontend | SRT parsing, cue preview, upload, progress, validation, download |
| Cloudflare Worker | `/api/translate` endpoint; Workers AI translation; no database |
| Workers AI | `@cf/meta/m2m100-1.2b` model ဖြင့် English → Burmese translation |
| Storage | Server-side file storage မရှိပါ။ SRT ဖိုင်သည် browser memory ထဲတွင်သာ အလုပ်လုပ်သည်။ |

Frontend သည် timestamp line များကို model ထံ မပို့ဘဲ subtitle text သီးသန့်ကိုသာ ပို့သည်။ Output ပြန်ရောက်သောအခါ cue count နှင့် timestamp များကို auto-check လုပ်ပြီး မကိုက်ညီလျှင် download မပေးပါ။

## Local setup

```bash
pnpm install
pnpm dev
```

Default frontend endpoint သည် `/api/translate` ဖြစ်သည်။ Local testing အတွက် `.env` ထဲတွင် `VITE_TRANSLATE_ENDPOINT=http://localhost:8787/api/translate` လို သတ်မှတ်နိုင်သည်။

## Cloudflare deployment

၁။ Repository ကို GitHub တွင် push လုပ်ပြီး Cloudflare Pages တွင် repository ကို connect လုပ်ပါ။ Build command ကို `pnpm build`၊ output directory ကို `dist/public` (သို့မဟုတ် Cloudflare Pages configuration အတိုင်း Vite output) သတ်မှတ်ပါ။

၂။ `cloudflare-worker.js` ကို Cloudflare Worker အဖြစ် deploy လုပ်ပြီး Workers AI binding အမည်ကို `AI` သတ်မှတ်ပါ။ Worker route ကို `/api/translate` အဖြစ် Pages domain နှင့် ချိတ်ပါ။ Cloudflare dashboard တွင် Workers AI ကို enable လုပ်ပြီး model access ရှိကြောင်း စစ်ပါ။

၃။ Pages project environment variable တွင် `VITE_TRANSLATE_ENDPOINT=/api/translate` ထားပါ။ သီးခြား Worker domain သုံးလျှင် absolute HTTPS endpoint သတ်မှတ်နိုင်သည်။ CORS allow-list ကို production Pages hostname နှင့်သာ ကန့်သတ်ရန် Worker ရှိ origin check ကို ပြင်ဆင်ပါ။

၄။ Cloudflare deployment ပြီးလျှင် English subtitle တစ်ခု၊ multi-line cue တစ်ခု၊ `JavaScript`, `API`, `Netflix` စသည့် terms ပါသော cue တစ်ခု၊ နှင့် timestamp အမျိုးမျိုးပါသော file တစ်ခုဖြင့် စမ်းသပ်ပါ။ Download မလုပ်မီ UI တွင် `timestamps verified` ပြသရမည်။

## GitHub credential security

Chat ထဲတွင် မျှဝေထားသော GitHub personal access token ကို အသုံးမပြုပါနှင့်။ GitHub Settings → Developer settings → Personal access tokens သို့ဝင်ပြီး ထို token ကို ချက်ချင်း revoke လုပ်ကာ လိုအပ်ပါက permissions အနည်းဆုံးဖြင့် token အသစ်တစ်ခု ဖန်တီးပါ။ Token ကို source code၊ `.env` committed file၊ Cloudflare Pages public variable၊ သို့မဟုတ် README ထဲတွင် မထည့်ပါနှင့်။

## Limitations

ဘာသာပြန်အရည်အသွေးသည် Workers AI model နှင့် မူရင်း subtitle ၏ context ပေါ် မူတည်ပါသည်။ Technical terms များကို exact placeholder protection ဖြင့် ထိန်းထားသော်လည်း proper names နှင့် ambiguous dialogue များကို လူက preview ပြန်စစ်သင့်သည်။
