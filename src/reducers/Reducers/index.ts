import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import Settings from './Settings';
import Auth from './Auth';
import Common from './Common';
import callQueueState from './CallQueueListReducer';
import employeesState from './EmployeesReducer';
import department from './DepartmentReducer';
import softPhone from './SoftPhoneReducer';
import associatedEmails from './MailReducer';
import notificationState from './NotificationReducer';
import supportState from './Support';
import companyState from './CompaniesReducer';
import servicepoint from './servicepointReducers';
import employeeState from './EmployeeReducer';
import orderState from './Order'
import roleState from './RoleReducer';
import abilityState from './AbilityReducer';
import permissionState from './PermissionReducer';
import orderPageState from './OrderPageReducer';
import partnerSettingState from './PartnerSettingReducer';
import marketingState from './MarketingReducer';
import partnerEmployeeState from './PartnerEmployeeReducer';
import servicesState from './ServicesReducer'
import dashboardState from './DashboardReducer';
import adminEmployeeState from './AdminEmployeeReducer';
import feedbackState from './FeedbackReducer';
import reportState from './ReportReducer';
/**
 * @param history
 * @returns {*}
 */
export default (history:any) => combineReducers({
  router: connectRouter(history),
  settings: Settings,
  auth: Auth,
  commonData: Common,
  department,
  softPhone,
  associatedEmails,
  callQueueState,
  notificationState,
  // Support state
  supportState,
  employeeState,
  // manage company state
  companyState,
  employeesState,
  // manage employee state
  servicepoint,
  roleState,
  orderState,
  abilityState,
  permissionState,
  orderPageState,
  partnerSettingState,
  marketingState,
  partnerEmployeeState,
  servicesState,
  dashboardState,
  adminEmployeeState,
  feedbackState,
  reportState
});
