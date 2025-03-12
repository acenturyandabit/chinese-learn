import * as React from "react";
import { SavedState } from "~TestPage/types";
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: "word", headerName: "Word", flex: 1 },
  { field: "lastTest", headerName: "Last test", flex: 1 },
  { field: "timesRecalledCorrectly", headerName: "Times recalled correctly", flex: 1 },
];

export default (props: { savedState: SavedState }) => {
  const { savedState } = props;
  return (
    <div
      style={{ maxHeight: "100%", display: "flex", flexDirection: "column" }}
    >
      <h1>Stats</h1>
      <p>
        Total words learnt: {Object.keys(savedState.nodeFamiliarity).length}
        {" "}
        <a href="/test">Return to test</a>
      </p>
      <div style={{ flex: "1", overflowY: "auto" }}>
        <DataGrid
          rows={Object.keys(savedState.nodeFamiliarity).map((key) => ({
            id: key,
            word: key,
            lastTest: new Date(
              savedState.nodeFamiliarity[key].lastTestUnixMs
            ).toLocaleString(),
            timesRecalledCorrectly: savedState.nodeFamiliarity[key]
              .timesRecalledUnderThreshold,
          }))}
          columns={columns}
        />
      </div>
    </div>
  );
};
