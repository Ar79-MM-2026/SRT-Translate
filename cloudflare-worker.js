/* Cloudflare Worker adapter for /api/translate.
   Design reminder: the workbench never sends timestamps or cue numbers to the model; only subtitle text crosses this boundary.
   Bind Workers AI as `AI` and deploy this file as a Worker or Pages Function route. */

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
    const origin = request.headers.get('Origin');
    if (origin && !new URL(origin).hostname.endsWith('.pages.dev')) return json({ error: 'Origin not allowed' }, 403);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const technicalTerms = Array.isArray(body.technicalTerms) ? body.technicalTerms.filter((term) => typeof term === 'string').slice(0, 80) : [];
    if (!text) return json({ error: 'Text is required' }, 400);
    if (text.length > 5000) return json({ error: 'Cue text is too long' }, 413);

    const replacements = technicalTerms.map((term, index) => ({ term, token: `__SRT_TERM_${index}__` }));
    const protectedText = replacements.reduce((value, item) => value.split(item.term).join(item.token), text);
    const prompt = `Translate the following subtitle text into natural, concise Burmese (Myanmar language). Preserve line breaks where possible. Do not add explanations, quotation marks, speaker labels, or markdown. Keep every token beginning with __SRT_TERM_ exactly unchanged.\n\nSubtitle text:\n${protectedText}`;

    try {
      const result = await env.AI.run('@cf/meta/m2m100-1.2b', { text: protectedText, source_lang: 'eng', target_lang: 'mya' });
      let translation = result?.translated_text?.trim();
      for (const item of replacements) translation = translation.split(item.token).join(item.term);
      if (!translation) return json({ error: 'Model returned no translation' }, 502);
      return json({ translation });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : 'Translation failed' }, 502);
    }
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' } });
}
