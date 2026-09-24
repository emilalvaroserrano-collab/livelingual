(function () {
  "use strict";

  var BUTTON_ID = "orbit-translator";
  var PANEL_ID = "orbit-translator-panel";
  var STORAGE_KEY = "orbit-translator-target-language";
  var MODEL = "gemini-3.5-live-translate-preview";
  var TOKEN_URL = "/api/orbit-translation-token";
  var WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained";
  var INPUT_RATE = 16000;
  var OUTPUT_RATE = 24000;
  var CHUNK_SAMPLES = 1600;

  var LANGUAGES = [
    ["af","Afrikaans"],["ak","Akan"],["sq","Albanian"],["am","Amharic"],["ar","Arabic"],
    ["hy","Armenian"],["az","Azerbaijani"],["eu","Basque"],["be","Belarusian"],["bn","Bengali"],
    ["bg","Bulgarian"],["my","Burmese (Myanmar)"],["ca","Catalan"],["zh-Hans","Chinese (Simplified)"],
    ["zh-Hant","Chinese (Traditional)"],["hr","Croatian"],["cs","Czech"],["da","Danish"],["nl","Dutch"],
    ["en","English"],["et","Estonian"],["fil","Filipino"],["fi","Finnish"],["fr","French"],["gl","Galician"],
    ["ka","Georgian"],["de","German"],["el","Greek"],["gu","Gujarati"],["ha","Hausa"],["he","Hebrew"],
    ["hi","Hindi"],["hu","Hungarian"],["is","Icelandic"],["id","Indonesian"],["it","Italian"],
    ["ja","Japanese"],["jv","Javanese"],["kn","Kannada"],["kk","Kazakh"],["km","Khmer"],["rw","Kinyarwanda"],
    ["ko","Korean"],["lo","Lao"],["lv","Latvian"],["lt","Lithuanian"],["mk","Macedonian"],["ms","Malay"],
    ["ml","Malayalam"],["mr","Marathi"],["mn","Mongolian"],["ne","Nepali"],["no","Norwegian"],
    ["nb","Norwegian Bokmål"],["fa","Persian"],["pl","Polish"],["pt-BR","Portuguese (Brazil)"],
    ["pt-PT","Portuguese (Portugal)"],["pa","Punjabi"],["ro","Romanian"],["ru","Russian"],["sr","Serbian"],
    ["sd","Sindhi"],["si","Sinhala"],["sk","Slovak"],["sl","Slovenian"],["es","Spanish"],["su","Sundanese"],
    ["sw","Swahili"],["sv","Swedish"],["ta","Tamil"],["te","Telugu"],["th","Thai"],["tr","Turkish"],
    ["uk","Ukrainian"],["ur","Urdu"],["uz","Uzbek"],["vi","Vietnamese"],["zu","Zulu"]
  ];

  function savedTarget() {
    try { return localStorage.getItem(STORAGE_KEY) || "en"; } catch (_) { return "en"; }
  }

  var state = {
    active: false,
    starting: false,
    manualStop: false,
    setupReady: false,
    target: savedTarget(),
    session: 0,
    ws: null,
    inputContext: null,
    outputContext: null,
    mix: null,
    processor: null,
    silent: null,
    sources: new Map(),
    sourceTimer: 0,
    reconnectTimer: 0,
    pending: new Int16Array(0),
    outputCursor: 0,
    outputSources: new Set(),
    ducked: new Map(),
    restoreTimer: 0,
    panel: null,
    status: null,
    inputText: null,
    outputText: null,
    action: null,
    select: null
  };

  if (!LANGUAGES.some(function (item) { return item[0] === state.target; })) state.target = "en";

  function makePanel() {
    if (document.getElementById(PANEL_ID)) return;
    var style = document.createElement("style");
    style.textContent =
      "#"+PANEL_ID+"{position:fixed;z-index:7000;top:0;right:0;bottom:0;width:min(380px,100vw);background:#171d23;color:#fff;box-shadow:-8px 0 30px rgba(0,0,0,.35);transform:translateX(105%);transition:transform .18s ease;display:flex;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}"+
      "#"+PANEL_ID+"[data-open='true']{transform:translateX(0)}"+
      "#"+PANEL_ID+" .otr-head{padding:18px;border-bottom:1px solid rgba(255,255,255,.12);background:#20262d}"+
      "#"+PANEL_ID+" .otr-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}"+
      "#"+PANEL_ID+" h2{font-size:18px;font-weight:600;margin:0}"+
      "#"+PANEL_ID+" .otr-close{border:0;background:transparent;color:#fff;width:36px;height:36px;border-radius:8px;font-size:25px;cursor:pointer}"+
      "#"+PANEL_ID+" .otr-close:hover{background:rgba(255,255,255,.1)}"+
      "#"+PANEL_ID+" label{display:block;font-size:12px;color:#aeb8c2;margin-bottom:6px}"+
      "#"+PANEL_ID+" select{width:100%;height:42px;border-radius:7px;border:1px solid #59636d;background:#2b333c;color:#fff;padding:0 10px;font-size:14px}"+
      "#"+PANEL_ID+" .otr-body{padding:16px 18px 22px;overflow:auto;display:flex;flex-direction:column;gap:14px;flex:1}"+
      "#"+PANEL_ID+" .otr-status{font-size:13px;line-height:1.4;color:#aeb8c2;padding:10px 12px;border-radius:8px;background:rgba(255,255,255,.05)}"+
      "#"+PANEL_ID+" .otr-status[data-tone='live']{color:#9ce8ba;background:rgba(28,170,88,.13)}"+
      "#"+PANEL_ID+" .otr-status[data-tone='error']{color:#ffb1b1;background:rgba(214,55,55,.14)}"+
      "#"+PANEL_ID+" .otr-card{border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px;background:#20262d}"+
      "#"+PANEL_ID+" .otr-card h3{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#8f9aa5;margin:0 0 8px}"+
      "#"+PANEL_ID+" .otr-card p{font-size:14px;line-height:1.5;margin:0;color:#e8edf2;white-space:pre-wrap;overflow-wrap:anywhere}"+
      "#"+PANEL_ID+" .otr-action{height:42px;border:0;border-radius:8px;background:#2d8cff;color:#fff;font-weight:600;font-size:14px;cursor:pointer}"+
      "#"+PANEL_ID+" .otr-action[data-running='true']{background:#434b54}"+
      "#"+PANEL_ID+" .otr-note{font-size:12px;line-height:1.45;color:#8f9aa5;margin:0}"+
      "@media(max-width:600px){#"+PANEL_ID+"{width:100vw}}";
    document.head.appendChild(style);

    var panel = document.createElement("aside");
    panel.id = PANEL_ID;
    panel.dataset.open = "false";
    panel.setAttribute("aria-label", "Live translator");
    panel.innerHTML =
      "<div class='otr-head'><div class='otr-row'><h2>Live Translator</h2><button class='otr-close' type='button' aria-label='Close translator'>×</button></div>"+
      "<label for='orbit-translator-language'>Translate incoming audio to</label><select id='orbit-translator-language'></select></div>"+
      "<div class='otr-body'><div class='otr-status' role='status'>Translator is off</div>"+
      "<button class='otr-action' type='button'>Start translation</button>"+
      "<section class='otr-card'><h3>Incoming speech</h3><p class='otr-input'>Waiting for speech…</p></section>"+
      "<section class='otr-card'><h3>Translated speech</h3><p class='otr-output'>Translation will appear here…</p></section>"+
      "<p class='otr-note'>Only audio from other meeting participants is translated. Your microphone is never sent to the translator.</p></div>";
    document.body.appendChild(panel);

    var select = panel.querySelector("#orbit-translator-language");
    LANGUAGES.forEach(function (item) {
      var option = document.createElement("option");
      option.value = item[0];
      option.textContent = item[1];
      option.selected = item[0] === state.target;
      select.appendChild(option);
    });

    state.panel = panel;
    state.status = panel.querySelector(".otr-status");
    state.inputText = panel.querySelector(".otr-input");
    state.outputText = panel.querySelector(".otr-output");
    state.action = panel.querySelector(".otr-action");
    state.select = select;

    panel.querySelector(".otr-close").addEventListener("click", function () { panel.dataset.open = "false"; });
    state.action.addEventListener("click", function () {
      if (state.active || state.starting) stopTranslation(false);
      else startTranslation(false);
    });
    select.addEventListener("change", function () {
      state.target = select.value;
      try { localStorage.setItem(STORAGE_KEY, state.target); } catch (_) {}
      if (state.active || state.starting) restartTranslation();
    });
  }

  function status(text, tone) {
    if (!state.status) return;
    state.status.textContent = text;
    state.status.dataset.tone = tone || "neutral";
  }

  function renderAction() {
    if (!state.action) return;
    var running = state.active || state.starting;
    state.action.textContent = running ? "Stop translation" : "Start translation";
    state.action.dataset.running = running ? "true" : "false";
  }

  function togglePanel() {
    makePanel();
    state.panel.dataset.open = state.panel.dataset.open === "true" ? "false" : "true";
  }

  function patchToolbar() {
    var api = window.APP && window.APP.API;
    if (!api || typeof api.notifyToolbarButtonClicked !== "function" || api.__orbitTranslatorPatched) return false;
    var original = api.notifyToolbarButtonClicked;
    api.notifyToolbarButtonClicked = function (key, preventExecution) {
      if (key === BUTTON_ID) togglePanel();
      return original.call(this, key, preventExecution);
    };
    api.__orbitTranslatorPatched = true;
    return true;
  }

  function watchToolbar() {
    if (patchToolbar()) return;
    var timer = setInterval(function () { if (patchToolbar()) clearInterval(timer); }, 250);
    setTimeout(function () { clearInterval(timer); }, 30000);
  }

  async function tokenFor(target) {
    var response = await fetch(TOKEN_URL, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ targetLanguageCode: target })
    });
    var body = await response.json().catch(function () { return {}; });
    if (!response.ok || !body.token) throw new Error(body.error || "Could not create translation session");
    return body.token;
  }

  async function startTranslation(reconnecting) {
    if (state.active || state.starting) return;
    makePanel();
    state.panel.dataset.open = "true";
    state.starting = true;
    state.manualStop = false;
    state.setupReady = false;
    state.session += 1;
    var sid = state.session;
    renderAction();
    status(reconnecting ? "Reconnecting translator…" : "Starting translator…", "neutral");

    try {
      await ensureOutputContext();
      var token = await tokenFor(state.target);
      if (sid !== state.session || state.manualStop) return;

      var ws = new WebSocket(WS_URL + "?access_token=" + encodeURIComponent(token));
      state.ws = ws;

      ws.onopen = function () {
        if (sid !== state.session) return;
        ws.send(JSON.stringify({
          setup: {
            model: "models/" + MODEL,
            generationConfig: {
              responseModalities: ["AUDIO"],
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              translationConfig: { targetLanguageCode: state.target, echoTargetLanguage: true }
            }
          }
        }));
      };

      ws.onmessage = function (event) {
        if (sid === state.session) handleMessage(event.data);
      };

      ws.onerror = function () {
        if (sid === state.session) status("Translator connection error", "error");
      };

      ws.onclose = function () {
        if (sid !== state.session) return;
        var reconnect = (state.active || state.starting) && !state.manualStop;
        state.ws = null;
        state.setupReady = false;
        state.starting = false;
        stopCapture();
        if (reconnect) {
          state.active = true;
          renderAction();
          status("Translator disconnected. Reconnecting…", "neutral");
          clearTimeout(state.reconnectTimer);
          state.reconnectTimer = setTimeout(function () {
            state.active = false;
            startTranslation(true);
          }, 1200);
        } else {
          state.active = false;
          renderAction();
        }
      };
    } catch (error) {
      if (sid !== state.session) return;
      state.active = false;
      state.starting = false;
      renderAction();
      status(error && error.message ? error.message : "Translator failed to start", "error");
    }
  }

  function restartTranslation() {
    var restart = state.active || state.starting;
    stopTranslation(true);
    if (restart) setTimeout(function () { startTranslation(false); }, 80);
  }

  function stopTranslation(forRestart) {
    state.manualStop = true;
    state.active = false;
    state.starting = false;
    state.setupReady = false;
    state.session += 1;
    clearTimeout(state.reconnectTimer);
    stopCapture();
    clearPlayback();
    restoreOriginals();
    var ws = state.ws;
    state.ws = null;
    if (ws && ws.readyState < WebSocket.CLOSING) {
      try {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ realtimeInput: { audioStreamEnd: true } }));
        ws.close(1000, "Translator stopped");
      } catch (_) {}
    }
    renderAction();
    if (!forRestart) status("Translator is off", "neutral");
  }

  function handleMessage(raw) {
    var message;
    try { message = JSON.parse(raw); } catch (_) { return; }

    if (message.setupComplete) {
      state.setupReady = true;
      state.starting = false;
      state.active = true;
      renderAction();
      status("Translator is live", "live");
      startCapture().catch(function (error) {
        status(error && error.message ? error.message : "Could not read meeting audio", "error");
      });
      return;
    }

    if (message.goAway && state.active) status("Translator session is refreshing…", "neutral");
    var content = message.serverContent;
    if (!content) return;

    var input = content.inputTranscription || content.interimInputTranscription;
    if (input && input.text && state.inputText) state.inputText.textContent = input.text;
    if (content.outputTranscription && content.outputTranscription.text && state.outputText) {
      state.outputText.textContent = content.outputTranscription.text;
    }
    if (content.interrupted) clearPlayback();

    var parts = content.modelTurn && Array.isArray(content.modelTurn.parts) ? content.modelTurn.parts : [];
    parts.forEach(function (part) {
      if (part.inlineData && part.inlineData.data) queueOutput(part.inlineData.data);
    });
  }

  async function startCapture() {
    stopCapture();
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) throw new Error("This browser does not support live audio translation");
    var ctx = new Ctx();
    await ctx.resume();
    var mix = ctx.createGain();
    var processor = ctx.createScriptProcessor(4096, 1, 1);
    var silent = ctx.createGain();
    silent.gain.value = 0;
    mix.connect(processor);
    processor.connect(silent);
    silent.connect(ctx.destination);
    state.inputContext = ctx;
    state.mix = mix;
    state.processor = processor;
    state.silent = silent;
    state.pending = new Int16Array(0);

    processor.onaudioprocess = function (event) {
      if (!state.active || !state.setupReady || state.sources.size === 0) return;
      appendPcm(downsample(event.inputBuffer.getChannelData(0), ctx.sampleRate, INPUT_RATE));
    };

    syncRemoteAudio();
    state.sourceTimer = setInterval(syncRemoteAudio, 750);
  }

  function remoteTracks() {
    var tracks = new Map();
    document.querySelectorAll("audio[id^='remoteAudio_']").forEach(function (audio) {
      var stream = audio.srcObject;
      if (!stream || typeof stream.getAudioTracks !== "function") return;
      var track = stream.getAudioTracks()[0];
      if (track && track.readyState === "live") tracks.set(track.id, track);
    });
    return tracks;
  }

  function syncRemoteAudio() {
    if (!state.inputContext || !state.mix) return;
    var tracks = remoteTracks();

    state.sources.forEach(function (entry, id) {
      if (!tracks.has(id) || entry.track.readyState !== "live") {
        try { entry.source.disconnect(); } catch (_) {}
        state.sources.delete(id);
      }
    });

    tracks.forEach(function (track, id) {
      if (state.sources.has(id)) return;
      try {
        var source = state.inputContext.createMediaStreamSource(new MediaStream([track]));
        source.connect(state.mix);
        state.sources.set(id, { source: source, track: track });
      } catch (_) {}
    });

    if (state.active) {
      status(
        state.sources.size
          ? "Translator is live · " + state.sources.size + " incoming audio " + (state.sources.size === 1 ? "track" : "tracks")
          : "Translator is live · waiting for another participant",
        "live"
      );
    }
  }

  function stopCapture() {
    clearInterval(state.sourceTimer);
    state.sourceTimer = 0;
    state.sources.forEach(function (entry) { try { entry.source.disconnect(); } catch (_) {} });
    state.sources.clear();
    if (state.processor) {
      state.processor.onaudioprocess = null;
      try { state.processor.disconnect(); } catch (_) {}
    }
    try { if (state.mix) state.mix.disconnect(); } catch (_) {}
    try { if (state.silent) state.silent.disconnect(); } catch (_) {}
    if (state.inputContext) state.inputContext.close().catch(function () {});
    state.inputContext = null;
    state.mix = null;
    state.processor = null;
    state.silent = null;
    state.pending = new Int16Array(0);
  }

  function downsample(input, inputRate, outputRate) {
    if (!input || !input.length) return new Int16Array(0);
    var ratio = inputRate / outputRate;
    var size = Math.max(1, Math.floor(input.length / ratio));
    var out = new Int16Array(size);
    for (var o = 0; o < size; o += 1) {
      var start = Math.floor(o * ratio);
      var end = Math.min(input.length, Math.max(start + 1, Math.floor((o + 1) * ratio)));
      var sum = 0;
      for (var i = start; i < end; i += 1) sum += input[i];
      var sample = Math.max(-1, Math.min(1, sum / Math.max(1, end - start)));
      out[o] = sample < 0 ? Math.round(sample * 32768) : Math.round(sample * 32767);
    }
    return out;
  }

  function appendPcm(chunk) {
    if (!chunk.length) return;
    var all = new Int16Array(state.pending.length + chunk.length);
    all.set(state.pending, 0);
    all.set(chunk, state.pending.length);
    var offset = 0;
    while (all.length - offset >= CHUNK_SAMPLES) {
      sendPcm(all.subarray(offset, offset + CHUNK_SAMPLES));
      offset += CHUNK_SAMPLES;
    }
    state.pending = all.slice(offset);
  }

  function sendPcm(pcm) {
    var ws = state.ws;
    if (!state.active || !state.setupReady || !ws || ws.readyState !== WebSocket.OPEN) return;
    var bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
    ws.send(JSON.stringify({
      realtimeInput: {
        audio: { data: toBase64(bytes), mimeType: "audio/pcm;rate=" + INPUT_RATE }
      }
    }));
  }

  function toBase64(bytes) {
    var binary = "";
    for (var i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  }

  async function ensureOutputContext() {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) throw new Error("This browser does not support translated audio playback");
    if (!state.outputContext || state.outputContext.state === "closed") {
      state.outputContext = new Ctx();
      state.outputCursor = 0;
    }
    if (state.outputContext.state === "suspended") await state.outputContext.resume();
  }

  function queueOutput(base64) {
    var ctx = state.outputContext;
    if (!ctx) return;
    var binary;
    try { binary = atob(base64); } catch (_) { return; }
    if (binary.length < 2) return;

    var count = Math.floor(binary.length / 2);
    var buffer = ctx.createBuffer(1, count, OUTPUT_RATE);
    var channel = buffer.getChannelData(0);
    for (var i = 0; i < count; i += 1) {
      var sample = (binary.charCodeAt(i * 2 + 1) << 8) | binary.charCodeAt(i * 2);
      if (sample & 0x8000) sample -= 0x10000;
      channel[i] = sample / 32768;
    }

    duckOriginals();
    var source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    var at = Math.max(ctx.currentTime + 0.015, state.outputCursor || 0);
    state.outputCursor = at + buffer.duration;
    state.outputSources.add(source);
    source.onended = function () {
      state.outputSources.delete(source);
      if (!state.outputSources.size) {
        clearTimeout(state.restoreTimer);
        state.restoreTimer = setTimeout(restoreOriginals, 250);
      }
    };
    source.start(at);
  }

  function clearPlayback() {
    state.outputSources.forEach(function (source) { try { source.stop(); } catch (_) {} });
    state.outputSources.clear();
    if (state.outputContext) state.outputCursor = state.outputContext.currentTime;
    restoreOriginals();
  }

  function duckOriginals() {
    clearTimeout(state.restoreTimer);
    document.querySelectorAll("audio[id^='remoteAudio_']").forEach(function (audio) {
      if (!state.ducked.has(audio)) state.ducked.set(audio, { volume: audio.volume, muted: audio.muted });
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) audio.muted = true;
      else audio.volume = Math.min(audio.volume, 0.15);
    });
  }

  function restoreOriginals() {
    clearTimeout(state.restoreTimer);
    state.ducked.forEach(function (previous, audio) {
      if (audio.isConnected) {
        audio.volume = previous.volume;
        audio.muted = previous.muted;
      }
    });
    state.ducked.clear();
  }

  window.addEventListener("beforeunload", function () { stopTranslation(false); });
  makePanel();
  watchToolbar();
})();
