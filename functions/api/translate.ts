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
  if (!text) return json({ error: 'Text is required' }, 400);
  if (text.length > 5000) return json({ error: 'Cue text is too long' }, 413);
  if (!env?.AI?.run) return json({ error: 'Cloudflare Workers AI binding AI is not configured' }, 500);

  const replacements = technicalTerms.map((term: string, index: number) => ({ term, token: `__SRT_TERM_${index}__` }));
  const protectedText = replacements.reduce((value: string, item: { term: string; token: string }) => value.split(item.term).join(item.token), text);

  try {
    const result = await env.AI.run('@cf/meta/m2m100-1.2b', {
      text: protectedText,
      source_lang: 'eng',
      target_lang: 'mya',
    });
    let translation = typeof result?.translated_text === 'string' ? result.translated_text.trim() : '';
    for (const item of replacements) translation = translation.split(item.token).join(item.term);
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

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders() });
}
