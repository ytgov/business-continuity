import markdownit from "markdown-it";

export function RenderMarkdown(input: string): { output: string; isMarkdown: boolean } {
  let containsNewlines = RegExp(/.*\n/g).test(input);
  let containsHash = input.includes("#");

  if (containsNewlines || containsHash) {
    return {
      output: markdownit({
        html: true,
        linkify: true,
        typographer: true,
      }).render(input),
      isMarkdown: true,
    };
  }

  return { output: input, isMarkdown: false };
}
