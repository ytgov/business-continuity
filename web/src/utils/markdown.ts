import markdownit from "markdown-it";

export function renderMarkdown(input: string): string {
  const md = markdownit();
  return md.render(input);
}
