import * as React from "react";
import { data } from "../data";
import { useLocalStorageSavedState } from "../util/useLocalStorageState";

import { isMobile as _isMobile } from "react-device-detect";
import "./index.css";
import {
  populateToTest,
  MILLIS_PER_DAY,
  UserTestable,
} from "./testAlgorithms";
import { TransientState, SavedState } from "./types";
import { RevisionComplete } from "./RevisionComplete";
import { CurrentTestable } from "./CurrentTestable";
import { IncorrectAnswer } from "./IncorrectAnswer";
import { useSentenceGetter } from "~TestPage/useSentenceGetter";
import FloatyToneButtons from "./FloatyToneButtons";

export const INITIAL_PROMPT = "Type the correct answer, or - to skip";

export const TestPage = (props: {
  savedState: SavedState;
  setSavedState: React.Dispatch<React.SetStateAction<SavedState>>;
}) => {
  const { savedState, setSavedState } = props;
  const [transientState, setTransientState] = React.useState<TransientState>({
    questionPresentedAtMillis: Date.now(),
    incorrectAnswerGiven: null,
    inputText: "",
    lastResult: INITIAL_PROMPT,
    isMoreInfoVisible: false,
  });
  // all hooks need to be before the early return otherwise react throws an error
  const inputRef = React.useRef<HTMLInputElement>(null);

  const toTest = populateToTest(savedState, data).filter(
    (toTest) => toTest.nextTestUnixMillis < Date.now() + MILLIS_PER_DAY
  );
  const currentTestable = toTest[0];
  React.useEffect(() => {
    setTransientState((prevState) => ({
      ...prevState,
      isMoreInfoVisible: false,
    }));
  }, [currentTestable?.key]);
  if (toTest.length == 0) {
    return (
      <RevisionComplete savedState={savedState} setSavedState={setSavedState} />
    );
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div>
        <p>
          To test today: {toTest.length}; total words learnt:{" "}
          {Object.keys(savedState.nodeFamiliarity).length}; total words:{" "}
          {data.length} <a href="/stats">Stats</a>
        </p>
        {transientState.incorrectAnswerGiven ? (
          <IncorrectAnswer
            inputRef={inputRef}
            transientState={transientState}
            setTransientState={setTransientState}
            setSavedState={setSavedState}
            currentTestable={currentTestable}
            nextTestable={toTest[1]}
          />
        ) : (
          <CurrentTestable
            inputRef={inputRef}
            transientState={transientState}
            setTransientState={setTransientState}
            setSavedState={setSavedState}
            currentTestable={currentTestable}
          />
        )}
        <MoreInfo
          currentTestable={currentTestable}
          isVisible={transientState.isMoreInfoVisible}
          answerIsVisible={transientState.incorrectAnswerGiven != null}
          setIsVisible={(isVisible) =>
            setTransientState((prevState) => ({
              ...prevState,
              isMoreInfoVisible: isVisible,
            }))
          }
        ></MoreInfo>
      </div>
      <FloatyToneButtons
        inputRef={inputRef}
        transientState={transientState}
        setTransientState={setTransientState}
      ></FloatyToneButtons>
    </div>
  );
};

export const isMobile = (): boolean => {
  return _isMobile || localStorage.getItem("__mobile_testing") == "true";
};

const MoreInfo = ({
  currentTestable,
  isVisible,
  answerIsVisible,
  setIsVisible,
}: {
  currentTestable: UserTestable;
  isVisible: boolean;
  answerIsVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}) => {
  const { getSentence } = useSentenceGetter();
  const [sentence, setSentence] = React.useState<
    | {
        sentence: string;
        pinyin: string;
        definition: string;
      }
    | undefined
  >(undefined);
  React.useEffect(() => {
    if (isVisible) {
      (async () => {
        const actualCharacters = currentTestable.key.split("-")[0];
        const sentence = await getSentence(actualCharacters);
        sentence.sentence = sentence.sentence.replace(
          actualCharacters,
          `<span style="color:red">${actualCharacters}</span>`
        );
        setSentence(sentence);
      })();
    }
  }, [currentTestable.key, isVisible]);
  return (
    <details
      open={isVisible}
      onToggle={(e) =>
        setIsVisible((e.target as unknown as HTMLDetailsElement).open)
      }
    >
      <summary>More info</summary>
      <p dangerouslySetInnerHTML={{ __html: sentence?.sentence || "" }}></p>
      {answerIsVisible ? <p>{sentence?.pinyin}</p> : null}
      <p>{sentence?.definition}</p>
      <p>{currentTestable.additionalInfo}</p>
    </details>
  );
};
