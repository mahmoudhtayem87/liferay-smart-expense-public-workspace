import {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from "react";
import {useFormik} from "formik";
import ClayForm from "@clayui/form";
import {getReportsPage, postExpense, postReport} from "../services/liferay/expense-report";
import {
    getCurrenciesPickListEntries,
    getExpenseTypePickListEntries,
    getPaymentTypePickListEntries
} from "../services/liferay/pick-list";
import ClayLayout from '@clayui/layout';
import {getNumericValue, showError, showSuccess} from "../utils/util";
import {analyzeReceipt} from "../services/cx-services/ai";
import moment from 'moment';
import {ReportViewType} from "../models/ReportViewType";

const AddExpense = forwardRef((props, ref) => {

    const {handleClose, handleReload, handleSetView , handleIsLoading, reportId, isLoading} = props;

    const [currencies, setCurrencies] = useState(null);
    const [expenseTypes, setExpenseTypes] = useState(null);
    const [paymentTypes, setPaymentTypes] = useState(null);
    const [receiptImage, setReceiptImage] = useState(null);

    const [analyzedReceiptData, setAnalyzedReceiptData] = useState(null);

    const handleFileChange =  (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {

                handleIsLoading(true);

                setAnalyzedReceiptData(await analyzeReceipt(reader.result.split('base64,')[1]));

                setReceiptImage(reader.result);

                setFieldValue("receipt", {
                    fileBase64:reader.result.split('base64,')[1],
                    name: file.name,
                });

                handleIsLoading(false);

            };
            reader.readAsDataURL(file);
        }
    }

    const loadLookups = async () => {

        handleIsLoading(true);

        let _currencies = await getCurrenciesPickListEntries();
        let _expenseTypes = await getExpenseTypePickListEntries();
        let _paymentTypes = await getPaymentTypePickListEntries();

        setCurrencies(_currencies.items);
        setExpenseTypes(_expenseTypes.items);
        setPaymentTypes(_paymentTypes.items);

        handleIsLoading(false);

    }

    useImperativeHandle(ref, () => ({
        handleSubmit
    }));

    const {errors, handleChange, handleSubmit, touched, values, setFieldValue} = useFormik({
        initialValues: {
            vendorDescription: '',
            receipt: null,
            r_expense_c_expenseReportId:reportId,
            transactionDate: '',
            comment: '',
            amount: '',
            businessPurpose: '',
            expenseType: '',
            paymentType: '',
            currency: '',
            vendorAddress: '',
            tax: '',
            discount: '',
            tips: ''
        },
        onSubmit: (values) => {
            handleIsLoading(true);

            postExpense(values).then(result => {

                handleIsLoading(false);

                showSuccess("Expense Created", "Expense created successfully.");

                handleSetView(ReportViewType.ReportView);

            }, error => {
                handleIsLoading(false);
                showError("Expense creation failed", error.message);
            });
        },
        validate: (values) => {
            const errors = {};

            if (!values.amount) errors.amount = "Please provide an amount.";

            if (!values.transactionDate || !moment(values.transactionDate).isValid()) errors.transactionDate = "Please provide transaction date.";

            if (!values.receipt) errors.receipt = "Please provide a copy of the receipt.";

            if (!values.expenseType) errors.expenseType = "Please select an expense type.";

            if (!values.paymentType) errors.paymentType = "Please select a payment type.";

            if (!values.vendorDescription) errors.vendorDescription = "Please provide a vendor description.";

            if (!values.businessPurpose) errors.businessPurpose = "Please provide a business purpose.";

            if (!values.currency) errors.currency = "Please select a currency.";

            if (values.tax == null || values.tax === "") errors.tax = "Please provide the tax amount.";

            if (values.discount == null || values.discount === "") errors.discount = "Please provide the discount amount.";

            if (values.tips == null || values.tips === "") errors.tips = "Please provide the tips amount.";

            return errors;
        }
    });

    useEffect(() => {

        setFieldValue('amount',getNumericValue("0"));
        setFieldValue('tax',getNumericValue("0"));
        setFieldValue('tips',getNumericValue("0"));
        setFieldValue('discount',getNumericValue("0"));

        setFieldValue('vendorDescription',"");
        setFieldValue('vendorAddress',"");


        if (analyzedReceiptData && analyzedReceiptData.receipt) {

            setFieldValue('amount',getNumericValue(analyzedReceiptData.receipt.total || "0"));
            setFieldValue('discount',getNumericValue(analyzedReceiptData.receipt.discount || "0"));
            setFieldValue('tax',getNumericValue(analyzedReceiptData.receipt.tax || "0"));
            setFieldValue('tips',getNumericValue(analyzedReceiptData.receipt.tips || "0"));

            setFieldValue('vendorDescription',(analyzedReceiptData.receipt.store_name || ""));
            setFieldValue('vendorAddress',(analyzedReceiptData.receipt.store_addr || ""));


            if (analyzedReceiptData.receipt.date && moment(analyzedReceiptData.receipt.date,"DD-MM-YYYY").isValid()){
                setFieldValue('transactionDate',moment(analyzedReceiptData.receipt.date,"DD-MM-YYYY").format('YYYY-MM-DD'));
            }


        }

    }, [analyzedReceiptData]);

    useEffect(() => {
        loadLookups();
    }, []);

    return (
        <ClayForm onSubmit={handleSubmit}>
            <ClayLayout.ContainerFluid view>
                <ClayLayout.Row justify="start">
                    <ClayLayout.Col lg={8} md={6} sm={12}>
                        <div className="sheet sheet-lg">
                            <div className="sheet-header">
                                <h2 className="sheet-title">Expense Information</h2>
                            </div>
                            <div className="sheet-section">
                                <ClayLayout.ContainerFluid view>
                                    <ClayLayout.Row justify="start">
                                        <ClayLayout.Col lg={12} md={12} sm={12}>
                                            {/* Vendor Description */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="vendorDescription">Vendor Description</label>
                                                <textarea
                                                    className="form-control"
                                                    id="vendorDescription"
                                                    name="vendorDescription"
                                                    value={values.vendorDescription}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                />
                                                {errors.vendorDescription && touched.vendorDescription && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.vendorDescription}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                    </ClayLayout.Row>
                                    <ClayLayout.Row justify="start">
                                        <ClayLayout.Col lg={6} md={6} sm={6}>
                                            {/* Expense Type */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="expenseType">Expense Type</label>
                                                <select
                                                    className="form-control"
                                                    id="expenseType"
                                                    name="expenseType"
                                                    value={values.expenseType}
                                                    onChange={handleChange}
                                                >
                                                    <option value=""></option>
                                                    {expenseTypes && expenseTypes.length > 0 && expenseTypes.map((type) => (
                                                        <option key={type.key} value={type.key}>
                                                            {type.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.expenseType && touched.expenseType && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.expenseType}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                        <ClayLayout.Col lg={6} md={6} sm={6}>
                                            {/* Payment Type */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="paymentType">Payment Type</label>
                                                <select
                                                    className="form-control"
                                                    id="paymentType"
                                                    name="paymentType"
                                                    value={values.paymentType}
                                                    onChange={handleChange}
                                                >
                                                    <option value=""></option>
                                                    {paymentTypes && paymentTypes.length > 0 && paymentTypes.map((type) => (
                                                        <option key={type.key} value={type.key}>
                                                            {type.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.paymentType && touched.paymentType && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.paymentType}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                    </ClayLayout.Row>
                                    <ClayLayout.Row justify="start">
                                        <ClayLayout.Col lg={12} md={12} sm={12}>
                                            {/* Business Purpose */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="businessPurpose">Business Purpose</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="businessPurpose"
                                                    name="businessPurpose"
                                                    value={values.businessPurpose}
                                                    onChange={handleChange}
                                                />
                                                {errors.businessPurpose && touched.businessPurpose && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.businessPurpose}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                    </ClayLayout.Row>
                                    <ClayLayout.Row justify="start">
                                        <ClayLayout.Col lg={12} md={12} sm={12}>
                                            {/* Vendor Address */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="vendorAddress">Vendor Address</label>
                                                <textarea
                                                    className="form-control"
                                                    id="vendorAddress"
                                                    name="vendorAddress"
                                                    disabled={isLoading}
                                                    value={values.vendorAddress}
                                                    onChange={handleChange}
                                                />
                                                {errors.vendorAddress && touched.vendorAddress && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.vendorAddress}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                    </ClayLayout.Row>
                                    <ClayLayout.Row justify="start">
                                        <ClayLayout.Col lg={12} md={12} sm={12}>
                                            {/* comment */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="comment">Comment</label>
                                                <textarea
                                                    className="form-control"
                                                    id="comment"
                                                    name="comment"
                                                    value={values.comment}
                                                    onChange={handleChange}
                                                />
                                                {errors.comment && touched.comment && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.comment}
                                                    </div>
                                                )}
                                            </ClayForm.Group>

                                        </ClayLayout.Col>
                                    </ClayLayout.Row>
                                </ClayLayout.ContainerFluid>
                            </div>
                        </div>
                    </ClayLayout.Col>
                    <ClayLayout.Col lg={4} md={6} sm={12}>
                        <div className="sheet sheet-lg">
                            <div className="sheet-header">
                                <h2 className="sheet-title">Expense Receipt</h2>
                            </div>
                            <div className="sheet-section">
                                <ClayLayout.ContainerFluid view>
                                    <ClayLayout.Row justify="start">
                                        <ClayLayout.Col lg={12} md={12} sm={12}>
                                            {/* receipt */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="receipt">Receipt</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="receipt"
                                                    disabled={isLoading}
                                                    name="receipt"
                                                    onChange={handleFileChange}
                                                />
                                                {errors.receipt && touched.receipt && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.receipt}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                    </ClayLayout.Row>
                                    <ClayLayout.Row justify="start">
                                        <ClayLayout.Col size={12}>
                                            {/* Currency */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="currency">Currency</label>
                                                <select
                                                    className="form-control"
                                                    id="currency"
                                                    name="currency"
                                                    value={values.currency}
                                                    onChange={handleChange}
                                                >
                                                    <option value=""></option>
                                                    {currencies && currencies.length > 0 && currencies.map((currency) => (
                                                        <option key={currency.key} value={currency.key}>
                                                            {currency.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.currency && touched.currency && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.currency}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                        <ClayLayout.Col size={12}>
                                            {/* Transaction Date */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="transactionDate">Transaction Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="transactionDate"
                                                    name="transactionDate"
                                                    disabled={isLoading}
                                                    value={values.transactionDate}
                                                    onChange={handleChange}
                                                />
                                                {errors.transactionDate && touched.transactionDate && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.transactionDate}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                        <ClayLayout.Col size={12}>
                                            {/* amount */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="amount">Amount</label>
                                                <input
                                                    className="form-control"
                                                    disabled={isLoading}
                                                    id="amount"
                                                    name="amount"
                                                    onChange={handleChange}
                                                    type="number"
                                                    value={values.amount}
                                                />
                                                {errors.amount && touched.amount && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.amount}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                        <ClayLayout.Col size={12}>
                                            {/* Tax */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="tax">Tax</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="tax"
                                                    name="tax"
                                                    value={values.tax}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                />
                                                {errors.tax && touched.tax && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.tax}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                        <ClayLayout.Col size={12}>
                                            {/* Discount */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="discount">Discount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="discount"
                                                    name="discount"
                                                    value={values.discount}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                />
                                                {errors.discount && touched.discount && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.discount}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                        <ClayLayout.Col size={12}>
                                            {/* Tips */}
                                            <ClayForm.Group className="form-group-sm">
                                                <label htmlFor="tips">Tips</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="tips"
                                                    name="tips"
                                                    value={values.tips}
                                                    onChange={handleChange}
                                                    disabled={isLoading}
                                                />
                                                {errors.tips && touched.tips && (
                                                    <div className="form-feedback-item mt-2 text-2 text-danger">
                                                        {errors.tips}
                                                    </div>
                                                )}
                                            </ClayForm.Group>
                                        </ClayLayout.Col>
                                        {receiptImage && (
                                            <ClayLayout.Col lg={12} md={12} sm={12}>
                                                <img width={'100%'} src={receiptImage} />
                                            </ClayLayout.Col>
                                        )}
                                    </ClayLayout.Row>
                                </ClayLayout.ContainerFluid>
                            </div>
                        </div>
                    </ClayLayout.Col>
                </ClayLayout.Row>
            </ClayLayout.ContainerFluid>

        </ClayForm>

    );
});

export default AddExpense;
