import test from "ava";

import { literalValue } from "./text-transforms.js";

test("bold", (t) => {
  t.is(literalValue("0123456789", ["bold"]), "𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗");

  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["bold"]),
    "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["bold"]),
    "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳",
  );

  t.is(literalValue("ΑΒΓΣΩαβγπσω", ["bold"]), "𝚨𝚩𝚪𝚺𝛀𝛂𝛃𝛄𝛑𝛔𝛚");
  t.is(literalValue("1 + a = ?", ["bold"]), "𝟏 + 𝐚 = ?");
});

test("italic", (t) => {
  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["italic"]),
    "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["italic"]),
    "𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧",
  );

  t.is(literalValue("ΑΒΓΣΩαβγπσω", ["italic"]), "𝛢𝛣𝛤𝛴𝛺𝛼𝛽𝛾𝜋𝜎𝜔");
  t.is(literalValue("1 + a = ?", ["italic"]), "1 + 𝑎 = ?");
});

test("bold italic", (t) => {
  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["bold", "italic"]),
    "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["bold", "italic"]),
    "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛",
  );

  t.is(literalValue("ΑΒΓΣΩαβγπσω", ["bold", "italic"]), "𝜜𝜝𝜞𝜮𝜴𝜶𝜷𝜸𝝅𝝈𝝎");
});

test("double-struck", (t) => {
  t.is(literalValue("0123456789", ["double-struck"]), "𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡");

  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["double-struck"]),
    "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["double-struck"]),
    "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫",
  );

  t.is(literalValue("πγΠ∑", ["double-struck"]), "ℼℽℿ⅀");
  t.is(literalValue("1 + a = ?", ["double-struck"]), "𝟙 + 𝕒 = ?");
});

test("italic double-struck", (t) => {
  t.is(literalValue("Ddij", ["italic", "double-struck"]), "ⅅⅆⅈⅉ");
});

test("fraktur", (t) => {
  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["fraktur"]),
    "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["fraktur"]),
    "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷",
  );
});

test("bold fractur", (t) => {
  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["bold", "fraktur"]),
    "𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["bold", "fraktur"]),
    "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟",
  );
});

test("monospace", (t) => {
  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["monospace"]),
    "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["monospace"]),
    "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣",
  );
});

test("sans-serif", (t) => {
  t.is(literalValue("0123456789", ["sans-serif"]), "𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫");

  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["sans-serif"]),
    "𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["sans-serif"]),
    "𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓",
  );
});

test("bold sans-serif", (t) => {
  t.is(literalValue("0123456789", ["bold", "sans-serif"]), "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵");

  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["bold", "sans-serif"]),
    "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["bold", "sans-serif"]),
    "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇",
  );
});

test("italic sans-serif", (t) => {
  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["italic", "sans-serif"]),
    "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["italic", "sans-serif"]),
    "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻",
  );
});

test("bold italic sans-serif", (t) => {
  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", [
      "bold",
      "italic",
      "sans-serif",
    ]),
    "𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", [
      "bold",
      "italic",
      "sans-serif",
    ]),
    "𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯",
  );
});

test("script", (t) => {
  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["script"]),
    "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["script"]),
    "𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏",
  );
});

test("bold script", (t) => {
  t.is(
    literalValue("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["bold", "script"]),
    "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩",
  );

  t.is(
    literalValue("abcdefghijklmnopqrstuvwxyz", ["bold", "script"]),
    "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃",
  );
});
