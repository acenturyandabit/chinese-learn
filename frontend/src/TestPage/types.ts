import { NodeFamiliarity } from "./testAlgorithms";

export type TransientState = {
  questionPresentedAtMillis: number;
  incorrectAnswerGiven: string | null;
  inputText: string;
  lastResult: string;
  isMoreInfoVisible: boolean;
};

export type SavedState = {
  nodeFamiliarity: Record<string, NodeFamiliarity>;
  newWordsStartDate: number;
  editedCards: Record<string, string>
};
