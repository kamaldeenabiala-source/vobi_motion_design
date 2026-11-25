import React from "react";
import { VoiceOver as BaseVoiceOver } from "../../../audio/VoiceOver";
import { VO_LINES, type SceneId } from "./timeline";
import voTimings from "./vo-timings.generated.json";

export const VoiceOver: React.FC<{
  scene: SceneId;
  subtitles?: boolean;
  subtitleY?: number;
  dark?: boolean;
}> = (props) => (
  <BaseVoiceOver
    {...props}
    lines={VO_LINES}
    timings={voTimings}
    voDir="audio/vo-v2-script3"
  />
);
