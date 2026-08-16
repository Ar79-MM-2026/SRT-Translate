import { invokeLLM } from "./_core/llm";

const MODEL = "gpt-5-mini";
const PLACEHOLDER_PREFIX = "SRTTERM";
const PLACEHOLDER_SUFFIX = "END";

export type TranslationRequest = {
  text: string;
  technicalTerms?: string[];
  context?: string;
  targetLanguage?: string;
};

export function protectTechnicalTerms(text: string, technicalTerms: string[]) {
  const terms = Array.from(
    new Set(technicalTerms.map(term => term.trim()).filter(Boolean)),
  ).sort((a, b) => b.length - a.length);
  const replacements: Array<{ placeholder: string; term: string }> = [];
  let protectedText = text;

  for (let index = 0; index < terms.length; index += 1) {
    const term = terms[index];
    const placeholder = `${PLACEHOLDER_PREFIX}${index}${PLACEHOLDER_SUFFIX}`;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const expression = new RegExp(escaped, "g");
    if (!expression.test(protectedText)) continue;
    protectedText = protectedText.replace(expression, placeholder);
    replacements.push({ placeholder, term });
  }

  return { protectedText, replacements };
}

export function restoreTechnicalTerms(
  text: string,
  replacements: Array<{ placeholder: string; term: string }>,
) {
  return replacements.reduce(
    (result, { placeholder, term }) => result.split(placeholder).join(term),
    text,
  );
}

function cleanModelText(value: string) {
  return value
    .trim()
    .replace(/^```(?:text|plaintext)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .replace(/^translation\s*:\s*/i, "")
    .trim();
}

function contentToText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((part): part is { type: "text"; text: string } =>
        Boolean(part && typeof part === "object" && "type" in part && "text" in part && part.type === "text" && typeof part.text === "string"),
      )
      .map(part => part.text)
      .join("\n");
  }
  return "";
}

export async function translateSubtitleCue({
  text,
  technicalTerms = [],
  context = "",
  targetLanguage = "my",
}: TranslationRequest) {
  const normalizedText = text.trim();
  if (!normalizedText) throw new Error("Subtitle text is empty");
  if (normalizedText.length > 12_000) throw new Error("Subtitle cue is too long");

  const { protectedText, replacements } = protectTechnicalTerms(normalizedText, technicalTerms);
  const safeContext = context.trim().slice(0, 6_000);
  const response = await invokeLLM({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: [
          "You are a professional English-to-Burmese subtitle translator.",
          "Translate only the subtitle text into natural, clear Myanmar Burmese Unicode.",
          "Preserve the speaker's meaning, tone, names, numbers, punctuation, and line breaks where practical.",
          "Keep every protected token such as SRTTERM0END exactly unchanged and in the same sentence context; never translate, delete, or add protected tokens.",
          "Do not add explanations, notes, quotation marks, labels, markdown, or the original English.",
          `The target language code is ${targetLanguage}; use Burmese script, not transliteration.`,
        ].join("\n"),
      },
      {
        role: "user",
        content: [
          safeContext ? `Neighboring subtitle context (use only to resolve meaning):\n${safeContext}` : "",
          `Subtitle to translate:\n${protectedText}`,
        ].filter(Boolean).join("\n\n"),
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "subtitle_translation",
        strict: true,
        schema: {
          type: "object",
          properties: { translation: { type: "string" } },
          required: ["translation"],
          additionalProperties: false,
        },
      },
    },
  });

  const rawContent = response.choices[0]?.message?.content;
  const rawText = contentToText(rawContent);
  if (!rawText) throw new Error("Manus model returned no translation");

  let translation = rawText;
  try {
    const parsed = JSON.parse(rawText) as { translation?: unknown };
    if (typeof parsed.translation === "string") translation = parsed.translation;
  } catch {
    // Some compatible models may return the schema value as plain text.
  }

  const restored = restoreTechnicalTerms(cleanModelText(translation), replacements);
  if (!restored) throw new Error("Manus model returned an empty translation");
  return restored;
}

export const translationModel = MODEL;
