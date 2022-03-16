import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IntlMessages from "util/IntlMessages";

import { readableDateTimeLocale } from "util/helper";

const PartnerOrderOverviewPreferredDatesTable = ({
  preferredDates,
}): JSX.Element => {
  return (
    <div className="table-responsive-material">
      <h3 className="mt-2">
        <IntlMessages id="partnerOrders.executionDate" />
      </h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <IntlMessages id="preferredDate.start_date" />
            </TableCell>
            <TableCell>
              <IntlMessages id="preferredDate.end_date" />
            </TableCell>
            <TableCell>
              <IntlMessages id="preferredDate.description" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {preferredDates &&
            preferredDates.map((data, index: number) => {
              return (
                <TableRow
                  key={index}
                  className={data.selected == true ? "set-bg-color" : ""}
                >
                  <TableCell>
                    {data.start_date
                      ? data.is_entire_day ? readableDateTimeLocale(
                        data.start_date,
                        "MM-DD-YYYY"
                      ) + " (Hele dag beschikbaar)" : readableDateTimeLocale(
                          data.start_date,
                          "MM-DD-YYYY HH:mm:ss"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {data.end_date
                      ? readableDateTimeLocale(
                          data.end_date,
                          "MM-DD-YYYY HH:mm:ss"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>{data.description}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnerOrderOverviewPreferredDatesTable;
