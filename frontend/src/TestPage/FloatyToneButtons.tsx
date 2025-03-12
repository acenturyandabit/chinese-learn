import { FloatyRegion } from "../util/FloatyRegion";
import { TransientState } from "./types";
import * as React from "react";

enum ButtonHandednessEnum {
  Center = 0,
  Right,
  Left,
  NUM_HANDEDNESS,
}

const commonHalfWidthStyle = {
  position: "absolute",
  display: "flex",
  bottom: 0,
  width: "50%",
  flexWrap: "wrap"
} as const;

const buttonHandednessEnumToStyle = {
  [ButtonHandednessEnum.Center]: {},
  [ButtonHandednessEnum.Right]: {
    right: "0px",
    ...commonHalfWidthStyle,
  },
  [ButtonHandednessEnum.Left]: {
    left: "0px",
    ...commonHalfWidthStyle,
  },
  [ButtonHandednessEnum.NUM_HANDEDNESS]: {},
};

export default (props: {
  inputRef: React.RefObject<HTMLInputElement>;
  setTransientState: React.Dispatch<React.SetStateAction<TransientState>>;
  transientState: TransientState;
}) => {
  const { inputRef, setTransientState, transientState } = props;
  const [buttonHandednessEnum, setButtonHandednessEnum] =
    React.useState<ButtonHandednessEnum>(ButtonHandednessEnum.Center);
  return (
    <FloatyRegion
      style={{ bottom: "0px", marginTop: "auto", position: "relative" }}
      stickyHeightPct={100}
    >
      <div
        style={Object.assign(
          { width: "100%", display: "flex", flexDirection: "row" } as const,
          buttonHandednessEnumToStyle[buttonHandednessEnum]
        )}
      >
        {["ā", "á", "ǎ", "à", "a"].map((char, index) => (
          <button
            key={index}
            style={{ flex: "1 1 10vw", height: "3em" }}
            onClick={() => {
              const savedSelectionStart = inputRef.current?.selectionStart || 0;
              setTransientState({
                ...transientState,
                inputText:
                  transientState.inputText.slice(
                    0,
                    inputRef.current?.selectionStart || 0
                  ) +
                  (index + 1) +
                  transientState.inputText.slice(
                    inputRef.current?.selectionEnd || 0
                  ),
              });
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.selectionStart = savedSelectionStart + 1;
                  inputRef.current.selectionEnd = savedSelectionStart + 1;
                }
              });
            }}
          >
            {char}
          </button>
        ))}
        <button
          onClick={() => {
            setButtonHandednessEnum(
              (e) => (e + 1) % ButtonHandednessEnum.NUM_HANDEDNESS
            );
          }}
        >
          ⚙️
        </button>
      </div>
    </FloatyRegion>
  );
};
