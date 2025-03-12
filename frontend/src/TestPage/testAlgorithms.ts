import { SavedState } from "~TestPage/types";
import { data } from "../data";

export const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;
const NEW_WORD_RATE = 10 / MILLIS_PER_DAY;
const INITIAL_NEW_WORDS = 10;
export const RECALL_UNDER_THRESHOLD_MS = 4000;

export type NodeFamiliarity = {
  lastTestUnixMs: number;
  msUserTookToRecallCorrectly: number;
  timesRecalledUnderThreshold: number;
};

export type Testable = {
  key: string;
  display: string,
  reveal: string,
  tooSlowThreshold: number,
  additionalInfo: string,
};

export type UserTestable = Testable & {
  nextTestUnixMillis: number
};

export const populateToTest = (
  savedState: SavedState,
  wordsToTest: typeof data,
): UserTestable[] => {
  const toTestData: Testable[] = [];
  let newWordsToPick =
    Math.floor((Date.now() - savedState.newWordsStartDate) * NEW_WORD_RATE) +
    INITIAL_NEW_WORDS - Object.keys(savedState.nodeFamiliarity).length;
  for (const testable of toTestables(wordsToTest, savedState.editedCards)) {
    // always test cards that have already been seen
    if (testable.key in savedState.nodeFamiliarity) {
      toTestData.push(testable);
    } else if (newWordsToPick > 0) {
      // add new words
      savedState.nodeFamiliarity[testable.key] = {
        lastTestUnixMs: Date.now() - MILLIS_PER_DAY,
        msUserTookToRecallCorrectly: RECALL_UNDER_THRESHOLD_MS * testable.display.length * 10,
        timesRecalledUnderThreshold: 0,
      };
      toTestData.push(testable);
      newWordsToPick--;
    }
  }
  const toTest = toTestData.map((data) => ({
    ...data,
    nextTestUnixMillis: getNextTestDate(savedState.nodeFamiliarity[data.key], data),
  }));

  return toTest.sort((a, b) => {
    return a.nextTestUnixMillis - b.nextTestUnixMillis;
  });
};


const toTestables = (wordsToTest: typeof data, overwriteKeys: Record<string, string>): Testable[] => {
  const rawTestables = wordsToTest.flatMap(({ c, p, d }) => ([
    {
      key: c + "-pinyin",
      display: `${c} \n Type the pinyin below`,
      reveal: p,
      tooSlowThreshold: RECALL_UNDER_THRESHOLD_MS + p.length * 400,
      additionalInfo: d
    },
    // {
    //   key: characters + "-cn2en",
    //   display: `What is the English definition for ${characters}?`,
    //   reveal: definition,
    // },
    // {
    //   key: characters + "-en2cn",
    //   display: `What is the Chinese word for ${definition}?`,
    //   reveal: pinyin,
    // },
  ]));
  const testablesDict: Record<string, Testable> = {};
  rawTestables.forEach(t => testablesDict[t.key] = t);
  for (const key in overwriteKeys){
    testablesDict[key].reveal = overwriteKeys[key]
  }
  return rawTestables;
};

export const getNextTestDate = (nodeFamiliarity: NodeFamiliarity, testable: Testable) => {
  return nodeFamiliarity.lastTestUnixMs + getNextTestDelta(nodeFamiliarity, testable)
};

export const getNextTestDelta = (nodeFamiliarity: NodeFamiliarity, testable: Testable) => {
  const { msUserTookToRecallCorrectly, timesRecalledUnderThreshold } =
    nodeFamiliarity;
  const timesRecalledUnderThresholdComponent = (2 ** timesRecalledUnderThreshold - 1);
  const slowRecallComponent = (testable.tooSlowThreshold / msUserTookToRecallCorrectly) ** 3;
  return (
    slowRecallComponent + timesRecalledUnderThresholdComponent
  ) * 2 * MILLIS_PER_DAY;
};
