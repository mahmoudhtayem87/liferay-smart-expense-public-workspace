/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
/* global Liferay */


export const config = {

	agentOauthAppId: 'liferay-smart-expense-etc-node-oauth-application-user-agent',

	objectApiEndPoint: ``,

	reportEndPoint: '/o/c/expensereports/',
	expenseEndPoint:'/o/c/expenseitems/',
	receiptAIEndPoint:'/ai/receipt/analyze',
	liferayPickListEndPoint:'/o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/',

	pickListCurrencies: 'T4T14_SMART_EXPENSE_CURRENCY',
	pickListExpenseType: 'T4T14_SMART_EXPENSE_TYPE',
	pickListPaymentType: 'T4T14_SMART_EXPENSE_PAYMENT_TYPE'

};
