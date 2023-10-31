function maybeGetDoubleStruckChar(char) {
  const charCode = char.charCodeAt(0);
  if (charCode >= 48 && charCode <= 57) {
    // double-struck 0: 0xd835 0xdfd8
    // 0xdfd8 - 48 = 0xdfa8
    return String.fromCharCode(0xd835, 0xdfa8 + charCode);
  }
  if (charCode >= 65 && charCode <= 90) {
    switch (char) {
      case "C":
        return "ℂ";
      case "H":
        return "ℍ";
      case "N":
        return "ℕ";
      case "P":
        return "ℙ";
      case "Q":
        return "ℚ";
      case "R":
        return "ℝ";
      case "Z":
        return "ℤ";
      default:
        // double-struck a: 0xd835 0xdd38
        // 0xdd38 - 65 = 0xdcf7
        return String.fromCharCode(0xd835, 0xdcf7 + charCode);
    }
  }
  if (charCode >= 97 && charCode <= 122) {
    // double-struck a: 0xd835 0xdd52
    // 0xdd52 - 97 = 0xdcf1
    return String.fromCharCode(0xd835, 0xdcf1 + charCode);
  }
  return char;
}

function getDoubleStruckText(before) {
  let after = "";
  for (const char of before) {
    after += maybeGetDoubleStruckChar(char);
  }
  return after;
}

export default function literal(tag) {
  return (node) => {
    if (node.attrs && node.attrs.mathvariant === "double-struck") {
      return {
        tag,
        attrs: {},
        textContent: getDoubleStruckText(node.value),
      };
    }
    return {
      tag,
      attrs: node.attrs,
      textContent: node.value,
    };
  };
}
