import { handleBacktick } from "./utils.mjs";

export default function (char, input, { start }) {
  if (char !== "`") {
    return null;
  }

  const { end, value } = handleBacktick(start, input);

  return {
    type: "ident",
    value,
    end,
  };
}
