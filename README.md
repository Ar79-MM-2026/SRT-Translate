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

၁။ Repository root ကို GitHub မှ Cloudflare Pages Git integration ဖြင့် connect လုပ်ပါ။ Build command ကို `pnpm install --frozen-lockfile && pnpm build`၊ output directory ကို `dist/public` သတ်မှတ်ပါ။ **`dist/public` folder တစ်ခုတည်းကို Direct Upload မလုပ်ပါနှင့်**—ထိုနည်းလမ်းတွင် root-level `functions/` directory မပါသဖြင့် `/api/translate` သည် SPA `index.html` ကို ပြန်ပေးမည်။

၂။ Repository root ထဲက `functions/api/translate.ts` ကို Cloudflare Pages က `/api/translate` အဖြစ် route လုပ်ပေးမည်။ Cloudflare Pages project → Settings → Functions → Workers AI bindings တွင် binding name ကို **`AI`** ထည့်ပါ။ `wrangler.toml` ထဲက binding သည် reference သာဖြစ်ပြီး Pages dashboard binding ကို အစားမထိုးနိုင်ပါ။ `cloudflare-worker.js` သည် သီးခြား Worker deployment သုံးလိုသူများအတွက် adapter အဖြစ် ဆက်ထားပါသည်။

၃။ Pages project environment variable တွင် `VITE_TRANSLATE_ENDPOINT=/api/translate` ထားပါ။ Deploy ပြီးနောက် browser Network tab တွင် POST `/api/translate` response `content-type: application/json` ဖြစ်ရမည်။ HTML ပြန်လာလျှင် Git integration မဟုတ်ဘဲ static Direct Upload သုံးထားခြင်း သို့မဟုတ် Pages project root မှ `functions/` မပါလာခြင်း ဖြစ်သည်။

၄။ Cloudflare deployment ပြီးလျှင် browser cache ကို refresh လုပ်ပြီး English subtitle တစ်ခု၊ multi-line cue တစ်ခု၊ `JavaScript`, `API`, `Netflix` စသည့် terms ပါသော cue တစ်ခု၊ နှင့် timestamp အမျိုးမျိုးပါသော file တစ်ခုဖြင့် စမ်းသပ်ပါ။ `/api/translate` request သည် 200 ပြန်ရပြီး Download မလုပ်မီ UI တွင် `timestamp စစ်ပြီး` ပြသရမည်။ 500 error ဆက်ရှိနေပါက Pages → Settings → Functions/Workers AI ထဲတွင် `AI` binding ရှိမရှိ စစ်ပါ။

## GitHub credential security

Chat ထဲတွင် မျှဝေထားသော GitHub personal access token ကို အသုံးမပြုပါနှင့်။ GitHub Settings → Developer settings → Personal access tokens သို့ဝင်ပြီး ထို token ကို ချက်ချင်း revoke လုပ်ကာ လိုအပ်ပါက permissions အနည်းဆုံးဖြင့် token အသစ်တစ်ခု ဖန်တီးပါ။ Token ကို source code၊ `.env` committed file၊ Cloudflare Pages public variable၊ သို့မဟုတ် README ထဲတွင် မထည့်ပါနှင့်။

## Limitations

ဘာသာပြန်အရည်အသွေးသည် Workers AI model နှင့် မူရင်း subtitle ၏ context ပေါ် မူတည်ပါသည်။ Technical terms များကို exact placeholder protection ဖြင့် ထိန်းထားသော်လည်း proper names နှင့် ambiguous dialogue များကို လူက preview ပြန်စစ်သင့်သည်။
