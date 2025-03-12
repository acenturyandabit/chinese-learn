import * as React from "react";
import { INITIAL_PROMPT } from "~TestPage";
import { SavedState, TransientState } from "./types";
import { UserTestable } from "~TestPage/testAlgorithms";
import { getNextTestDate, getNextTestDelta } from "~TestPage/testAlgorithms";
export const IncorrectAnswer = ({
  transientState,
  setTransientState,
  setSavedState,
  currentTestable,
  nextTestable,
  inputRef,
}: {
  transientState: TransientState;
  setTransientState: React.Dispatch<React.SetStateAction<TransientState>>;
  setSavedState: React.Dispatch<React.SetStateAction<SavedState>>;
  currentTestable: UserTestable;
  nextTestable: UserTestable | undefined;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}) => {
  const proceed = (
    maybeModifyState: (s: SavedState) => SavedState = (t) => t
  ) =>
    proceedImpl(
      {
        transientState,
        setTransientState,
        setSavedState,
        currentTestable,
        nextTestable,
      },
      maybeModifyState
    );
  const checkAndProceed = () => {
    if (transientState.inputText.toLowerCase() == currentTestable.reveal) {
      proceed();
    }
  };
  return (
    <>
      <h1>{currentTestable.display}</h1>
      <p>{transientState.lastResult}</p>
      <p>Type {currentTestable.reveal} to continue</p>
      <input
        value={transientState.inputText}
        ref={(input) => {
          if (!input) return;
          inputRef.current = input;
          input.focus();
        }}
        onChange={(e) =>
          setTransientState({
            ...transientState,
            inputText: e.target.value,
          })
        }
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            checkAndProceed();
          }
        }}
      />
      <button onClick={checkAndProceed}>Submit (or press Enter)</button>
      <button
        onClick={() => {
          proceed((s) => {
            s.editedCards[currentTestable.key] =
              transientState.inputText.toLowerCase();
            return s;
          });
        }}
      >
        Submit correction
      </button>
    </>
  );
};

const proceedImpl = (
  {
    transientState,
    setTransientState,
    setSavedState,
    currentTestable,
    nextTestable,
  }: {
    transientState: TransientState;
    setTransientState: React.Dispatch<React.SetStateAction<TransientState>>;
    setSavedState: React.Dispatch<React.SetStateAction<SavedState>>;
    currentTestable: UserTestable;
    nextTestable: UserTestable | undefined;
  },
  maybeModifyState: (s: SavedState) => SavedState = (t) => t
) => {
  setTransientState({
    ...transientState,
    incorrectAnswerGiven: null,
    inputText: "",
    lastResult: INITIAL_PROMPT,
    questionPresentedAtMillis: Date.now(),
  });
  setSavedState((savedState) => {
    const nodeFamiliarity = savedState.nodeFamiliarity;
    nodeFamiliarity[currentTestable.key] = {
      lastTestUnixMs: Date.now(),
      msUserTookToRecallCorrectly: currentTestable.tooSlowThreshold * 3,
      timesRecalledUnderThreshold: Math.max(
        0,
        nodeFamiliarity[currentTestable.key].timesRecalledUnderThreshold - 1
      ),
    };
    // If the nodefamiliarity would cause it to be tested twice in a row, move it behind the next to-be-tested by adjusting the lastTestUnixMs
    const nextToTestTime = nextTestable?.nextTestUnixMillis;
    if (
      nextToTestTime &&
      getNextTestDate(nodeFamiliarity[currentTestable.key], currentTestable) <
        nextToTestTime
    ) {
      nodeFamiliarity[currentTestable.key].lastTestUnixMs =
        nextToTestTime -
        getNextTestDelta(
          nodeFamiliarity[currentTestable.key],
          currentTestable
        ) +
        1000;
    }
    return maybeModifyState({ ...savedState, nodeFamiliarity });
  });
};
