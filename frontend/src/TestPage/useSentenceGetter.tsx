import * as React from "react";
export const useSentenceGetter = () => {
  const sentenceCache = React.useRef<Record<string, string>>( 
    JSON.parse(localStorage.getItem("sentenceCache") || "{}"),
  );
  return {
    getSentence: async (key: string) => {
      const response = (await fetch(
        "/make-sentence",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key,
            previousRequest: sentenceCache.current[key],
          }),
        },
      ).then((response) => response.json())) as { sentence: string, pinyin: string, definition: string };
      sentenceCache.current[key] = response.sentence;
      localStorage.setItem("sentenceCache", JSON.stringify(sentenceCache.current));
      return response;
    },
  }
}