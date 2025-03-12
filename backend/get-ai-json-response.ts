export default async <T>(prompt: Array<{role: string, content: string}>) : Promise<{result: T | null, error: string | null}> => {
  const { OPENAI_URL, OPENAI_MODEL, OPENAI_KEY } = process.env;
  if (!(OPENAI_URL && OPENAI_MODEL && OPENAI_MODEL)) {
    return { result: null, error: "This server is not configured to make sentences" };
  }
  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [prompt],
      temperature: 0.7,
    }),
  }).then((response) => response.json());
  const maybeResult = cleanedJson<T>(response.choices[0].message.content);
  if (!maybeResult) {
    return { result: null, error: "Service Temporarily Unavailable" };
  }
  return { result: maybeResult, error: null };
}

const cleanedJson = <T>(input: string): T | null => {
  let bracketCount = 0;
  let squareBracketCount = 0;
  let jsonStartIndex = -1;
  let jsonEndIndex = -1;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === "{" || input[i] === "[") {
      if (bracketCount === 0 && squareBracketCount === 0) {
        jsonStartIndex = i;
      }
      if (input[i] === "{") {
        bracketCount++;
      } else {
        squareBracketCount++;
      }
    } else if (input[i] === "}" || input[i] === "]") {
      if (input[i] === "}") {
        bracketCount--;
      } else {
        squareBracketCount--;
      }

      if (bracketCount === 0 && squareBracketCount === 0) {
        jsonEndIndex = i;
        const potentialJson = input.slice(jsonStartIndex, jsonEndIndex + 1);
        try {
          return JSON.parse(potentialJson);
        } catch (e) {
          jsonStartIndex = -1;
          jsonEndIndex = -1;
        }
      }
    }
  }
  return null;
};
