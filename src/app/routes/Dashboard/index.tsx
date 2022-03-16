import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";

import {
  browserList,
  chartDataWithoutAxis,
  customers,
  marketingData,
  products,
} from "./data";

import ChartCard from "components/dashboard/Common/ChartCard/ChartCard";
import ProductImage from "components/dashboard/ProductImage/ProductImage";
import OrderTable from "components/OrderTable/index";
import ContainerHeader from "components/ContainerHeader/index";
import IntlMessages from "../../../util/IntlMessages";
import CustomLineChart from "../../../components/CustomLineChart";
import HorizontalItemCard from "../../../components/dashboard/Common/HorizontalItemCard/HorizontalItemCard";
import YearlyProfitChart from "../../../components/dashboard/YearlyProfitChart/YearlyProfitChart";
import CardHeader from "../../../components/dashboard/Common/CardHeader";
import SalesStatistic from "../../../components/dashboard/SalesStatistic/SalesStatistic";
import { Progress } from "reactstrap";
import PopularProduct from "../../../components/dashboard/Common/PopularProduct/PopularProduct";
import MarketingTable from "../../../components/dashboard/Common/MarketingTable/MarketingTable";
import { Avatar } from "@material-ui/core";
import RadarChart from "../../../components/dashboard/RadarChart/RadarChart";
import ReactSpeedometer from "react-d3-speedometer";
import DoughnutChart from "../../../components/dashboard/DoughnutChart/DoughnutChart";
import UserDetailTable from "../../../components/dashboard/Common/UserDetailTable/UserDetailTable";

import { useSelector } from "react-redux";
import { IChart, IDashboardInterface } from "./Interface/IDashboardInterface";
import { IDashboardOrder } from "../../../reducers/Interface/DashboardReducerInterface";

