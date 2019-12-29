import transformers from "./transformers/index.mjs";

export default function transformer(options) {
  return function transform(node) {
    const transformNode = transformers.get(node.type);

    if (!transformNode) {
      return null;
    }

    return transformNode(node, transform, options);
  };
}
