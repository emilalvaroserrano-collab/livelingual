# LiveLingual — Orbit Meeting

A branded real-time video meeting experience built on **Jitsi Meet**, with an integrated **AI live voice translator** for incoming participant audio.

The application keeps the normal Jitsi meeting flow and controls while adding an Orbit-branded prejoin experience and a translator tool directly inside the meeting toolbar.

## Core Features

- Jitsi-based WebRTC video meetings
- Orbit Meeting branding
- Custom prejoin screen
- Microphone and camera preview before joining
- Native Jitsi meeting toolbar and controls
- Built-in **Translator** toolbar button
- Right-side live translation panel
- Per-user target language selection
- Translation of **remote participant audio only**
- Live incoming speech transcription
- Live translated speech transcription
- Automatic translated-audio playback
- Original speaker audio ducking during translated playback
- Automatic Live API reconnect handling
- Server-issued short-lived translation tokens
- Vercel/Nitro production support
- Responsive desktop and mobile UI

---

## How the Meeting Flow Works

```text
Home
  │
  ▼
/meet/:room
  │
  ├── Camera preview
  ├── Microphone preview
  ├── Display name
  └── Join Meeting
         │
         ▼
      /:room
         │
         ▼
  Branded Jitsi conference
         │
         ├── Mic
         ├── Camera
         ├── Screen sharing
         ├── Chat
         ├── Participants
         ├── More controls
         └── Translator
                 │
                 ▼
          Live Translator sidebar
```

The custom prejoin route is intentionally separate from the real Jitsi room.

- `/meet/design-review` → Orbit prejoin UI
- `/design-review` → actual Jitsi conference

This separation prevents Jitsi from interpreting `/meet/<room>` as a tenant-style conference path.

---

## Live Translator

Inside a conference, the Jitsi bottom toolbar includes a native custom **Translator** button.

Selecting it opens a right-side panel where the listener chooses the language they want to hear.

Each participant controls their own target language independently.

### Translation pipeline

```text
Remote participant WebRTC audio
        │
        ▼
Jitsi remoteAudio_* media tracks
        │
        ▼
Web Audio API mixer
        │
        ▼
16 kHz PCM
        │
        ▼
Gemini Live Translation
gemini-3.5-live-translate-preview
        │
        ├── Incoming transcript
        ├── Translated transcript
        └── 24 kHz translated PCM audio
                    │
                    ▼
              Local playback
```

Only incoming remote-participant tracks are selected:

```text
audio[id^="remoteAudio_"]
```

The local user's microphone is not added to the translation mixer.

### Audio behavior

While translated speech is being played:

- normal remote audio is reduced to approximately 15% volume
- on iOS, where programmatic element volume control is restricted, the original stream is temporarily muted
- original volume/mute state is restored after translated playback finishes

---

## Supported Translation Languages

The current translator exposes the model's configured target-language list, including:

- English
- Dutch
- Filipino
- French
- German
- Spanish
- Portuguese
- Italian
- Japanese
- Korean
- Simplified Chinese
- Traditional Chinese
- Hindi
- Arabic
- Russian
- Ukrainian
- Vietnamese
- Indonesian
- Malay
- Thai
- Turkish
- Swedish
- Danish
- Norwegian
- Finnish
- Polish
- Romanian
- Greek
- Hebrew
- Persian
- Bengali
- Tamil
- Telugu

and many additional languages available in the application's language selector.

The selected target is stored locally in the browser so the listener's preference survives reloads.

---

## Security Model

The permanent translation API credential is **never embedded in the browser JavaScript**.

The flow is:

```text
Browser
   │
   │ POST /api/orbit-translation-token
   │ { targetLanguageCode }
   ▼
LiveLingual server
   │
   │ GEMINI_API_KEY
   ▼
Live API token service
   │
   ▼
Short-lived constrained token
   │
   ▼
Browser → Live WebSocket
```

The server creates a one-use short-lived token constrained to:

- the translation model
- audio responses
- transcription
- the selected target language

### Required environment variable

```bash
GEMINI_API_KEY=your_api_key
```

Do **not** add the real key to source control or expose it through a `VITE_*` variable.

---

## Technology Stack

### Application

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- Vite
- Tailwind CSS
- Zustand
- Nitro

### Meeting engine

- Jitsi Meet
- WebRTC
- Jitsi XMPP/BOSH/WebSocket infrastructure

### Translation

- Gemini Live Translation
- WebSocket streaming
- Web Audio API
- PCM audio processing

### Deployment

- Vercel-compatible Nitro build

---

## Project Structure

```text
livelingual/
├── src/
│   ├── components/
│   │   └── orbit/
│   │       ├── prejoin.tsx
│   │       ├── media.tsx
│   │       └── ...
│   │
│   ├── routes/
│   │   ├── index.tsx
│   │   ├── meet.$room.tsx
│   │   └── api.orbit-translation-token.ts
│   │
│   └── lib/
│       ├── meeting-store.ts
│       └── rooms.ts
│
├── vendor/
│   └── jitsi/
│       ├── index.html
│       ├── orbit-translator.js
│       ├── images/
│       └── lang/
│
├── server/
│   └── middleware/
│       └── z-orbit-jitsi.ts
│
├── scripts/
│   ├── jitsi-brand.mjs
│   ├── jitsi-brand-plugin.mjs
│   ├── jitsi-brand.test.mjs
│   └── copy-jitsi-assets.mjs
│
├── vite.config.ts
├── package.json
└── README.md
```

