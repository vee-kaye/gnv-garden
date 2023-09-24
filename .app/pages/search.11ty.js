const { stripHtml } = require("string-strip-html");
const { parse } = require("node-html-parser");
const crypto = require("crypto");

class SearchIndex {
  data() {
    return {
      layout: null,
      permalink: "/search.json",
    };
  }

  render({ collections }) {
    return JSON.stringify({
      notes: collections._notes.map((note) => {
        const content = this.cleanUpContent(note.content);

        return {
          id: `n-${crypto.randomUUID().substring(0, 8)}`,
          title: note.data.title || note.page.fileSlug,
          tags: note.data.tags ?? [],
          url: this.htmlBaseUrl(note.url),
          previewText: stripHtml(content)
            .result.slice(0, 150)
            .replace(/\s{2,}/g, " "),
          content: stripHtml(content, {
            dumpLinkHrefsNearby: {
              enabled: true,
              wrapHeads: "[",
              wrapTails: "]",
            },
          }).result,
        };
      }),
    });
  }

  cleanUpContent(content) {
    const doc = parse(content);
    doc.querySelectorAll(".anchor-link").forEach((el) => el.remove());
    return doc.innerHTML;
  }
}

module.exports = SearchIndex;
