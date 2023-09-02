import { FormEventHandler } from "react";
import { DEFAULT_ZOOM, setZoom, useZoom } from "./application/signals/zoomSignal.ts";

export const Panel = () => {
  const zoom = useZoom();

  const onInput: FormEventHandler<HTMLInputElement> = (e) => {
    const value = parseFloat(e.currentTarget.value);
    return setZoom(value);
  };

  return (
    <div className="panel">
      <input
        type="range"
        min={0.1}
        step={0.1}
        defaultValue={DEFAULT_ZOOM}
        max={5}
        onInput={onInput}
      />
      <div>{zoom}</div>
    </div>
  );
};
