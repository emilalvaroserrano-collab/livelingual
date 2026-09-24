import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Clock3,
  Mic,
  Settings2,
  ShieldCheck,
  UserRound,
  Video,
} from "lucide-react";
import { loadPrefs, loadRecent, rememberRoom, roomLabel, slugify, type RecentRoom } from "@/lib/rooms";
import { useMeeting } from "@/lib/meeting-store";
import { Button } from "@/components/ui/button";
import { Mark } from "@/components/orbit/mark";

type HomeTab = "recent" | "settings";

export function WelcomePage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const [recent, setRecent] = useState<RecentRoom[] | null>(null);
  const [tab, setTab] = useState<HomeTab>("recent");

  const displayName = useMeeting((state) => state.displayName);
  const setDisplayName = useMeeting((state) => state.setDisplayName);
  const wantAudio = useMeeting((state) => state.wantAudio);
  const wantVideo = useMeeting((state) => state.wantVideo);
  const setWantAudio = useMeeting((state) => state.setWantAudio);
  const setWantVideo = useMeeting((state) => state.setWantVideo);
  const hydratePrefs = useMeeting((state) => state.hydratePrefs);

  useEffect(() => {
    setRecent(loadRecent());
    const prefs = loadPrefs();
    if (prefs) hydratePrefs(prefs);
  }, [hydratePrefs]);

  function start(raw: string) {
    const slug = slugify(raw);
    setRecent(rememberRoom(slug));
    void navigate({ to: "/meet/$room", params: { room: slug } });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    start(draft);
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="safe-top sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur">
        <div className="relative mx-auto flex h-14 w-full max-w-3xl items-center justify-center px-4">
          <div className="inline-flex items-center gap-2">
            <Mark className="size-7" />
            <span className="text-[17px] font-semibold tracking-tight">Orbit Meeting</span>
          </div>
          <button
            type="button"
            aria-label="Open settings"
            onClick={() => setTab("settings")}
            className="absolute right-3 inline-flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg md:hidden"
          >
            <Settings2 className="size-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col px-4 pb-28 pt-5 sm:px-6 md:pb-10 md:pt-8">
        <section className="mx-auto w-full max-w-xl">
          <div className="mb-5 text-center">
            <h1 className="text-[22px] font-semibold tracking-tight">Start or join a meeting</h1>
            <p className="mt-1 text-sm leading-normal text-muted">
              Enter a room name or leave it blank to create one.
            </p>
          </div>

          <form onSubmit={onSubmit} className="rounded-xl bg-elevated p-3 shadow-panel">
            <label htmlFor="meeting-name" className="sr-only">
              Meeting name
            </label>
            <input
              id="meeting-name"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Enter meeting name"
              autoComplete="off"
              autoCapitalize="none"
              enterKeyHint="go"
              className="h-13 w-full rounded-lg border border-strong bg-subtle px-4 text-center text-[18px] text-fg outline-none placeholder:text-faint focus:border-accent"
            />
            <Button type="submit" variant="primary" size="lg" className="mt-3 w-full uppercase tracking-wide">
              Join
            </Button>
          </form>
        </section>

        <section className="mx-auto mt-7 w-full max-w-xl">
          <div className="hidden border-b border-line md:flex">
            <button
              type="button"
              onClick={() => setTab("recent")}
              className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === "recent" ? "border-accent text-fg" : "border-transparent text-muted"
              }`}
            >
              Recent
            </button>
            <button
              type="button"
              onClick={() => setTab("settings")}
              className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === "settings" ? "border-accent text-fg" : "border-transparent text-muted"
              }`}
            >
              Settings
            </button>
          </div>

          {tab === "recent" ? (
            <div className="pt-2 md:pt-4">
              <div className="mb-2 flex items-center gap-2 px-1">
                <Clock3 className="size-4 text-muted" />
                <h2 className="text-sm font-semibold">Recent meetings</h2>
              </div>

              {recent === null ? (
                <div className="rounded-xl bg-elevated px-4 py-8 text-center text-sm text-muted">
                  Loading recent meetings…
                </div>
              ) : recent.length === 0 ? (
                <div className="rounded-xl bg-elevated px-6 py-10 text-center">
                  <Video className="mx-auto size-9 text-faint" />
                  <p className="mt-3 text-sm font-medium">No recent meetings</p>
                  <p className="mx-auto mt-1 max-w-xs text-sm leading-normal text-muted">
                    Meetings you join on this device will appear here.
                  </p>
                </div>
              ) : (
                <ul className="overflow-hidden rounded-xl bg-elevated">
                  {recent.map((room, index) => (
                    <li
                      key={room.slug}
                      className={index === 0 ? "" : "border-t border-line"}
                    >
                      <button
                        type="button"
                        onClick={() => start(room.slug)}
                        className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-subtle"
                      >
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-subtle text-muted">
                          <Video className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-medium capitalize">
                            {roomLabel(room.slug)}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-faint">{room.slug}</span>
                        </span>
                        <span className="text-sm font-medium text-accent">Join</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="pt-2 md:pt-4">
              <div className="mb-2 flex items-center gap-2 px-1">
                <Settings2 className="size-4 text-muted" />
                <h2 className="text-sm font-semibold">Settings</h2>
              </div>

              <div className="overflow-hidden rounded-xl bg-elevated">
                <label className="block border-b border-line px-4 py-3">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <UserRound className="size-4 text-muted" />
                    Display name
                  </span>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    maxLength={40}
                    autoComplete="name"
                    placeholder="Guest"
                    className="h-11 w-full rounded-lg border border-strong bg-subtle px-3 text-base text-fg outline-none focus:border-accent"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setWantAudio(!wantAudio)}
                  className="flex min-h-15 w-full items-center gap-3 border-b border-line px-4 py-3 text-left"
                >
                  <Mic className="size-5 text-muted" />
                  <span className="flex-1">
                    <span className="block text-sm font-medium">Microphone on by default</span>
                    <span className="block text-xs text-muted">Applies before you enter a meeting.</span>
                  </span>
                  <span
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      wantAudio ? "bg-accent" : "bg-strong"
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`absolute top-1 size-5 rounded-full bg-white transition-transform ${
                        wantAudio ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setWantVideo(!wantVideo)}
                  className="flex min-h-15 w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <Video className="size-5 text-muted" />
                  <span className="flex-1">
                    <span className="block text-sm font-medium">Camera on by default</span>
                    <span className="block text-xs text-muted">You can still change this in prejoin.</span>
                  </span>
                  <span
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      wantVideo ? "bg-accent" : "bg-strong"
                    }`}
                    aria-hidden="true"
                  >
                    <span
                      className={`absolute top-1 size-5 rounded-full bg-white transition-transform ${
                        wantVideo ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </span>
                </button>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl bg-elevated px-4 py-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-live" />
                <div>
                  <p className="text-sm font-medium">No account required</p>
                  <p className="mt-1 text-xs leading-normal text-muted">
                    Your room history and meeting preferences stay on this device.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-line bg-elevated/98 backdrop-blur md:hidden">
        <div className="mx-auto grid h-16 max-w-md grid-cols-2">
          <button
            type="button"
            onClick={() => setTab("recent")}
            className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
              tab === "recent" ? "text-accent" : "text-muted"
            }`}
          >
            <Clock3 className="size-5" />
            Recent
          </button>
          <button
            type="button"
            onClick={() => setTab("settings")}
            className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
              tab === "settings" ? "text-accent" : "text-muted"
            }`}
          >
            <Settings2 className="size-5" />
            Settings
          </button>
        </div>
      </nav>
    </div>
  );
}
