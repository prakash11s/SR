import React from "react";
import { render, fireEvent, waitForElement, cleanup } from "@testing-library/react";

import Login from "./containers/Login/Login";
import {Router} from "react-router";
import {IntlProvider} from "react-intl";
import AppLocale from "./lngProvider";

test("should display login page", async () => {
    debugger;
    const { getByText, findByText } = renderLoginForm();
    const button = getByText('Login with LinkedIn');
    expect(button.innerHTML).toContain('Login with LinkedIn');
    cleanup();
});

function renderLoginForm(props: Partial<any> = {}) {
    const defaultProps: any = {
        showMessage: false,
        hideMessage() {
            return;
        },
        authUser: null,
        loader: false,
        alertMessage: null,
        onServiceRightClick(e) {
            return ;
        }
    };
    const history =  require('history').createMemoryHistory();
    const currentAppLocale = AppLocale["en"];
    return render( <>
            <IntlProvider locale="en-GB" defaultLocale="en-GB" messages={currentAppLocale.messages}>
                <Router history={history}>
                     <Login {...defaultProps} {...props} />
                </Router>
            </IntlProvider>
        </>
    );
}
