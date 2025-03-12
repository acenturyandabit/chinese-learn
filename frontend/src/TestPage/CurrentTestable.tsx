import * as React from "react";
import { UserTestable } from "./testAlgorithms";
import { TransientState, SavedState } from "./types";

export const CurrentTestable = ({
  transientState,
  setTransientState,
  setSavedState,
  currentTestable,
  inputRef
}: {
  transientState: TransientState;
  setTransientState: React.Dispatch<React.SetStateAction<TransientState>>;
  setSavedState: React.Dispatch<React.SetStateAction<SavedState>>;
  currentTestable: UserTestable;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}) => {
  const handleKeyUpFn = handleKeyUp(
    transientState,
    setTransientState,
    setSavedState,
    currentTestable
  );
  return <>
    <h1>{currentTestable.display}</h1>
    <p>{transientState.lastResult}</p>
    <input
      value={transientState.inputText}
      ref={(input) => {
        if (!input) return;
        inputRef.current = input;
        input.focus()
      }}
      onChange={(e) =>
        setTransientState({
          ...transientState,
          inputText: e.target.value,
        })
      }
      onKeyUp={handleKeyUpFn}
    />
    <button onClick={()=>handleKeyUpFn({key: "Enter"})}>Submit (or press Enter)</button>
  </>
};

const handleKeyUp =
  (
    transientState: TransientState,
    setTransientState: React.Dispatch<React.SetStateAction<TransientState>>,
    setSavedState: React.Dispatch<React.SetStateAction<SavedState>>,
    currentTestable: UserTestable
  ) =>
  (e: {key: string}) => {
    if (e.key == "Enter" && transientState.inputText != "") {
      const wasCorrect =
        transientState.inputText.toLowerCase() == currentTestable.reveal;
      const tookHowLong = Date.now() - transientState.questionPresentedAtMillis;
      setTransientState((transientState) => {
        const lastResult = wasCorrect
          ? `Correct! (${tookHowLong}ms)${tookHowLong > currentTestable.tooSlowThreshold ? " but too slow..." : ""}`
          : `Expected ${currentTestable.reveal}, got ${transientState.inputText}`;
        return {
          ...transientState,
          inputText: "",
          lastResult,
          questionPresentedAtMillis: Date.now(),
          incorrectAnswerGiven: wasCorrect ? null : transientState.inputText,
        };
      });
      setSavedState((savedState) => {
        const nodeFamiliarity = savedState.nodeFamiliarity;
        if (wasCorrect) {
          nodeFamiliarity[currentTestable.key] = {
            lastTestUnixMs: Date.now(),
            msUserTookToRecallCorrectly: tookHowLong,
            timesRecalledUnderThreshold:
              nodeFamiliarity[currentTestable.key].timesRecalledUnderThreshold +
              (tookHowLong < currentTestable.tooSlowThreshold ? 1 : 0),
          };
        }
        return { ...savedState, nodeFamiliarity };
      });
    }
  };
