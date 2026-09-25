import { assets } from "../assets/landing";
import { RadSoupFill } from "./RadSoupFill";

export function NotebookBackground() {
  return (
    <div className="notebook-background">
      <img alt="" src={assets.notebookBackground} />
      <div className="notebook-shader" aria-hidden="true">
        <RadSoupFill />
      </div>
    </div>
  );
}
