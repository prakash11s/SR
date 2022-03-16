import React, { useEffect, useState } from 'react';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from 'prop-types';
import IntlMessages from 'util/IntlMessages';
import { useHistory, useParams } from "react-router";
import { ITabContainerProps } from './Interface/CompaniesInterface';
import CompaniesSharedInfo from "./CompaniesSharedInfo";
import EmployeeList from "./EmployeeList";
import OrderList from "./OrderList";
import SubscriptionList from "./SubscriptionList";
import FeedBackList from "./FeedBackList";
import InvoicesList from "./InvoicesList";
import { useSelector } from 'react-redux';
import BankAccountList from './BankAccountList';

const TabContainer = (props: ITabContainerProps) => {
    return (
        <div style={{ padding: '0 0 0' }}>
            {props.children}
        </div>
    );
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const Companies:React.FC<any> = (props: any) => {

    const history = useHistory();
    const companyState = useSelector((state: any) => state.companyState.company);

    /**
     * state of tabindex and using setTabIndex is callback function we can set tab index using setTabIndex
     * */
    const [tabIndex, setTabIndex] = useState<number>(0);

    /**
     * get active tab params
     * */
    const { activeTab, id }: any = useParams();

    /**
     * list of tabs
     * */
    const tabs = ['orders', 'employees', 'invoices', 'subscription', "bank-accounts", 'feedbacks'];

    const lang = ['orders', 'partner.employees', 'supportTab.invoices', 'supportTab.subscriptions', 'supportTab.bankAccounts', 'supportTab.feedbacks']
    /**
     * set active tab from params
     */
    useEffect(() => {
        activeTab && setTabIndex(tabs.findIndex(tab => tab.toLowerCase() === activeTab.toLowerCase()))
    }, [activeTab, tabs]);

    /**
     * @param event
     * @param value
     */
    const onTabChange = (event: React.ChangeEvent<{}>, value: number) => {
        history.replace(`/support/companies/${id}/${tabs[value]}`);
        setTabIndex(value);
    };

    /**
     * @param tabIndex
     * @returns {Component}
     */
    const setCurrentTab = (tabIndex: number): JSX.Element => {
       
        switch (tabIndex) {
            case 0:
                return <OrderList {...props} />;
            case 1:
                return <EmployeeList {...props} />;
            case 2:
                return <InvoicesList {...props} />;
            case 3:
                return <SubscriptionList {...props} />;
            case 4:
                return <BankAccountList {...props} />;
            case 5:
                return <FeedBackList {...props} />;
            default:
                return <OrderList {...props} />;
        }
    };

    return (
        <div>
            <CompaniesSharedInfo />
            {!companyState.deleted_at && 
                <>
                    <AppBar className="bg-primary" position="static">
                        <Tabs value={tabIndex} onChange={onTabChange} variant="fullWidth" scrollButtons="on" centered>
                            {tabs.map((tab, i) => <Tab className="tab"  label={<IntlMessages id={lang[i]}/>} />)}
                        </Tabs>
                    </AppBar>
                    <TabContainer>
                        {setCurrentTab(tabIndex)}
                    </TabContainer>
                </>
            }
        </div>
    );
};

export default Companies;