/*global Liferay*/
import {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from "react";
import {deleteExpense, deleteReport, getReportExpensesPage, getReportsPage} from "../services/liferay/expense-report";
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
        display:true
    },
    {
        expanded: true,
        key: 'vendorDescription',
        label: 'Vendor',
        width: "30%",
        display:true
    },
    {
        expanded: true,
        key: 'createDate',
        label: 'Create Date',
        width: "10%",
        display:true
    },{
        expanded: true,
        key: 'transactionDate',
        label: 'Transaction Date',
        width: "10%",
        display:true
    },
    {
        expanded: false,
        key: 'amount',
        label: 'Amount',
        width: "10%",
        display:true
    },
    {
        expanded: false,
        key: 'expenseType',
        label: 'Expense Type',
        width: "10%",
        display:true
    },
    {
        expanded: false,
        key: 'paymentType',
        label: 'Payment Type',
        width: "10%",
        display:true
    },
    {
        expanded: false,
        key: 'actions',
        label: '',
        width: "10%",
    }
];


const ReportExpenses =  forwardRef((props, ref) => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const {reportId,handleSetReportId,handleSetView,reportStatus, handleIsLoading} = props;

    const handleExpenseDelete = (id) =>{
        Liferay.Util.openConfirmModal({
            message:
                "Deleting an expense item action is permanent and cannot be undone.",
            onConfirm: (isConfirmed) => {
                if (isConfirmed) {

                    handleIsLoading(true);

                    deleteExpense(id).then(result => {

                        loadData();

                        showSuccess('Expense deleted.', 'Expense item deleted successfully.');

                        handleIsLoading(false);

                    }, error => {

                        showError("Unable to Delete Expense", error.message);

                        handleIsLoading(false);

                    })
                }
            },
        });
    }

    const isReportEmpty = useCallback(() =>{

        return total === 0;

    },[total])

    useImperativeHandle(ref, () => ({

        isReportEmpty

    }));

    const loadData = useCallback(()=>{
        getReportExpensesPage(reportId,page,pageSize).then((expenses) => {

            setData(expenses.items);

            setTotal(expenses.totalCount);

        })
    },[page,pageSize])

    useEffect(() => {

        loadData();

    }, [page,pageSize]);


    return (
        <>
            {total > 0 && data &&  (
                <div className="container">
                    <Table>
                        <Head>
                            {HEADERS.map(header=>
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
                                        {item.vendorDescription}
                                    </Cell>
                                    <Cell>
                                        {moment(item.createDate).format('DD/MM/YYYY')}
                                    </Cell>
                                    <Cell>
                                        {moment(item.transactionDate).format('DD/MM/YYYY')}
                                    </Cell>
                                    <Cell>
                                        {`${item.currency.name} ${item.amount}`}
                                    </Cell>
                                    <Cell>
                                        {item.expenseType.name}
                                    </Cell>
                                    <Cell>
                                        {item.paymentType.name}
                                    </Cell>
                                    <Cell>
                                        <ClayButton.Group>
                                            <ClayButtonWithIcon
                                                size={'sm'}
                                                disabled={reportStatus.code !== 2}
                                                displayType={'danger'}
                                                outline={true}
                                                aria-label="Delete"
                                                symbol="times-circle"
                                                title="Delete"
                                                onClick={()=>{handleExpenseDelete(item.id)}}
                                            />
                                        </ClayButton.Group>
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

            {total <= 0 && !isLoading && (

                <div className="container">
                    <ClayEmptyState
                        description={null}
                        imgProps={{alt: 'No Expenses Found!', title: 'No expenses found!'}}
                        imgSrc={`${getThemeImages()}/states/search_state.gif`}
                        imgSrcReducedMotion={`${getThemeImages()}/states/search_state_reduced_motion.gif`}
                        title="No Expenses Found"
                    >
                        {Liferay.ThemeDisplay.isSignedIn() && (
                            <ClayButton
                                aria-label="Add Object"
                                className="lfr-portal-tooltip"
                                displayType="primary"
                                size="sm"
                                title="Add Object"
                                onClick={()=>{handleSetView(ReportViewType.NewExpense)}}
                            >
							<span className="inline-item inline-item-before my-auto">
								<ClayIcon symbol="plus" />
							</span>

                                <span>New Expense</span>

                            </ClayButton>
                        )}
                    </ClayEmptyState>
                </div>
            )}
        </>
    )

});

export default ReportExpenses;
