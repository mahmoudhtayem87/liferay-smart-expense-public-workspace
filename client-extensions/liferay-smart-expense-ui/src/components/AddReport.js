import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { useFormik } from "formik";
import ClayForm from "@clayui/form";
import {getReportsPage, postReport} from "../services/liferay/expense-report";
import {getCurrenciesPickListEntries} from "../services/liferay/pick-list";
import {showError, showSuccess} from "../utils/util";

const AddReport = forwardRef((props, ref) => {

    const { handleClose, handleReload,handleIsLoading } = props;

    const [currencies, setCurrencies] = useState(null);

    const loadLookups = async () =>{

        handleIsLoading(true);

        let _currencies = await getCurrenciesPickListEntries();

        setCurrencies(_currencies.items);

        handleIsLoading(false);

    }

    useImperativeHandle(ref, () => ({
        handleSubmit
    }));

    const { errors, handleChange, handleSubmit, touched, values } = useFormik({
        initialValues: {
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            reportCurrency:''
        },
        onSubmit: (values) => {

            handleIsLoading(true);

            postReport(values).then(result => {

                handleIsLoading(false);

                showSuccess("Report Created","Report created successfully.");

                handleClose();

            },error=>{

                showError("Report created failed",error.message);

            })
        },
        validate: (values) => {
            const errors = {};

            if (!values.title) {
                errors.title = "Please provide a title for the report.";
            }

            if (!values.startDate) {
                errors.startDate = "Please select a valid start date.";
            }

            if (!values.reportCurrency) {
                errors.reportCurrency = "Please select a currency for the report.";
            }

            if (!values.endDate) {
                errors.endDate = "Please select a valid end date.";
            }

            if (!values.description) {
                errors.description = "Please provide a description for the report.";
            }

            return errors;
        }
    });

    useEffect(()=>{

        loadLookups();

    },[])

    return (
        <div className="sheet sheet-lg">
            <div className="sheet-header">
                <h2 className="sheet-title">New Expense Report</h2>
                <div className="sheet-text">

                </div>
            </div>
            <div className="sheet-section">
                <ClayForm onSubmit={handleSubmit}>
                    <ClayForm.Group className="form-group-sm">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                        />
                        {errors.title && touched.title && (
                            <div className="form-feedback-item mt-2 text-2 text-danger">
                                {errors.title}
                            </div>
                        )}
                    </ClayForm.Group>

                    <ClayForm.Group className="form-group-sm">
                        <label htmlFor="description">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                        />
                        {errors.description && touched.description && (
                            <div className="form-feedback-item mt-2 text-2 text-danger">
                                {errors.description}
                            </div>
                        )}
                    </ClayForm.Group>

                    <ClayForm.Group className="form-group-sm">
                        <label htmlFor="reportCurrency">Report Currency</label>
                        <select
                            className="form-control"
                            id="reportCurrency"
                            onChange={handleChange}
                        >
                            <option></option>

                            {currencies && currencies.length > 0 && currencies.map((currency) => (
                                <option key={currency.key} value={currency.key}>
                                    {currency.name}
                                </option>
                            ))}
                        </select>
                        {errors.reportCurrency && touched.reportCurrency && (
                            <div className="form-feedback-item mt-2 text-2 text-danger">
                                {errors.reportCurrency}
                            </div>
                        )}
                    </ClayForm.Group>

                    <ClayForm.Group className="form-group-sm">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="startDate"
                            name="startDate"
                            value={values.startDate}
                            onChange={handleChange}
                        />
                        {errors.startDate && touched.startDate && (
                            <div className="form-feedback-item mt-2 text-2 text-danger">
                                {errors.startDate}
                            </div>
                        )}
                    </ClayForm.Group>

                    <ClayForm.Group className="form-group-sm">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="endDate"
                            name="endDate"
                            value={values.endDate}
                            onChange={handleChange}
                        />
                        {errors.endDate && touched.endDate && (
                            <div className="form-feedback-item mt-2 text-2 text-danger">
                                {errors.endDate}
                            </div>
                        )}
                    </ClayForm.Group>
                </ClayForm>
            </div>
        </div>
    );
});

export default AddReport;
