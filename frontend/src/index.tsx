import * as React from "react";
import { createRoot } from "react-dom/client";
import { Landing } from "./Landing";
import { TestPage } from "./TestPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AspectView from "~util/AspectView";
import StatsPage from "~StatsPage";
import { useLocalStorageSavedState } from "~util/useLocalStorageState";
import { SavedState } from "~TestPage/types";

const App = () => {
  const [savedState, setSavedState] = useLocalStorageSavedState<SavedState>(
    "savedState",
    {
      nodeFamiliarity: {},
      newWordsStartDate: Date.now(),
      editedCards: {}
    }
  );

  return (
    <AspectView>
      <div style={{ padding: "10px", height: "calc(100% - 20px)" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/test" element={<TestPage savedState={savedState} setSavedState={setSavedState} />} />
            <Route path="/stats" element={<StatsPage savedState={savedState} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AspectView>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
