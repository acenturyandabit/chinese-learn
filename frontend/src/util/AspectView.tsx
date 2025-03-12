import * as React from "react";

const minAspectRatio = 16 / 9;
const maxAspectRatio = 20 / 9;

const AspectView = (props: { children: React.ReactElement }) => {
  injectStyle(`
    #root, html, body {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
`);
  const [constraint, setConstraint] = React.useState(getConstraint());
  React.useEffect(() => {
    const handleResize = () => {
      setConstraint(getConstraint());
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        background: "black",
      }}
    >
      <div style={{ ...constraint, background: "white", position: "relative" }}>{props.children}</div>
    </div>
  );
};

const getConstraint = () => {
  const currentAspectRatio = window.innerHeight / window.innerWidth;
  if (currentAspectRatio < minAspectRatio) {
    return {
      width: window.innerHeight / minAspectRatio + "px",
      height: "100%",
    };
  }
  if (currentAspectRatio > maxAspectRatio) {
    return {
      width: "100%",
      height: window.innerWidth * maxAspectRatio + "px",
    };
  }
  return {
    width: "100%",
    height: "100%",
  };
};

const injectStyle = (css: string) => {
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [css]);
};

export default AspectView;
