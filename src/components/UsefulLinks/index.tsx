import React from 'react';
import IntlMessages from "../../util/IntlMessages";
import ContainerHeader from "../ContainerHeader";
import {Card, CardBody, CardText} from "reactstrap";
import { Link } from 'react-router-dom';

const UsefulLinks = (props) => {
    return (
        <div>
            <ContainerHeader title={<IntlMessages id="sidebar.links"/>} match={props.match}/>
            <Card className={`shadow border-0 `} id="order-details-table" style={{marginBottom: 50}}>
                <CardBody>
                    <CardText>
                        <div className="table-responsive-material">
                            <ul>
                                <li><a href='http://www.addoc.nl/Sys/Login.srf?Page=DefaultLogin&Cult=en' target='_blank'><IntlMessages id="Inloggen Aldoc 1"/></a></li>
                                <li><a href='https://www.mpmoil.nl/' target='_blank'><IntlMessages id="Olie inhoud en type opzoeken"/></a></li>
                                <li><a href='https://www.oponeo.nl/' target='_blank'><IntlMessages id="Banden prijs berekenen"/></a></li>   
                                <li><a href='https://automaat.online/#!/settings/connection' target='_blank'><IntlMessages id="Haynes Pro"/></a></li>
                                <li><a href='https://content.serviceright.nl/storage/production/service-prices-servi/custom/create-quotes.pdf' target='_blank'><IntlMessages id="Handleiding offertes maken"/></a></li>
                                <li><a href='https://www.bovag.nl/zoek-bovag-bedrijf' target='_blank'><IntlMessages id="BOVAG Bedrijf zoeken"/></a></li>
                                <li><a href='https://www.rdw.nl/' target='_blank'><IntlMessages id="RDW"/></a></li>
                                <li>
                                    <Link to="/support/useful-links/haynes-test-page">
                                        <IntlMessages id="sidebar.HaynesPage"/>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </CardText>
                </CardBody>
            </Card>
        </div>
    )
}

export default UsefulLinks;