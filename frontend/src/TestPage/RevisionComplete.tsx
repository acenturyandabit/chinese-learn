import * as React from "react";
import { SavedState } from "./types";
import { data } from "../data";
import { MILLIS_PER_DAY } from "~TestPage/testAlgorithms";

export const RevisionComplete = (props: {
  savedState: SavedState;
  setSavedState: React.Dispatch<React.SetStateAction<SavedState>>;
}) => (
  <>
    <div>Revision for today complete</div>
    <p>
      Total words learnt: {Object.keys(props.savedState.nodeFamiliarity).length}
    </p>
    <p>
      Total familiar:{" "}
      {
        Object.values(props.savedState.nodeFamiliarity).filter(
          (i) => i.timesRecalledUnderThreshold > 1
        ).length
      }
    </p>
    <p>Total words: {data.length}</p>
    <button
      onClick={() =>
        // pretend we started one day earlier, which effectively adds new words
        props.setSavedState({
          ...props.savedState,
          nodeFamiliarity: (()=>{
            for (const key in props.savedState.nodeFamiliarity){
              props.savedState.nodeFamiliarity[key].lastTestUnixMs -= MILLIS_PER_DAY;
            }
            return props.savedState.nodeFamiliarity;
          })(),
          newWordsStartDate:
            props.savedState.newWordsStartDate - MILLIS_PER_DAY,
        })
      }
    >
      Add new words
    </button>
  </>
);
