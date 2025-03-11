/**
 * @typedef {import("../../parser/index.js").MultiScripts} MultiScripts
 * @type {import("../index.js").TransformFn<MultiScripts>}
 */
export default function multiscripts(node, transform) {
  const postscripts = node.post.flatMap((pair) =>
    pair.map((nodes) => {
      if (nodes.length === 1) {
        return transform(nodes[0]);
      }

      return {
        tag: "mrow",
        childNodes: nodes.map(transform),
      };
    }),
  );

  const childNodes = [transform(node.base), ...postscripts];

  if (node.pre && node.pre.length > 0) {
    childNodes.push({ tag: "mprescripts" });

    const prescripts = node.pre.flatMap((pair) =>
      pair.map((nodes) => {
        if (nodes.length === 1) {
          return transform(nodes[0]);
        }

        return {
          tag: "mrow",
          childNodes: nodes.map(transform),
        };
      }),
    );

    childNodes.push(...prescripts);
  }

  return {
    tag: "mmultiscripts",
    childNodes,
  };
}
