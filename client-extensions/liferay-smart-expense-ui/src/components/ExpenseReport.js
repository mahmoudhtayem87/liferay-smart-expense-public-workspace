/*global Liferay*/
import {deleteReport, getReportById, patchReport} from "../services/liferay/expense-report";
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import ReportExpenses from "./ReportExpenses";
import ClayLayout from "@clayui/layout";
import moment from "moment/moment";
import ClayRow from "@clayui/layout/lib/Row";
import {showError, showSuccess} from "../utils/util";

const ExpenseReport =  forwardRef((props, ref) => {

    const [report, setReport] = useState(null);
    const {id,handleIsLoading,handleSetView,handleSetReport} = props;

    const reportExpensesComponentRef = useRef(null);

    useImperativeHandle(ref, () => ({

        handleSubmitReport

    }));

    const isReportEmpty = ()=>{
        if(reportExpensesComponentRef.current){
            return reportExpensesComponentRef.current.isReportEmpty();
        }
    }

    const handleSubmitReport = async ()=>{

        if (isReportEmpty()){

            showError("Report is empty","Please add at least one expense to the report, as it currently has none.");

            return;

        }

        Liferay.Util.openConfirmModal({
            message:
                "Are you sure you want to submit this expense report for approval? Once submitted, you won’t be able to make any changes.",
            onConfirm: (isConfirmed) => {
                if (isConfirmed) {

                    handleIsLoading(true);

                    patchReport(id,{
                        status:{
                            code:0
                        }}).then(result => {

                        loadReport();

                        showSuccess("Success","Report submitted successfully.");

                        handleIsLoading(false);

                    }, error => {

                        showError("Report Submission Error",error.message);

                        handleIsLoading(false);

                    })
                }
            },
        });

    }

    const loadReport = async () =>{

        handleIsLoading(true);

        let _report = await getReportById(id);

        setReport(_report);

        handleSetReport(_report)

        handleIsLoading(false);

    }

    useEffect(() => {

        loadReport();

    }, []);

    return (<>
        {report && (

            <ClayLayout.ContainerFluid view>
                <ClayLayout.Row justify="start">
                    <ClayLayout.Col lg={12} md={6} sm={12}>
                        <div className="sheet mb-3">
                            <div className="sheet-section">
                                <ClayLayout.Row justify="start">
                                    <ClayLayout.Col size={12}>
                                        <h2 className="sheet-title">Report Information</h2>
                                    </ClayLayout.Col>
                                    <ClayLayout.Col size={12}>
                                        <strong className={"mb-2"}>Title:</strong> {report.title}
                                    </ClayLayout.Col>
                                    <ClayLayout.Col size={12}>
                                        <strong className={"mb-2"}>Description:</strong> {report.description}
                                    </ClayLayout.Col>
                                </ClayLayout.Row>
                                <ClayRow>
                                    <ClayLayout.Col lg={3} md={3} sm={12}>
                                        <strong>Start Date: </strong> {moment(report.startDate).format('DD/MM/YYYY')}
                                    </ClayLayout.Col>
                                    <ClayLayout.Col lg={3} md={3} sm={12}>
                                        <strong>End Date: </strong> {moment(report.endDate).format('DD/MM/YYYY')}
                                    </ClayLayout.Col>
                                    <ClayLayout.Col lg={3} md={3} sm={12}>
                                        <strong>Total Amount: </strong> {`${report.reportCurrency.name} ${report.totalAmount}`}
                                    </ClayLayout.Col>
                                    <ClayLayout.Col lg={3} md={3} sm={12}>
                                        <strong>Status: </strong> <span className={"text-capitalize"}>{`${report.status.label}`}</span>
                                    </ClayLayout.Col>
                                </ClayRow>
                            </div>
                        </div>
                    </ClayLayout.Col>
                    <ClayLayout.Col lg={12} md={6} sm={12}>

                        {report && (

                            <ReportExpenses ref={reportExpensesComponentRef} reportStatus={report.status} handleIsLoading={handleIsLoading} handleSetView={handleSetView} reportId={id}></ReportExpenses>

                        )}

                    </ClayLayout.Col>
                </ClayLayout.Row>
            </ClayLayout.ContainerFluid>
        )}

    </>);

});

export default ExpenseReport;
