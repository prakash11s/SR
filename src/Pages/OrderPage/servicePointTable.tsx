import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CardBox from "../../components/CardBox";



const ServicePointTable = (props:any) => {
    const { places } = props
    return (
        <CardBox styleName="col-12" cardStyle="p-0"  headerOutside>
        <div className="table-responsive-material">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">Service Point Name</TableCell>
                        <TableCell align="right">latitude</TableCell>
                        <TableCell align="right">longitude</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {places.map((place:any,index:any) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{place.id}</TableCell>
                                <TableCell align="right">{place.name}</TableCell>
                                <TableCell align="right">{place.latitude}</TableCell>
                                <TableCell align="right">{place.longitude}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
        </CardBox>
    );
}


export default ServicePointTable;