const Dashboard: React.FC<IDashboardInterface> = (props) => {
  const dashboardState = useSelector((state: any) => state.dashboardState);

  const [dailyOrders, setDailyOrders] = useState<IChart>({
    chartData: [],
    labels: [],
  });

  useEffect(() => {
    if (dashboardState.orders) {
      const chartData: number[] = [];
      const labels: string[] = [];
      // dashboardState.orders.map((order: IDashboardOrder) => {
      //   labels.push(order.id);
      //   chartData.push(order.value);
      // });
      setDailyOrders({
        chartData,
        labels,
      });
    }
  }, [dashboardState.orders]);

  const totalRevenueData = {
    chartData: [200, 50, 250, 100, 370, 100],
    labels: ["9", "10", "11", "12", "13", "14"],
  };

  const [menuState, setMenuState] = useState(false);

  const dataList = [];

  const onOptionMenuSelect = (event: any) => {
    setMenuState(true);
  };

  const countTotal = (data: number[]) => {
    let total = 0;
    data.forEach((value: number) => {
      total += +value;
    });
    return total;
  };

  return (
    <div className="app-wrapper">
      <ContainerHeader
        match={props.match}
        title={<IntlMessages id="dashboard" />}
      />

      <div className="row">
        <div className="col-lg-3 col-sm-6 col-12">
          <ChartCard styleName="bg-gradient-primary text-white">
            <div className="chart-title">
              <h2 className="mb-1">{countTotal(dailyOrders.chartData)}</h2>
              <p>
                <IntlMessages id="dashboard.dailyOrders" />
              </p>
            </div>

            <ResponsiveContainer width="100%" height={110}>
              <CustomLineChart
                chartData={dailyOrders.chartData}
                labels={dailyOrders.labels}
                borderColor="#FFF"
                pointBorderColor="#FFF"
                pointBackgroundColor="#FF9800"
                pointBorderWidth={2}
                pointRadius={4}
                lineTension={0}
              />
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="col-lg-3 col-sm-6 col-12">
          <ChartCard styleName="bg-cyan text-white">
            <div className="chart-title">
              <h2 className="mb-1">$7,890</h2>
              <p>
                <IntlMessages id="dashboard.lastMonthSale" />
              </p>
            </div>

            <ResponsiveContainer width="100%" height={110}>
              <CustomLineChart
                chartData={totalRevenueData.chartData}
                labels={totalRevenueData.labels}
                borderColor="#FFF"
                pointBorderColor="#FFF"
                pointBackgroundColor="#FFF"
                pointBorderWidth={2}
                fill={true}
                pointRadius={0}
                pointHoverBorderColor="#F53E7B"
                lineTension={0.4}
                shadowColor="rgba(0,0,0,0.6)"
              />
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="col-lg-3 col-sm-6 col-12">
          <ChartCard styleName="bg-secondary text-white">
            <div className="chart-title">
              <h2 className="mb-1">$87,356</h2>
              <p>
                <IntlMessages id="dashboard.totalRevenue" />
              </p>
            </div>
            <ResponsiveContainer width="100%" height={110}>
              <CustomLineChart
                chartData={totalRevenueData.chartData}
                labels={totalRevenueData.labels}
                borderColor="#FFF"
                pointBorderColor="#FFF"
                pointBackgroundColor="#FFF"
                pointBorderWidth={2}
                pointRadius={0}
                pointHoverBorderColor="#F53E7B"
                lineTension={0.4}
                shadowColor="rgba(0,0,0,0.6)"
              />
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="col-lg-3 col-sm-6 col-12">
          <ChartCard styleName="bg-warning text-white">
            <div className="chart-title">
              <h2 className="mb-1">185</h2>
              <p>
                <IntlMessages id="dashboard.totalEmail" />
              </p>
            </div>
            <div className="p-3">
              <div className="d-flex flex-row p-0">
                <p className="text-white m-0">Opened</p>
                <p className="text-white ml-auto m-0">72 %</p>
              </div>
              <Progress
                className="shadow-lg mb-2 my-1"
                style={{ height: 6 }}
                color="white"
                value="72"
              />
              <div className="d-flex flex-row">
                <p className="text-white m-0">Bounced</p>
                <p className="text-white ml-auto m-0">28%</p>
              </div>
              <Progress
                className="shadow-lg my-1"
                style={{ height: 6 }}
                color="white"
                value="28"
              />
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <SalesStatistic />
        </div>
      </div>

      <div className="row">
        <div className="col-xl-5 col-12">
          <div className="row">
            <div className="col-xl-12 col-sm-6">
              <HorizontalItemCard
                styleTitle="mb-4"
                styleName="p-4"
                title="This Year Sale Report"
                price="$685K+"
                detail="Post 9 month data"
                chartPosition="align-self-end"
              >
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={chartDataWithoutAxis}>
                    <Bar dataKey="amt" fill="#3f51b5" maxBarSize={10} />
                    <XAxis stroke="#3f51b5" dataKey="name" />
                  </BarChart>
                </ResponsiveContainer>
              </HorizontalItemCard>
            </div>

            <div className="col-xl-12 col-sm-6">
              <HorizontalItemCard
                styleTitle="mb-4"
                styleName="p-4"
                title={<IntlMessages id="dashboard.yearlyProfit" />}
                price="$125K+"
                detail={<IntlMessages id="dashboard.post9MonthData" />}
              >
                <YearlyProfitChart
                  shadowColor={"rgba(0,188,212,0.8)"}
                  centerText="$20k"
                  textColor="#999999"
                  height={120}
                  chartType="customDoughnut"
                  backgroundColor={["#F44336", "#00BCD4"]}
                  borderColor={["#F44336", "#00BCD4"]}
                  hoverBorderColor={["#F44336", "#00BCD4"]}
                  hoverBorderWidth={[8, 2]}
                  rotation={220}
                />
              </HorizontalItemCard>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-8 col-md-7 col-12">
          <div className="jr-card jr-full-card">
            <CardHeader
              heading={"Customer"}
              subHeading={"Customer Subheading"}
            />

            <UserDetailTable data={customers} />
          </div>
        </div>

        <div className="col-xl-3 col-lg-4 col-md-5 col-12">
          <ProductImage />
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8 col-12">
          <div className="jr-card">
            <div className="jr-card-header d-flex align-items-center">
              <div className="mr-auto">
                <h3 className="d-inline-block mb-0">
                  <IntlMessages id="table.recentOrders" />
                </h3>
                <span className="text-white badge badge-success">
                  <IntlMessages id="table.thisWeek" />
                </span>
              </div>
              <IconButton className="icon-btn" onClick={onOptionMenuSelect}>
                <i className="zmdi zmdi-chevron-down" />
              </IconButton>
            </div>
            <OrderTable
              openSearchServiceModal={true}
              menuState={menuState}
              handleRequestClose={(id) => console.log(id)}
              dataList={dataList} 
              deleteOrder={(id) => console.log(id)}
              className=""
            />
            {/*<OrderTable/>*/}
          </div>
        </div>

        <div className="col-xl-4 col-12">
          <div className="jr-card jr-full-card">
            <div className="jr-card-header d-flex align-items-center mb-3">
              <h3 className="card-heading mb-0">
                <i className="zmdi zmdi-chart-donut zmdi-hc-fw text-primary text-lighten-2 mr-2" />
                <IntlMessages id="dashboard.marketingCampaign" />
              </h3>
              <span className="badge badge-primary ml-auto">Today</span>
            </div>
            <MarketingTable data={marketingData} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8 col-lg-12 order-xl-2">
          <div className="jr-card">
            <CardHeader
              heading={"dashboard.popularProducts"}
              subHeading={"dashboard.loremIpsum"}
              styleName="mb-4"
            />

            <div className="row">
              {products.map((product, index) => (
                <PopularProduct key={index} product={product} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-5 col-12 order-xl-5">
          <div className="jr-card">
            <div className="jr-card-header">
              <h3 className="card-heading">
                <IntlMessages id="dashboard.browser" />
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <div>
                {browserList.map((browser, index) => {
                  return (
                    <div
                      key={browser.id}
                      className="user-profile d-flex flex-row"
                    >
                      <Avatar
                        alt={browser.title}
                        src={browser.image}
                        className="user-avatar-sm mr-3"
                      />
                      <div className="user-detail">
                        <h4 className="mb-0">{browser.title}</h4>
                        <div className="user-description">
                          {browser.subTitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-xl-3 col-md-4 col-12 order-xl-3">
          <div className="jr-card">
            <div className="jr-card-header">
              <h3 className="card-heading">
                <IntlMessages id="dashboard.cartItems" />
              </h3>
            </div>
            <ResponsiveContainer width="100%">
              <RadarChart />
            </ResponsiveContainer>
            <div className="d-flex justify-content-center mt-3">
              <div className="mr-4">
                <span className="size-10 bg-primary lighten-1 rounded-circle d-inline-block mr-1" />{" "}
                Orderd
              </div>
              <div>
                <span className="size-10 bg-red lighten-1 rounded-circle d-inline-block mr-1" />{" "}
                Pending
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-4 col-sm-6 col-12 order-xl-4">
          <div className="jr-card">
            <div className="jr-card-header">
              <h3 className="card-heading">
                <IntlMessages id="dashboard.traffic" />
              </h3>
            </div>
            <ResponsiveContainer width="100%">
              <div
                className="d-flex justify-content-center"
                style={{ width: "100%", height: "150px" }}
              >
                <ReactSpeedometer
                  value={333}
                  fluidWidth
                  needleHeightRatio={0.4}
                  ringWidth={40}
                  segments={4}
                  needleTransitionDuration={4000}
                  needleTransition="easeElastic"
                />
              </div>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <h4 className="mb-1">333s User online</h4>
              <p className="card-text">Moderate Level</p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-4 col-sm-6 col-12 order-xl-6">
          <div className="jr-card">
            <div className="jr-card-header">
              <h3 className="card-heading">
                <IntlMessages id="dashboard.application" />
              </h3>
            </div>
            <ResponsiveContainer width="100%">
              <DoughnutChart />
            </ResponsiveContainer>

            <div className="row">
              <div className="col-6">
                <div className="media">
                  <i className="zmdi zmdi-android zmdi-hc-fw mr-2 text-success" />
                  <div className="media-body">
                    <h5 className="mb-0">Android</h5>
                    <span className="jr-fs-sm text-muted">14,500 User</span>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="media">
                  <i className="zmdi zmdi-apple zmdi-hc-fw mr-2 text-warning" />
                  <div className="media-body">
                    <h5 className="mb-0">iOS</h5>
                    <span className="jr-fs-sm text-muted">9,800 User</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
