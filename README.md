# SRT Burmese Translator

Database မသုံးဘဲ SRT subtitle file ကို upload လုပ်ပြီး timestamp နှင့် cue number မပျက်ဘဲ မြန်မာလို ဘာသာပြန်ကာ `.my.srt` အဖြစ် download လုပ်နိုင်သော web workbench ဖြစ်သည်။ UI သည် Burmese-first ဖြစ်ပြီး technology terms များကို server-side placeholder protection ဖြင့် မပြောင်းအောင် ထိန်းထားသည်။

## Architecture

| အပိုင်း | လုပ်ဆောင်ချက် |
|---|---|
| React frontend | SRT parsing, cue preview, upload, progress, output validation, download |
| Express server | Stateless `POST /api/translate` route; request validation and Manus LLM proxy |
| Manus built-in LLM | `gpt-5-mini` ဖြင့် English → Burmese translation; user-provided Gemini or other third-party key မလိုပါ |
| Database | မသုံးပါ။ User subtitle files၊ translation history၊ SRT bytes များကို မသိမ်းဆည်းပါ |
| File storage | မသုံးပါ။ Upload ဖိုင်သည် browser memory ထဲတွင်သာရှိပြီး cue text သီးသန့်ကို translation request အဖြစ် ပို့သည် |

Frontend သည် timestamp line နှင့် cue number များကို model ထံ မပို့ဘဲ subtitle text သီးသန့်ကိုသာ ပို့သည်။ Output ပြန်ရောက်သောအခါ cue count၊ cue number နှင့် start/end timestamp များကို auto-check လုပ်ပြီး မကိုက်ညီလျှင် download မပေးပါ။

## Manus translation flow

Server က `BUILT_IN_FORGE_API_URL` နှင့် `BUILT_IN_FORGE_API_KEY` ကို platform environment မှ အသုံးပြုသည်။ Secret သည် client bundle ထဲသို့ မဝင်ပါ။ Technical terms များကို `SRTTERM0END` ကဲ့သို့ deterministic placeholders ဖြင့် model request မတိုင်မီ အစားထိုးပြီး response ပြန်လာသောအခါ မူရင်းစာလုံးပေါင်းအတိုင်း restore လုပ်သည်။ Structured JSON response ကို အသုံးပြုထားသောကြောင့် model ၏ရှင်းလင်းချက်၊ markdown fence နှင့် မူရင်းစာသား ထပ်ထည့်မှုများကို လျှော့ချနိုင်သည်။

## Local setup

```bash
pnpm install
pnpm dev
```

Development server သည် `http://localhost:3000` တွင် frontend နှင့် `/api/translate` route ကို တစ်ခုတည်းအဖြစ် run လုပ်သည်။ Built-in Manus environment variables မရှိသော local machine တွင် translation request သည် အလုပ်မလုပ်နိုင်သော်လည်း parser၊ serializer နှင့် placeholder tests များကို ဆက်လက် run လုပ်နိုင်သည်။

## Verification

```bash
pnpm check
pnpm test
pnpm build
```

## Deployment guidance

ဤ version သည် server-side Manus credentials လိုအပ်သောကြောင့် static-only Cloudflare Pages deployment တစ်ခုတည်းဖြင့် `/api/translate` ကို မrun နိုင်ပါ။ Cloudflare Pages သည် frontend ကို host လုပ်နိုင်သော်လည်း Manus built-in credential များကို ထို Pages Function တွင် အလိုအလျောက် မပေးပါ။ Production အတွက် Manus fullstack hosting တွင် deploy လုပ်ခြင်းသည် အလွယ်ဆုံးနည်းလမ်းဖြစ်ပြီး custom domain သို့မဟုတ် Cloudflare DNS ကို ဆက်သုံးနိုင်သည်။ Cloudflare ကို frontend host အဖြစ် မဖြစ်မနေသုံးမည်ဆိုလျှင် Cloudflare Worker သည် Manus server endpoint ကို authenticated proxy အဖြစ် ခေါ်ရမည်၊ ထို proxy အတွက် သီးခြား secret configuration နှင့် operational setup လိုအပ်မည်။

GitHub repository ကို build source အဖြစ် ဆက်သုံးနိုင်သည်။ Publish မလုပ်မီ project checkpoint တစ်ခု create လုပ်ပြီး Management UI ၏ **Publish** ခလုတ်ကို အသုံးပြုပါ။

## Security note

Chat ထဲတွင် မျှဝေထားသော GitHub personal access token ကို အသုံးမပြုပါနှင့်။ GitHub Settings → Developer settings → Personal access tokens သို့ဝင်ပြီး ထို token ကို revoke လုပ်ကာ လိုအပ်ပါက permissions အနည်းဆုံးဖြင့် token အသစ်တစ်ခု ဖန်တီးပါ။ Token ကို source code၊ `.env` committed file၊ public environment variable၊ သို့မဟုတ် README ထဲတွင် မထည့်ပါနှင့်။

## Limitations

ဘာသာပြန်အရည်အသွေးသည် Manus model နှင့် မူရင်း subtitle ၏ context ပေါ် မူတည်ပါသည်။ Technical terms များကို exact placeholder protection ဖြင့် ထိန်းထားသော်လည်း proper names၊ sarcasm နှင့် ambiguous dialogue များကို လူက preview ပြန်စစ်သင့်သည်။ Cue တစ်ခုချင်းစီကို server-side model request အဖြစ် ပြန်ဆိုသောကြောင့် cue အရေအတွက်များသောဖိုင်များတွင် အချိန်နှင့် model usage ပိုမိုလိုအပ်နိုင်သည်။
