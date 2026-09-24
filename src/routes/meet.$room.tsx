import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { loadPrefs, roomLabel } from "@/lib/rooms";
import { useMeeting } from "@/lib/meeting-store";
import { useLocalMedia } from "@/components/orbit/media";
import { Prejoin } from "@/components/orbit/prejoin";

export const Route = createFileRoute("/meet/$room")({
  component: MeetPage,
  head: ({ params }) => ({
    meta: [{ title: `${roomLabel(params.room)} · Orbit Meeting` }],
  }),
});

function MeetPage() {
  const { room } = Route.useParams();
  const wantAudio = useMeeting((state) => state.wantAudio);
  const wantVideo = useMeeting((state) => state.wantVideo);
  const hydratePrefs = useMeeting((state) => state.hydratePrefs);
  const media = useLocalMedia(wantAudio, wantVideo);

  useEffect(() => {
    const prefs = loadPrefs();
    if (prefs) hydratePrefs(prefs);
  }, [hydratePrefs]);


  return <Prejoin room={room} media={media} />;
}
