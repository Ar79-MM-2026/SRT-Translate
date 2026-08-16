import { describe, expect, it } from "vitest";
import { parseSrt, serializeSrt, validateOutput } from "../client/src/lib/srt";
import { protectTechnicalTerms, restoreTechnicalTerms } from "./translation";

describe("Manus translation safeguards", () => {
  it("protects technical terms and restores them exactly", () => {
    const source = "Install React and configure TypeScript in VSCode.";
    const protectedValue = protectTechnicalTerms(source, ["TypeScript", "VSCode", "React"]);

    expect(protectedValue.protectedText).not.toContain("TypeScript");
    expect(protectedValue.protectedText).not.toContain("VSCode");
    expect(restoreTechnicalTerms("မြန်မာ " + protectedValue.protectedText, protectedValue.replacements))
      .toBe("မြန်မာ Install React and configure TypeScript in VSCode.");
  });

  it("keeps cue numbers and timestamps unchanged through serialization", () => {
    const source = "1\n00:00:01,000 --> 00:00:02,000\nHello\n\n2\n00:00:03,000 --> 00:00:04,000\nWorld\n";
    const cues = parseSrt(source);
    const translated = cues.map(cue => ({ ...cue, text: `မြန်မာ ${cue.text}` }));

    expect(validateOutput(cues, translated)).toEqual([]);
    expect(serializeSrt(translated)).toContain("1\n00:00:01,000 --> 00:00:02,000");
    expect(serializeSrt(translated)).toContain("2\n00:00:03,000 --> 00:00:04,000");
  });
});
