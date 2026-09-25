import { useRef, type CSSProperties, type ReactNode } from "react";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "../content/site";
import { useFitScale } from "../hooks/useFitScale";

type ScaledStageProps = {
  children: ReactNode;
  id: string;
  label: string;
};

function supportsZoom() {
  return typeof CSS !== "undefined" && CSS.supports("zoom", "1");
}

export function ScaledStage({ children, id, label }: ScaledStageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const scale = useFitScale(frameRef);
  const zoom = supportsZoom();

  const frameStyle: CSSProperties = zoom
    ? {
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
        zoom: scale,
      }
    : {
        width: DESIGN_WIDTH * scale,
        height: DESIGN_HEIGHT * scale,
      };

  const canvasStyle: CSSProperties = {
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    ...(zoom ? null : { transform: `scale(${scale})` }),
  };

  return (
    <div className="scaled-stage" ref={frameRef} id={id} aria-label={label}>
      <div className="scaled-stage__frame" style={frameStyle}>
        <div className="scaled-stage__canvas" style={canvasStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}
