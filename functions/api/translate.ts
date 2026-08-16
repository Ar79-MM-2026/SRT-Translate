/* Cloudflare Pages Function for /api/translate.
   No database or file storage is used. Only the current cue text is sent to Workers AI. */

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  const technicalTerms = Array.isArray(body?.technicalTerms)
    ? body.technicalTerms.filter((term: unknown) => typeof term === 'string').slice(0, 80)
    : [];
  const neighboringContext = typeof body?.context === 'string' ? body.context.slice(0, 2400) : '';
  if (!text) return json({ error: 'Text is required' }, 400);
  if (text.length > 5000) return json({ error: 'Cue text is too long' }, 413);
  if (!env?.AI?.run) return json({ error: 'Cloudflare Workers AI binding AI is not configured' }, 500);

  const replacements = technicalTerms.map((term: string, index: number) => ({ term, token: `⟦SRT_TERM_${index}⟧` }));
  const protectedText = replacements.reduce((value: string, item: { term: string; token: string }) => value.split(item.term).join(item.token), text);
  const protectedContext = replacements.reduce((value: string, item: { term: string; token: string }) => value.split(item.term).join(item.token), neighboringContext);
  const glossary = replacements.length ? replacements.map((item) => `${item.token} = ${item.term}`).join('\n') : 'မရှိပါ';

  try {
    const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: 'You are a professional Burmese subtitle translator. Translate English dialogue into natural, conversational Myanmar Unicode. Preserve meaning, emotion, speaker intent, and concise subtitle style. Do not translate names, product names, programming languages, commands, file extensions, acronyms, or technical terms. Never add explanations, notes, labels, numbering, timestamps, quotation marks, or alternative translations. Return only the Burmese subtitle text. Keep line breaks when they help readability.',
        },
        {
          role: 'user',
          content: `Translate this subtitle into Burmese. Use the neighboring subtitles only to understand context; translate only the TARGET text.\n\nNEIGHBORING CONTEXT:\n${protectedContext || 'မရှိပါ'}\n\nLOCKED TECHNICAL TERMS:\n${glossary}\n\nTARGET TEXT:\n${protectedText}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 512,
    });
    let translation = typeof result?.response === 'string'
      ? result.response.trim()
      : typeof result?.result === 'string'
        ? result.result.trim()
        : '';
    translation = cleanTranslation(translation);
    for (const item of replacements) {
      translation = translation.split(item.token).join(item.term);
      translation = translation.split(item.token.replaceAll('⟦', '[').replaceAll('⟧', ']')).join(item.term);
    }
    if (!translation) return json({ error: 'Workers AI returned no translation' }, 502);
    return json({ translation });
  } catch (error) {
    console.error('Workers AI translation error', error);
    return json({ error: error instanceof Error ? error.message : 'Workers AI translation failed' }, 502);
  }
}

function corsHeaders() {
  return {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type',
    'content-type': 'application/json; charset=utf-8',
  };
}

function cleanTranslation(value: string) {
  return value
    .replace(/^```(?:text|plaintext|မြန်မာ)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^(?:translation|ဘာသာပြန်)\s*:\s*/i, '')
    .replace(/^['“”]|['“”]$/g, '')
    .trim();
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders() });
}