---

## Jitsi Integration

The repository does not rebuild the entire Jitsi frontend from source.

Instead, it serves a branded Jitsi HTML shell and proxies the required meeting assets and signaling endpoints.

### Meeting host

The current conference backend is configured for:

```text
meet.ffmuc.net
```

### Proxied signaling paths

The application forwards Jitsi traffic for endpoints such as:

```text
/http-bind
/xmpp-websocket
/conference-request
/_unlock
```

This allows the meeting client to remain on the LiveLingual/Orbit origin while Jitsi signaling is forwarded to the configured meeting service.

### Jitsi assets

`scripts/jitsi-brand.mjs` serves local branded assets and retrieves other required Jitsi assets through the configured CDN.

The custom translator client is served locally as:

```text
/orbit-translator.js
```

---

## Local Development

### Requirements

- Node.js 20+ recommended
- npm
- a valid translation API key for the live translator

### Install

```bash
git clone https://github.com/emilalvaroserrano-collab/livelingual.git
cd livelingual
npm install
```

### Configure environment

Create a local `.env` file:

```bash
GEMINI_API_KEY=your_api_key
```

### Start development server

```bash
npm run dev
```

Development runs on:

```text
http://localhost:8080
```

---

## Build

```bash
npm run build
```

The production build:

1. builds the TanStack/Vite application
2. copies the vendored Jitsi assets into the Nitro/Vercel output
3. runs the database migration command when applicable

---

## Preview Production Build

```bash
npm run preview:restart
```

Production preview runs on:

```text
http://127.0.0.1:8081
```

Stop it with:

```bash
npm run preview:stop
```

---

## Testing

Run the repository test suite:

```bash
npm test
```

TypeScript:

```bash
npm run typecheck
```

Lint:

```bash
npm run lint
```

The Jitsi regression tests include checks that:

- `/meet/*` remains controlled by the Orbit prejoin application
- actual single-segment conference routes remain Jitsi routes
- `/orbit-translator.js` is served correctly
- the permanent translation credential is not embedded in the translator bundle

---

## Vercel Deployment

The repository is configured for a Nitro Vercel target.

Before deployment, add the server environment variable:

```text
GEMINI_API_KEY
```

Then deploy the `main` branch using the normal Vercel Git integration or CLI workflow.

The environment variable must exist in the environment where the server route executes.

If it is missing, the translator token endpoint returns:

```text
Translation service is not configured
```

---

## Translator Troubleshooting

### Translator button is visible but translation does not start

Check:

1. `GEMINI_API_KEY` exists on the server.
2. `POST /api/orbit-translation-token` returns a token.
3. the browser can open the Live API WebSocket.
4. another participant is actually publishing an audio track.

### Translator says it is waiting for another participant

This is expected when there are no live remote audio tracks.

The translator deliberately ignores the local microphone.

### Translation audio is delayed

Some latency is expected because the pipeline includes:

```text
WebRTC receive
→ PCM conversion
→ network streaming
→ speech understanding
→ translation
→ generated audio
→ playback
```

The client sends small PCM chunks to keep latency low while maintaining stable streaming.

### Translator disconnects

The client automatically attempts to create a new translation session and reconnect.

---

## Important Files

### `vendor/jitsi/orbit-translator.js`

Browser-side translator controller.

Responsible for:

- Translator sidebar
- language selection
- remote Jitsi audio capture
- PCM conversion
- Live WebSocket session
- transcription updates
- translated audio playback
- audio ducking
- reconnect logic

### `src/routes/api.orbit-translation-token.ts`

Server-side token broker.

Responsible for:

- validating the requested target language
- reading `GEMINI_API_KEY`
- requesting a constrained short-lived Live token
- returning only the temporary token to the browser

### `scripts/jitsi-brand.mjs`

Jitsi request and asset layer.

Responsible for:

- branded Jitsi HTML
- local Orbit assets
- Jitsi CDN assets
- meeting signaling proxy
- translator asset delivery

### `server/middleware/z-orbit-jitsi.ts`

Production middleware that applies the Jitsi proxy/branding behavior to the Nitro deployment.

---

## Current Architecture Notes

The application currently uses a hybrid architecture:

```text
TanStack application
        +
Branded upstream Jitsi client
        +
Jitsi meeting backend
        +
Local Orbit translator extension
        +
Gemini Live Translation
```

This keeps the established Jitsi meeting UX while allowing LiveLingual-specific functionality to be developed independently around it.

---

## Development Rules

When modifying the meeting integration:

- keep `/meet/*` reserved for the Orbit prejoin route
- keep actual conference URLs single-segment
- do not expose permanent API credentials in browser code
- preserve the Jitsi signaling proxy paths
- preserve the translator's remote-audio-only behavior
- verify both development and production/Nitro paths
- run the Jitsi regression tests after changing proxy behavior

---

## Repository

```text
https://github.com/emilalvaroserrano-collab/livelingual
```

Main product UI name: **Orbit Meeting**

Repository/project name: **LiveLingual**
