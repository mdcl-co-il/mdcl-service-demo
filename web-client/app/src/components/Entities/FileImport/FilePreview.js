import React from 'react';
import BootstrapTable from "react-bootstrap-table-next";
import {ACTIONS} from "./FileImportModalRedux";

function FilePreview({dispatch, previewData}) {

    const getSelectedIndexes = () => {
        return previewData.data.rows.filter(row => row.hasOwnProperty("selected") && row.selected).map(row => row.index);
    };

    const onRowSelected = (row, isSelect) => {
        row.selected = !!isSelect;

        dispatch({type: ACTIONS.UPDATE_PREVIEW_SELECTION, payload: {selectedRows: getSelectedIndexes()}});
        return row.valid;
    };

    const selectRowOptions = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: onRowSelected.bind(this),
        onSelectAll: (isSelect, rows, e) => {
            let selectedIds = [];
            if (isSelect) {
                const selectable = rows.filter(row => row.valid);
                selectedIds = selectable.map(row => row.generated_id);
                selectable.forEach(row => {
                    row.selected = true;
                });
            } else {
                selectedIds = [];
                rows.forEach(row => {
                    row.selected = false;
                });
            }
            dispatch({type: ACTIONS.UPDATE_PREVIEW_SELECTION, payload: {selectedRows: getSelectedIndexes()}});
            return selectedIds;
        }
    };

    return (
        <>
            <BootstrapTable keyField={previewData.data.keyField}
                            data={previewData.data.rows}
                            columns={previewData.data.columns}
                            selectRow={selectRowOptions}/>
        </>
    );
}

export default FilePreview;