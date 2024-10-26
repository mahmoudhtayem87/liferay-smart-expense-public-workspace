/* global Liferay */
import {useRef, useState} from "react";
import {ReportViewType} from "../models/ReportViewType";
import ClayToolbar from "@clayui/toolbar";
import ClayButton from "@clayui/button";
import ClayIcon from "@clayui/icon";
import ExpenseReports from "./ExpenseReports";
import AddReport from "./AddReport";
import ExpenseReport from "./ExpenseReport";
import AddExpense from "./AddExpense";
import ClayUpperToolbar from '@clayui/upper-toolbar';
import ClayLoadingIndicator from "@clayui/loading-indicator";

const Dashboard = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState(ReportViewType.List);
    const [reportId, setReportId] = useState(null);
    const [report, setReport] = useState(null);

    const newReportComponentRef = useRef(null);
    const newExpenseComponentRef = useRef(null);
    const expenseReportComponentRef = useRef(null);

    const handleNewReport = () => {
        setView(ReportViewType.NewReport);
    }

    const handleViewReports = () => {
        setView(ReportViewType.List);
    }

    const handleSetReportId = (reportId) => {

        setReportId(reportId);

        setView(ReportViewType.ReportView);
    }

    const handleSubmitReport = () => {

        if (expenseReportComponentRef.current) {
            expenseReportComponentRef.current.handleSubmitReport();
        }
    }

    const handleSetView = (viewKey) => {

        setView(viewKey);

    }

    const handleCreateReport = () => {
        if (newReportComponentRef.current) {
            newReportComponentRef.current.handleSubmit();
        }
    }

    const handleSubmitExpense = () => {
        if (newExpenseComponentRef.current) {
            newExpenseComponentRef.current.handleSubmit();
        }
    }

    return (
        <>
            <ClayToolbar className="mb-3 bg-white">

                <ClayToolbar.Nav className="container">

                    <ClayToolbar.Item>
                        {isLoading && (
                            <span>
                                <ClayLoadingIndicator displayType="secondary" size="sm"/>
                            </span>
                        )}
                    </ClayToolbar.Item>
                    {view === ReportViewType.List && (
                        <>

                        </>
                    )}
                    {view === ReportViewType.ReportView && (
                        <>
                            <ClayUpperToolbar.Item>
                                <ClayButton displayType={'unstyled'} onClick={handleViewReports}>
                                <span className="inline-item inline-item-before">
                                    <ClayIcon symbol="angle-left"/>
                                </span>
                                </ClayButton>
                            </ClayUpperToolbar.Item>
                        </>
                    )}

                    {view === ReportViewType.NewReport && (
                        <>
                            <ClayUpperToolbar.Item>
                                <ClayButton displayType={'unstyled'} className={"mx-1"} disabled={isLoading}
                                            onClick={handleViewReports}>
                                <span className="inline-item inline-item-before">
                                    <ClayIcon symbol="times"/>
                                </span>
                                </ClayButton>
                            </ClayUpperToolbar.Item>
                        </>

                    )}

                    {view === ReportViewType.NewExpense && (
                        <>
                            <ClayUpperToolbar.Item>
                                <ClayButton displayType={'unstyled'} className={"mx-1"} disabled={isLoading}
                                            onClick={() => {
                                                handleSetView(ReportViewType.ReportView)
                                            }}>
                                <span className="inline-item inline-item-before">
                                    <ClayIcon symbol="times"/>
                                </span>
                                </ClayButton>
                            </ClayUpperToolbar.Item>
                        </>
                    )}

                    <ClayToolbar.Item className="text-left" expand>

                    </ClayToolbar.Item>


                    {view === ReportViewType.List && (
                        <>
                            <ClayUpperToolbar.Item>
                                <ClayButton onClick={handleNewReport}>
                                <span className="inline-item inline-item-before">
                                    <ClayIcon symbol="plus"/>
                                </span>
                                    New Report
                                </ClayButton>
                            </ClayUpperToolbar.Item>
                        </>
                    )}
                    {view === ReportViewType.ReportView && (
                        <>
                            <ClayUpperToolbar.Item>
                                {report && report.status.code === 2 && (
                                    <ClayButton onClick={() => {
                                        handleSetView(ReportViewType.NewExpense)
                                    }}>
                                <span className="inline-item inline-item-before">
                                    <ClayIcon symbol="plus"/>
                                </span>
                                        Add Expense
                                    </ClayButton>
                                )}
                            </ClayUpperToolbar.Item>
                            {report && report.status.code === 2 && (
                                <ClayUpperToolbar.Item>
                                    <ClayButton onClick={handleSubmitReport}>
                                <span className="inline-item inline-item-before">
                                    <ClayIcon symbol="check"/>
                                </span>
                                        Submit Report
                                    </ClayButton>
                                </ClayUpperToolbar.Item>
                            )}
                        </>
                    )}

                    {view === ReportViewType.NewReport && (
                        <>
                            <ClayUpperToolbar.Item>
                                <ClayButton disabled={isLoading} onClick={handleCreateReport}>
                                <span className="inline-item inline-item-before">
                                    <ClayIcon symbol="disk"/>
                                </span>
                                    Create Report
                                </ClayButton>
                            </ClayUpperToolbar.Item>
                        </>

                    )}

                    {view === ReportViewType.NewExpense && (
                        <>
                            <ClayUpperToolbar.Item>
                                <ClayButton disabled={isLoading} onClick={handleSubmitExpense}>
                                <span className="inline-item inline-item-before">
                                    <ClayIcon symbol="disk"/>
                                </span>
                                    Submit Expense
                                </ClayButton>
                            </ClayUpperToolbar.Item>
                        </>
                    )}

                </ClayToolbar.Nav>

            </ClayToolbar>

            <>
                {view === ReportViewType.List && (
                    <ExpenseReports handleSetView={handleSetView} handleIsLoading={setIsLoading}
                                    handleSetReportId={handleSetReportId}
                                    handleNewReport={handleNewReport}></ExpenseReports>
                )}

                {
                    view === ReportViewType.NewReport && (
                        <AddReport handleSetView={handleSetView} handleClose={handleViewReports}
                                   handleIsLoading={setIsLoading} ref={newReportComponentRef}></AddReport>
                    )
                }

                {
                    view === ReportViewType.ReportView && (
                        <ExpenseReport ref={expenseReportComponentRef} handleSetView={handleSetView}
                                       handleIsLoading={setIsLoading} handleSetReport={setReport}
                                       id={reportId}></ExpenseReport>
                    )
                }

                {
                    view === ReportViewType.NewExpense && (
                        <AddExpense isLoading={isLoading} ref={newExpenseComponentRef} handleIsLoading={setIsLoading}
                                    handleSetView={handleSetView} reportId={reportId}></AddExpense>
                    )
                }
            </>
        </>
    );
}


export default Dashboard;
