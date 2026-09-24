import { createFileRoute } from "@tanstack/react-router";

const MODEL = "gemini-3.5-live-translate-preview";
const MODEL_RESOURCE = `models/${MODEL}`;

const SUPPORTED_LANGUAGES = new Set([
  "af", "ak", "sq", "am", "ar", "hy", "az", "eu", "be", "bn", "bg", "my", "ca",
  "zh-Hans", "zh-Hant", "hr", "cs", "da", "nl", "en", "et", "fil", "fi", "fr", "gl",
  "ka", "de", "el", "gu", "ha", "he", "hi", "hu", "is", "id", "it", "ja", "jv", "kn",
  "kk", "km", "rw", "ko", "lo", "lv", "lt", "mk", "ms", "ml", "mr", "mn", "ne", "no",
  "nb", "fa", "pl", "pt-BR", "pt-PT", "pa", "ro", "ru", "sr", "sd", "si", "sk", "sl",
  "es", "su", "sw", "sv", "ta", "te", "th", "tr", "uk", "ur", "uz", "vi", "zu",
]);

type TokenResponse = {
  name?: string;
  expireTime?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const Route = createFileRoute("/api/orbit-translation-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let targetLanguageCode = "";
        try {
          const body = (await request.json()) as { targetLanguageCode?: unknown };
          targetLanguageCode =
            typeof body.targetLanguageCode === "string" ? body.targetLanguageCode : "";
        } catch {
          return json({ error: "Invalid request body" }, 400);
        }

        if (!SUPPORTED_LANGUAGES.has(targetLanguageCode)) {
          return json({ error: "Unsupported target language" }, 400);
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          return json({ error: "Translation service is not configured" }, 503);
        }

        const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        const newSessionExpireTime = new Date(Date.now() + 60 * 1000).toISOString();

        let response: Response;
        try {
          response = await fetch("https://generativelanguage.googleapis.com/v1beta/auth_tokens", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              uses: 1,
              expireTime,
              newSessionExpireTime,
              liveConnectConstraints: {
                model: MODEL_RESOURCE,
                config: {
                  responseModalities: ["AUDIO"],
                  inputAudioTranscription: {},
                  outputAudioTranscription: {},
                  translationConfig: {
                    targetLanguageCode,
                    echoTargetLanguage: true,
                  },
                },
              },
            }),
          });
        } catch (error) {
          console.error("[orbit-translation] Failed to reach Gemini token service", error);
          return json({ error: "Translation service is temporarily unavailable" }, 502);
        }

        if (!response.ok) {
          console.error("[orbit-translation] Gemini token service returned", response.status);
          return json({ error: "Translation session could not be created" }, 502);
        }

        const token = (await response.json()) as TokenResponse;
        if (!token.name) {
          console.error("[orbit-translation] Gemini token response did not include a token name");
          return json({ error: "Translation session could not be created" }, 502);
        }

        return json({
          token: token.name,
          model: MODEL,
          expiresAt: token.expireTime ?? expireTime,
        });
      },
    },
  },
});
