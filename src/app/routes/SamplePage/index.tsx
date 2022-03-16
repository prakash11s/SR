import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import PhoneNumberList from '../../../components/PhoneNumberList'
import SoftPhoneComponent from '../../../components/Phone/SoftPhoneComponent';

class SamplePage extends React.Component<any,any> {

  render() {
    return (
      <div className="app-wrapper">
        <ContainerHeader match={this.props.match} title={<IntlMessages id="pages.samplePage" />} />
        <div className="d-flex justify-content-center">
          <h1><IntlMessages id="pages.samplePage.description" /> </h1>          
        </div>
        <SoftPhoneComponent>
          <PhoneNumberList />
        </SoftPhoneComponent>
      </div>
    );
  }
}

export default SamplePage;
