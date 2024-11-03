import BgRemove from "./bgRemove";
import BgReplace from "./bgReplace";
import GenerativeFill from "./GenerativeFill";
import GenRemove from "./GenRemove";

export default function ImageTools() {
  return (
    <>
      <GenRemove />
      <BgRemove />
      <BgReplace />
      <GenerativeFill />
    </>
  );
}
