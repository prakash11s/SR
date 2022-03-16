import React, { useEffect, useState } from "react";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "util/IntlMessages";
import { useDispatch } from "react-redux";
import { getSubscriptions, getActiveSubscriptions, getExtensionSubscriptions } from "actions/Actions/SubscriptionActions";
import { sortObjectOnKeys } from 'util/helper';
import PaginationTable from "common/PaginationTable";
import { Button } from "@material-ui/core";
import { DateRangePicker } from 'react-nice-dates'
import { enGB } from 'date-fns/locale'
import moment from "moment";
import axios from "../../util/Api";
import { useHistory } from "react-router";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import { TextField } from '@material-ui/core';

export const Subscription = (props) => {
  const dispatch = useDispatch();
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<any>()
  const [endDate, setEndDate] = useState<any>()
  const [sort, setSort] = useState<any>({
    sort: {
      created_at: "desc",
    },
  });
  const [apiProps, setApiProps] = useState({
    page: 1,
    limit: 10
  })
  const [searchProps, setSearchProps] = useState<any>({})
 
  const [plans, setPlans] = useState<any>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>('');


  const [filterSelected, setFilterSelected] = useState<any>('')
  const [filterWithoutSelected, setFilterWithoutSelected] = useState<any>('')

  const [subscriptionColumns, setSubscriptionColumns] = useState([
    {
      name: "paginationTable.id",
      key: "id",
      type: 'number',
      value: '',
      sort: true
    },
    {
      name: "paginationTable.planName",
      key: "plan.name",
      sortKey: "name",
      type: 'text',
      value: '',
      sort: false
    },
    {
      name: "paginationTable.periodStart",
      key: "active_from",
      sortKey: "period_start",
      format: "paginationTable.datetime",
      type: 'date',
      value: '',
      sort: true
    },
    {
      name: "paginationTable.periodEnd",
      key: "active_until",
      sortKey: "period_end",
      format: "paginationTable.datetime",
      type: 'date',
      value: '',
      sort: true
    },
    {
      name: "paginationTable.createdAt",
      key: "created_at",
      format: "paginationTable.datetime",
      align: "right",
      type: 'date',
      value: '',
      sort: true
    }
  ]);

  const onSortChange = (field: string) => {
    const oldSort = { ...sort };
    const newSort = { sort: {} };
    newSort.sort[field] = (oldSort.sort[field] === "asc" || oldSort.sort[field] === undefined) ? "desc" : "asc";
    setSort(newSort);
  };


  const fetchCallRecordingToSearchKeyword = (parameter) => {
    setLoading(true);

    const params = {
      ...apiProps,
      page: 1,
      sort_by: renameSortKeys(Object.keys(sort.sort)[0]),
      sort_direction: Object.values(sort.sort)[0],
      ...parameter
    };

    dispatch(
      getSubscriptions(params, (status, res) => {
        if (status) {
          setSubscriptionList(res.data);
          setMeta(res.meta);
          setError("");
        } else {
          setError(res);
        }
        setLoading(false);
      })
    );
  }

  useEffect(() => {
    fetchPlans();
  }, [])

  useEffect(() => {

    if (startDate && endDate) {

      const params = { ...searchProps };
      params['period_start'] = moment(startDate).format('YYYY-MM-DD');
      params['period_end'] = moment(endDate).format('YYYY-MM-DD');
      params['period_type'] = 'between';

      fetchCallRecordingToSearchKeyword(params)
      setSearchProps(params)
    }
  }, [startDate, endDate]);

  const fetchPlans = () => {
    axios
      .get(`/subscriptions/plans`)
      .then((response) => {
        setPlans(response.data.data);
      })
      .catch((error) => {
        setPlans([]);
        console.log("error", error)
      });
  }

  const renameSortKeys = (sortKey: string) => {
    var renameSortKey = '';
    if (sortKey == 'plan.name') {
      renameSortKey = 'name';
    } else if (sortKey == 'active_from') {
      renameSortKey = 'period_start';
    } else if (sortKey == 'active_until') {
      renameSortKey = 'period_end';
    } else {
      renameSortKey = sortKey;
    }
    return renameSortKey;
  }

  useEffect(() => {
    const params = { ...searchProps };
    fetchCallRecordingToSearchKeyword(params)
  }, [sort]);

  const fetchData = ({ page = 0, limit = 25 }) => {

    const params = {
      ...searchProps,
      page: page + 1,
      limit: limit,
    }
    setApiProps({
      page: page + 1,
      limit
    });
    fetchCallRecordingToSearchKeyword(params)
  };

  const handleSelectPlan = async (event: any, value: any) => {

    setLoading(true);
    if (value) {
      setSelectedPlan(value);
      var params = {
        ...apiProps,
        ...searchProps,
        page: 1,
        plan_id: value.id
      }
    } else {
      setSelectedPlan('');
      var params = {
        ...apiProps,
        ...searchProps,
        page: 1,
      }
      delete params.plan_id;
    }
    setSearchProps(params);
    fetchCallRecordingToSearchKeyword(params);
  }

  const activeSubscription = async () => {

    var params = {
      ...searchProps
    };
    delete params.only_active_subscriptions;
    if (filterSelected !== 'active_subscription') {
      params['only_active_subscriptions'] = 1;
    }
    setSearchProps(params);
    setFilterSelected(filterSelected == 'active_subscription' ? '' : 'active_subscription');
    fetchCallRecordingToSearchKeyword(params);
  }

  const withoutExtension = async () => {
    var params = { ...searchProps };
    delete params.without_extension;
    if (filterWithoutSelected !== 'without_extension') {
      params['without_extension'] = 1;
    }
    setSearchProps(params);
    setFilterWithoutSelected(filterWithoutSelected == 'without_extension' ? '' : 'without_extension');
    fetchCallRecordingToSearchKeyword(params);
  }

  return (
    <div className="">
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="partner.subscriptions" />}
      />

      <div className="row d-flex justify-content-start position-relative p-2">
        <div className="col-md-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            minimumLength={1}
            format='dd-MM-yyyy'
            locale={enGB}
          >
            {({ startDateInputProps, endDateInputProps, focus }) => (
              <>

                <div className='date-range'>

                  <input
                    className={'input start-date-range' + (focus === 'startDate' ? ' -focused' : '')}
                    {...startDateInputProps}
                    placeholder='From date'

                  />

                  <span className='date-range_arrow' />
                  <input
                    className={'input end-date-range' + (focus === 'endDate' ? ' -focused' : '')}
                    {...endDateInputProps}
                    placeholder='To date'

                  />
                </div>
              </>
            )}
          </DateRangePicker>
        </div>
        <div className="col-md-4">
          <Button
            size="medium"
            variant="contained"
            className={`jr-btn text-white ${filterSelected == 'active_subscription' ? 'btn-selected' : 'btn-unselected'}`}
            color="primary"
            onClick={activeSubscription}

          >
            <IntlMessages id="subscription.activeSubscription" />
          </Button>
          <Button
            size="medium"
            variant="contained"
            className={`jr-btn text-white ${filterWithoutSelected == 'without_extension' ? 'btn-selected' : 'btn-unselected'}`}
            color="primary"
            onClick={withoutExtension}
          >
            <IntlMessages id="subscription.withoutExtension" />
          </Button>

        </div>
        <div className="col-md-4">
          <Autocomplete
            className="mb-2 mr-2 h-75 float-right"
            id="emp-list"
            value={selectedPlan || null}
            options={plans}
            getOptionLabel={(option: { name: string }) => `${option.name}`}
            style={{ width: 300, zIndex: 10000 }}
            renderInput={(params) => <TextField {...params}
              label={<IntlMessages id="subscription.PlanLabel" />}
              variant="outlined" />
            }
            onChange={(event, value) => handleSelectPlan(event, value)}
          />
        </div>

      </div>

      <PaginationTable
        meta={meta}
        dataList={subscriptionList}
        columns={subscriptionColumns}
        loading={loading}
        onChange={fetchData}
        onSort={onSortChange}
        sortColumns={sort.sort}
        secondHeader={false}
        isSortable={true}
        error={error}
      />
    </div>
  );
};

export default Subscription;
