/* global Liferay */
import React from 'react';
import { createRoot } from 'react-dom/client';
import ExpenseReports from "./components/ExpenseReports";
import {ClayIconSpriteContext} from '@clayui/icon';
import {getLiferayThemeSpritemap} from "./utils/util";
import Dashboard from "./components/Dashboard";

const ELEMENT_ID_REPORTS_LIST = 'liferay-smart-expense-ui-reports-list';
const ELEMENT_ID_DASHBOARD = 'liferay-smart-expense-ui-dashboard';

class ReportsListWebComponent extends HTMLElement {

    connectedCallback() {

        this.root = createRoot(this);

        this.root.render(
            <ClayIconSpriteContext.Provider value={getLiferayThemeSpritemap()}>
                <ExpenseReports />
            </ClayIconSpriteContext.Provider>
            , this);
    }
    disconnectedCallback() {

        this.root.unmount();

        delete this.root;

    }
}


class DashboardWebComponent extends HTMLElement {

    connectedCallback() {

        this.root = createRoot(this);

        this.root.render(
            <ClayIconSpriteContext.Provider value={getLiferayThemeSpritemap()}>
                <Dashboard />
            </ClayIconSpriteContext.Provider>
            , this);
    }
    disconnectedCallback() {

        this.root.unmount();

        delete this.root;

    }
}




if (!customElements.get(ELEMENT_ID_REPORTS_LIST)) {

    customElements.define(ELEMENT_ID_REPORTS_LIST, ReportsListWebComponent);

}

if (!customElements.get(ELEMENT_ID_DASHBOARD)) {

    customElements.define(ELEMENT_ID_DASHBOARD, DashboardWebComponent);

}
