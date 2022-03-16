import {Redirect} from "react-router-dom";
import React from "react";

import asyncComponent from '../util/asyncComponent';

// @ts-ignore
export default {
	admin: {
		routes: [
			{
				component: asyncComponent(() => import('./../app/routes/EmployeesPage')),
				path: '/admin/employees',
				id: 'admin.employees',
				icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
				hideChild: true,
				child: [
					{
						component: asyncComponent(() => import('./../components/EmployeesTable/EmployeeAccountOverview')),
						path: '/admin/employees/:id/',
						id: 'employees.overview'
					}
				]
			},
			{
				component: asyncComponent(() => import('./../app/routes/RolesPage')),
				path: '/admin/roles',
				id: 'admin.roles',
				icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
			},
			{
				component: asyncComponent(() => import('../app/routes/Permission')),
				path: '/admin/permission',
				id: 'admin.permission',
				icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
			},
			{
				component: asyncComponent(() => import('../app/routes/ServicesPage')),
				path: '/admin/services',
				id: 'sidebar.services',
				icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
				hideChild: true,
				child: [
					{
						component: asyncComponent(() => import('../app/routes/ServicesPage')),
						path: '/admin/services/create',
					},
				]
			},
		],
	},

	/**
	 * Marketing routes
	 */
	marketing: {
		routes: [
			{
				component: asyncComponent(() => import('../app/routes/MarketingPage')),
				path: '/marketing',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/MarketingPage')),
				path: '/marketing/campaigns',
				id: 'Campaigns',
				hideChild: true,
				child: [
					{
						component: asyncComponent(() => import('../app/routes/MarketingPage')),
						path: '/marketing/campaigns/:id'
					},
					{
						component: asyncComponent(() => import('../app/routes/MarketingPage')),
						path: '/marketing/campaigns/:id/opens'
					},
					{
						component: asyncComponent(() => import('../app/routes/MarketingPage')),
						path: '/marketing/campaigns/:id/outbox'
					},
					{
						component: asyncComponent(() => import('../app/routes/MarketingPage')),
						path: '/marketing/campaigns/:id/unsubscribe'
					},
				]
			},
			{
				component: asyncComponent(() => import('../app/routes/MarketingPage')),
				path: '/marketing/email-template',
				id: 'Email-template',
				exact: true
			},
			{
				component: asyncComponent(() => import('./../app/routes/MarketingPage')),
				path: '/marketing/lists',
				id: 'Lists',
				exact: true
			},
			{
				component: asyncComponent(() => import('./../app/routes/MarketingPage')),
				path: '/marketing/templates',
				id: 'Templates',
				exact: true
			}
		],
	},

	//account type as a key.
	partner: {
		routes: [
			{
				render: () => (<Redirect to="/partner/dashboard"/>),
				path: '/partner',
				exact: true,
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/dashboard',
				id: 'sidebar.dashboard',
				icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
				exact: true,
				hideChild: true,
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/orders',
				id: 'sidebar.orders',
				icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
				child:
					[
						{
							component: asyncComponent(() => import('../app/routes/PartnerPage')),
							id: 'sidebar.orders.processing',
							path: '/partner/orders/processing'
						},
						{
							component: asyncComponent(() => import('../app/routes/PartnerPage')),
							id: 'sidebar.orders.scheduled',
							path: '/partner/orders/scheduled'
						},
						{
							component: asyncComponent(() => import('../app/routes/PartnerPage')),
							id: 'sidebar.orders.completed',
							path: '/partner/orders/completed'
						},
						{
							component: asyncComponent(() => import('../app/routes/PartnerPage')),
							id: 'sidebar.orders.awaiting_completion',
							path: '/partner/orders/awaiting_completion'
						},
						{
							component: asyncComponent(() => import('../app/routes/PartnerPage')),
							id: 'sidebar.orders.cancelled',
							path: '/partner/orders/cancelled'
						},
					]
			},

			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/orders/:id',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/employees',
				id: 'partner.employees',
				icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/subscriptions',
				id: 'partner.subscriptions',
				icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/services',
				id: 'partnerUpcomingAssignment.services',
				icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/subscriptions/:id',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/invoices',
				id: 'supportTab.invoices',
				icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/invoices/:id',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/invoices/:id/cancel',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/invoices/:id/success',
				exact: true
			},
			{
				component: asyncComponent(() => import('../components/PartnerReview')),
				path: '/partner/reviews',
				id: 'sidebar.reviews',
				icon: 'zmdi zmdi-hc-fw zmdi zmdi-comment-text-alt zmdi-hc-fw',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/settings',
				id: 'partner.settings',
				icon: 'zmdi zmdi-widgets zmdi-hc-fw',
				child:
					[
						{
							component: asyncComponent(() => import('../app/routes/PartnerPage')),
							id: 'partner.settingsSubmenu',
							path: '/partner/settings'
						},
						{
							component: asyncComponent(() => import('../app/routes/PartnerPage')),
							id: 'partner.payoutMethods',
							path: '/partner/settings/payout-methods'
						},
						// {
						// 	component: asyncComponent(() => import('../app/routes/PartnerPage')),
						// 	id: 'partner.employeeSettingsSubmenu',
						// 	path: '/partner/settings/employees'
						// },
					]
			},

			/**  "partner.settingsSubmenu": "Partner Settings",
  "partner.employeeSettingsSubmenu": "Employee Settings"
			 *                 id: 'Settings',
                icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
                exact: true
            },
            {
                component: asyncComponent(() => import('../app/routes/PartnerPage')),
                path: '/partner/employees',
                id: 'Employees',
                icon: 'zmdi zmdi-view-dashboard zmdi-hc-fw',
                exact: true
			 */
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/error/403',
				exact: true
			},
			{
				component: asyncComponent(() => import('../app/routes/PartnerPage')),
				path: '/partner/settings/error/404',
				exact: true
			}
		],
	},

	customer: {
		routes: [
			{
				component: asyncComponent(() => import('../app/routes/CustomerPage/index')),
				path: '/customer',
				id: 'customer.main'
			},
			{
				component: asyncComponent(() => import('../app/routes/CustomerPage/index')),
				path: '/customer/orders',
				id: 'customer.main'
			},
			{
				component: asyncComponent(() => import('../app/routes/CustomerPage/index')),
				path: '/customer/settings',
				id: 'customer.main'
			}
		],
	},

	support: {
		routes: [
			{
				render: () => (<Redirect to="/support/orders"/>),
				path: '/support',
				exact: true,
			},
			// {
			// 	component: asyncComponent(() => import('./../app/routes/Dashboard')),
			// 	path: '/support/dashboard',
			// 	id: 'sidebar.dashboard',
			// 	icon: 'zmdi zmdi-widgets zmdi-hc-fw',
			// },
			{
				
				component: asyncComponent(() => import('./../app/routes/OrdersStatus')),
				path: '/support/orders',
				id: 'sidebar.orders',
				dataCy: 'menuOrders',
				icon: 'zmdi zmdi-hc-fw zmdi zmdi-case zmdi-hc-fw',
				child: [
					{
						path: '/support/orders/create',
						id: 'sidebar.order.create',
						permission: 'booking-service-support-create-orders'
					},
					{
						path: '/support/orders',
						exact: true,
						id: 'sidebar.order.overview',
						permission: 'booking-service-support-order-access',
					}
				]
			},
			{
				component: asyncComponent(() => import('./../app/routes/CompaniesPage')),
				icon: 'zmdi zmdi-hc-fw zmdi zmdi-local-store zmdi-hc-fw',
				path: '/support/companies',
				id: 'sidebar.companies',
				child: [
					{
						path: '/support/companies',
						id: 'sidebar.overview',
						exact:true,
						hideChild: true,
						child: [
							{
								path: '/support/companies/error/404',
							},
							{
								path: '/support/companies/:id/edit',
							},
							{
								path: '/support/companies/:id/',
							},
							{
								path: '/support/companies/:id/:activeTab/',
							},
							{
								path: '/support/companies/:id/:activeTab/:activeTabId',
							},
							{
								path: '/support/companies/:id/:activeTab/:activeTabId/activeTabEdit',
							},
						]
					},
					{
						path: '/support/companies/maps',
						id: 'sidebar.maps',
					},
					{
						path: '/support/companies/create',
						id: 'sidebar.companies.create',
						permission: 'service-points-service-create-service-point',
					}
				]
			},
			{
				component: asyncComponent(() => import('./../app/routes/CallQueuePage')),
				path: '/support/call-queues',
				id: 'sidebar.callQueue',
				permission: 'list-call-queues',
				icon: 'zmdi zmdi-hc-fw zmdi zmdi-view-list-alt zmdi-hc-fw',
				hideChild: true,
				child: [
					{
						component: asyncComponent(() => import('./../app/routes/TablePage')),
						path: '/support/call-queues/:id',
						id: 'call-queues.tablePage'
					},
					{
						component: asyncComponent(() => import('./../components/CallQueueList')),
						path: '/support/call-queues/:id/process',
						id: 'call-queues.CallQueueList'
					},
					{
						component: asyncComponent(() => import('./../components/CallQueueListNew')),
						path: '/support/call-queues/:id/process-queue',
						id: 'call-queues.CallQueueList'
					},
					{
						component: asyncComponent(() => import('./../app/routes/CallQueuePage')),
						path: '/support/call-queues/error/403',
					}, {
						component: asyncComponent(() => import('./../app/routes/CallQueuePage')),
						path: '/support/call-queues/:id/edit',
					}
				]
			},
			{
				component: asyncComponent(() => import('../app/routes/CallRecordings')),
				path: '/support/call-recordings',
				id: 'sidebar.callRecordings',
				// permission: 'feedback-service-index-feedback',
				exact: true,
				icon: 'zmdi zmdi-hc-fw zmdi zmdi-phone zmdi-hc-fw',
			},
			{
				component: asyncComponent(() => import('../app/routes/Emails')),
				path: '/support/emails',
				id: 'sidebar.emails',
				icon: 'zmdi zmdi-email zmdi-hc-fw',
				child: [
					{
						path: '/support/emails',
						id: 'sidebar.emails.system',
					}
				]
			},
			{
				component: asyncComponent(() => import('../app/routes/Reports')),
				path: '/support/reports',
				id: 'sidebar.reports',
				icon: 'zmdi zmdi-hc-fw zmdi zmdi-comment-alert zmdi-hc-fw',
				child: [
					{
						path: '/support/reports/open-quotes',
						id: 'sidebar.reports.openQuotes',
					},
					{
						path: '/support/reports/canceled-orders',
						id: 'sidebar.reports.canceledOrders',
					},
					{
						path: '/support/reports/assigned-orders',
						id: 'sidebar.reports.assignedOrders',
					}
				]
			},
			{
				component: asyncComponent(() => import('../app/routes/Reviews')),
				path: '/support/reviews',
				id: 'sidebar.reviews',
				permission: 'feedback-service-index-feedback',
				exact: true,
				icon: 'zmdi zmdi-hc-fw zmdi zmdi-comment-text-alt zmdi-hc-fw',
			},
			{
				component: asyncComponent(() => import('../app/routes/UsefulLinksPage')),
				path: '/support/useful-links',
				id: 'sidebar.links',
				// exact: true,
				icon: 'zmdi zmdi-hc-fw zmdi zmdi-info zmdi-hc-fw',
				hideChild: true,
				child: [
					{
						component: asyncComponent(() => import('../app/routes/UsefulLinksPage')),
						path: '/support/useful-links/haynes-test-page',
						exact: true
						// id: 'demo.haynes',
					},
				]
			},
			{
				component: asyncComponent(() => import('../app/routes/subscriptions')),
				path: '/support/subscriptions',
				id: 'sidebar.subscription',
				// permission: 'feedback-service-index-feedback',
				exact: true,
				icon: 'zmdi-notifications-active',
			}
			
			// {
			// 	component: asyncComponent(() => import('./../app/routes/PhoneSystemPage')),
			// 	path: '/support/phone-system/call-histories',
			// 	id: 'sidebar.phoneSystem',
			// 	icon: 'zmdi zmdi-phone zmdi-hc-fw',
			// },
			// {
			// 	component: asyncComponent(() => import('./../app/routes/EmailPage')),
			// 	id: 'sidebar.contact',
			// 	icon: 'zmdi zmdi-widgets zmdi-hc-fw',
			// 	child:
			// 		[
			// 			{
			// 				id: 'menu.chat',
			// 				path: '/support/chat'
			// 			},
			// 			{
			// 				id: 'menu.email',
			// 				path: '/support/email'
			// 			},
			// 		]
			// },
			// {
			//     path: '/support/statistics',
			//     id: 'sidebar.tatistics',
			//     icon: 'zmdi zmdi-widgets zmdi-hc-fw',
			//     child: [
			//         {
			//             id: 'statistics',
			//             path: '/stats'
			//         },
			//         {
			//             id: 'timeline',
			//             path: '/stats/timeline'
			//         },
			//     ]
			// },
		],
	},

}
