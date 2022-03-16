import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import { ICustomerPageProps } from './Interface/IndexInterface';

class CustomerPage extends React.Component<ICustomerPageProps> {

    render() {
        return (
            <div className="app-wrapper">
                <ContainerHeader match={this.props.match} title={<IntlMessages id="pages.samplePage" />} />
                <div className="d-flex justify-content-center">
                    <h1><IntlMessages id="pages.samplePage.description" /> </h1>
                </div>
            </div>
        );
    }
}

export default CustomerPage;
