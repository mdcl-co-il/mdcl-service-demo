export const makeReportService = (httpSvc) => {

    const reportRequest = async (query, variables) => {
        const res = await httpSvc.post('/report/graphql', {
            query,
            variables
        });
        if (!res.data) {
            throw new Error("Something went wrong with report service...");
        }
        return res.data.data;
    };

    const newReport = async () => {

        const resp = await reportRequest(`
                    mutation newReport {
                      newReport {
                          id,
                          title,
                          created,
                          lastUpdate
                      }
                    }`, {});

        return resp.newReport.id;
    };

    const loadReport = async (report_id) => {
        const resp = await reportRequest(`
                    query($id: String) {
                      report(id:$id) {
                        id
                        title
                        created
                        lastUpdate
                        lastRun
                        lastRunDuration
                        createdByUser
                        lastEditByUser
                        columns
                      }
                    }`, {
            id: report_id
        });

        return resp.report;
    };

    const loadReports = async () => {
        try {
            const resp = await reportRequest(`
                    {
                      reports {
                        id
                        title
                        lastUpdate
                        lastEditByUser
                      }
                    }`, {});
            return resp.reports;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    const updateReportTitle = async (report_id, new_title) => {
        const resp = await reportRequest(`
                    mutation($id: String, $title: String) {
                      reportTitle(id: $id, title: $title) {
                        title
                      }
                    }`, {
            id: report_id,
            title: new_title
        });

        return resp.reportTitle;
    };

    const updateReportColumns = async (report_id, columns) => {
        const resp = await reportRequest(`
                    mutation($id: String, $columns: String) {
                      reportColumns(id: $id, columns: $columns) {
                        columns
                      }
                    }`, {
            id: report_id,
            columns: JSON.stringify(columns)
        });

        return resp.reportColumns;
    };

    const deleteReport = async (report_id) => {
        const resp = await reportRequest(`
                    mutation($id: String){
                      deleteReport(id: $id)
                    }`, {
            id: report_id
        });

        return resp.deleteReport;
    };

    const getFormsList = async () => {
        const resp = await reportRequest(`
                    {
                      forms
                    }`, {});
        return JSON.parse(resp.forms);
    };

    const getFormFields = async (formId) => {
        const resp = await reportRequest(`
                    query($id: Int) {
                      formFields(id:$id) {
                        columnsJson
                      }
                    }`, {
            id: parseInt(formId)
        });
        return JSON.parse(resp.formFields.columnsJson);
    };

    const runReport = async (reportFilter, demo = false) => {
        if (demo) {
            //reportFilter.limit = 10;
        }
        const resp = await reportRequest(`
                    query ($filter: String) {
                      runReport(filter: $filter)
                    }`, {
            filter: JSON.stringify(reportFilter)
        });

        return JSON.parse(resp.runReport);
    };

    return Object.freeze({
        newReport,
        loadReport,
        loadReports,
        updateReportTitle,
        updateReportColumns,
        deleteReport,
        getFormsList,
        getFormFields,
        runReport
    });
};

