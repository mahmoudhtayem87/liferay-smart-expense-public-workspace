/*global Liferay*/
import {useCallback, useEffect, useState} from "react";
import {deleteReport, getReportsPage} from "../services/liferay/expense-report";
import {ClayPaginationBarWithBasicItems} from "@clayui/pagination-bar";
import {Body, Cell, Head, Row, Table} from "@clayui/core";
import ClayToolbar from "@clayui/toolbar";
import ClayEmptyState from "@clayui/empty-state";
import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import ClayIcon from '@clayui/icon';
import {getThemeImages, showError, showSuccess} from "../utils/util";
import {ReportViewType} from "../models/ReportViewType";
import moment from "moment";

const DELTAS = [{label: 5}, {label: 10}, {label: 20}, {label: 40}];

const HEADERS = [
    {
        expanded: false,
        key: 'id',
        label: 'ID',
        width: "10%",
    },
    {
        expanded: true,
        key: 'title',
        label: 'Title',
        width: "20%",
    },
    {
        expanded: true,
        key: 'createDate',
        label: 'Create Date',
        width: "10%",
    }, {
        expanded: true,
        key: 'startDate',
        label: 'Start Date',
        width: "10%",
    },
    {
        expanded: false,
        key: 'endDate',
        label: 'End Date',
        width: "10%",
    },
    {
        expanded: false,
        key: 'totalAmount',
        label: 'Total Amount',
        width: "10%",
    },
    {
        expanded: false,
        key: 'status',
        label: 'Status',
        width: "10%",
    }, {
        expanded: false,
        key: 'expensesCount',
        label: 'Expenses Count',
        width: "10%",
    },
    {
        expanded: false,
        key: 'actions',
        label: '',
        width: "10%",
    }
];


const ExpenseReports = ({handleNewReport, handleSetReportId, handleIsLoading}) => {

    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [view, setView] = useState(ReportViewType.List);

    const handleDeleteReport = (id) => {

        Liferay.Util.openConfirmModal({
            message:
                "Deleting an expense report also removes it's entries. This action is permanent and cannot be undone.",
            onConfirm: (isConfirmed) => {
                if (isConfirmed) {

                    handleIsLoading(true);

                    deleteReport(id).then(result => {

                        loadData();

                        showSuccess('Report deleted.', 'Expense report deleted successfully.');

                        handleIsLoading(false);

                    }, error => {

                        showError("Unable to Delete Report", error.message);

                        handleIsLoading(false);

                    })
                }
            },
        });
    }

    const loadData = useCallback(() => {

        handleIsLoading(true);

        getReportsPage(page, pageSize).then((reports) => {

            setData(reports.items);
            setTotal(reports.totalCount);
            handleIsLoading(false);

        })
    }, [page, pageSize])

    useEffect(() => {

        loadData();

    }, [page, pageSize]);


    return (
        <>
            {total > 0 && data && (
                <div className="container">
                    <Table>
                        <Head>
                            {HEADERS.map(header =>
                                <Cell key={header.key} className="text-center" width={`${header.width}`}>
                                    <div className="text-center mb-2">
                                        {header.label}
                                    </div>
                                </Cell>
                            )}
                        </Head>
                        <Body>
                            {data.map((item, index) =>
                                <Row key={`row_${index}`}>
                                    <Cell>
                                        {item.id}
                                    </Cell>
                                    <Cell>
                                        {item.title}
                                    </Cell>
                                    <Cell>
                                        {moment(item.createDate).format('DD/MM/YYYY')}
                                    </Cell>
                                    <Cell>
                                        {moment(item.startDate).format('DD/MM/YYYY')}
                                    </Cell>
                                    <Cell>
                                        {moment(item.endDate).format('DD/MM/YYYY')}
                                    </Cell>
                                    <Cell>
                                        {`${item.reportCurrency.name} ${item.totalAmount}`}
                                    </Cell>
                                    <Cell>
                                        <strong className={"text-capitalize"}>
                                            {item.status.label}
                                        </strong>
                                    </Cell>
                                    <Cell>
                                        {item.expensesCount}
                                    </Cell>
                                    <Cell>
                                        <ClayButtonWithIcon
                                            size={'sm'}
                                            displayType={'info'}
                                            outline={true}
                                            className={'mx-1'}
                                            aria-label="View"
                                            symbol="order-form"
                                            title="View"
                                            onClick={() => {
                                                handleSetReportId(item.id)
                                            }}
                                        />

                                        {item.status.code === 2 && (
                                            <ClayButtonWithIcon
                                                size={'sm'}
                                                displayType={'danger'}
                                                className={'mx-1'}
                                                outline={true}
                                                aria-label="Delete"
                                                symbol="times-circle"
                                                title="Delete"
                                                onClick={() => {
                                                    handleDeleteReport(item.id)
                                                }}
                                            />
                                        )}
                                    </Cell>
                                </Row>
                            )}
                        </Body>
                    </Table>

                    <div className="container">
                        <ClayPaginationBarWithBasicItems
                            activeDelta={pageSize}
                            defaultActive={1}
                            deltas={DELTAS}
                            ellipsisBuffer={3}
                            onActiveChange={(page) => {
                                setPage(page);
                            }}
                            onDeltaChange={(delta) => {
                                setPageSize(delta);
                            }}
                            totalItems={total}
                        />
                    </div>
                </div>

            )}

            {total <= 0 && (

                <div className="container">
                    <ClayEmptyState
                        description={null}
                        imgProps={{alt: 'No Reports Found!', title: 'No reports found!'}}
                        imgSrc={`${getThemeImages()}/states/search_state.gif`}
                        imgSrcReducedMotion={`${getThemeImages()}/states/search_state_reduced_motion.gif`}
                        title="No Reports Found"
                    >
                        {Liferay.ThemeDisplay.isSignedIn() && (
                            <ClayButton
                                aria-label="Add Object"
                                className="lfr-portal-tooltip"
                                displayType="primary"
                                size="sm"
                                title="Add Object"
                                onClick={handleNewReport}
                            >
							<span className="inline-item inline-item-before my-auto">
								<ClayIcon symbol="plus"/>
							</span>

                                <span>New Report</span>

                            </ClayButton>
                        )}
                    </ClayEmptyState>
                </div>
            )}
        </>
    );

}

export default ExpenseReports;
