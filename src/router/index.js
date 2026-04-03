import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

// 路由配置
const routes = [
  // 认证相关路由
  {
    path: '/',
    redirect: '/terminal-select'
  },
  {
    path: '/terminal-select',
    name: 'TerminalSelect',
    component: () => import('../views/auth/TerminalSelect.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  
  // 导购移动端路由
  {
    path: '/guide',
    name: 'GuideLayout',
    component: () => import('../components/GuideLayout.vue'),
    meta: { requiresAuth: true, terminal: 'guide' },
    children: [
      {
        path: 'dashboard',
        name: 'GuideDashboard',
        component: () => import('../views/guide/dashboard/Index.vue'),
        meta: { permission: 'dashboard' }
      },
      {
        path: 'products',
        name: 'GuideProducts',
        component: () => import('../views/guide/products/Index.vue'),
        meta: { permission: 'products' }
      },
      {
        path: 'cases',
        name: 'GuideCases',
        component: () => import('../views/guide/cases/Index.vue'),
        meta: { permission: 'cases' }
      },
      {
        path: 'customers',
        name: 'GuideCustomers',
        component: () => import('../views/guide/customers/Index.vue'),
        meta: { permission: 'customers' }
      },
      {
        path: 'profile',
        name: 'GuideProfile',
        component: () => import('../views/guide/profile/Index.vue')
      },
      {
        path: 'products/detail/:id',
        name: 'GuideProductDetail',
        component: () => import('../views/guide/products/detail/Index.vue'),
        meta: { permission: 'products' }
      },
      {
        path: 'cases/detail/:id',
        name: 'GuideCaseDetail',
        component: () => import('../views/guide/cases/detail/Index.vue'),
        meta: { permission: 'cases' }
      },
      {
        path: 'customers/detail/:id',
        name: 'GuideCustomerDetail',
        component: () => import('../views/guide/customers/detail/Index.vue'),
        meta: { permission: 'customers' }
      },
      {
        path: 'profile/performance',
        name: 'GuidePerformance',
        component: () => import('../views/guide/profile/performance/Index.vue'),
        meta: { permission: 'profile' }
      },
      {
        path: 'profile/plans',
        name: 'GuidePlans',
        component: () => import('../views/guide/profile/plans/Index.vue'),
        meta: { permission: 'profile' }
      },
      {
        path: 'profile/training',
        name: 'GuideTraining',
        component: () => import('../views/guide/profile/training/Index.vue'),
        meta: { permission: 'profile' }
      },
      {
        path: 'profile/settings',
        name: 'GuideSettings',
        component: () => import('../views/guide/profile/settings/Index.vue'),
        meta: { permission: 'profile' }
      },
      {
        path: 'profile/help',
        name: 'GuideHelp',
        component: () => import('../views/guide/profile/help/Index.vue'),
        meta: { permission: 'profile' }
      },
      {
        path: 'profile/about',
        name: 'GuideAbout',
        component: () => import('../views/guide/profile/about/Index.vue'),
        meta: { permission: 'profile' }
      },
      
      // 电子合同与在线收款模块
      {
        path: 'contracts/list',
        name: 'GuideContractsList',
        component: () => import('../views/guide/contracts/list/Index.vue'),
        meta: { permission: 'contracts' }
      },
      {
        path: 'contracts/create',
        name: 'GuideContractCreate',
        component: () => import('../views/guide/contracts/create/Index.vue'),
        meta: { permission: 'contracts' }
      },
      {
        path: 'contracts/detail/:id',
        name: 'GuideContractDetail',
        component: () => import('../views/guide/contracts/detail/Index.vue'),
        meta: { permission: 'contracts' }
      },
      {
        path: 'payment/create',
        name: 'GuidePaymentCreate',
        component: () => import('../views/guide/payment/create/Index.vue'),
        meta: { permission: 'payment' }
      },
      {
        path: 'payment/records',
        name: 'GuidePaymentRecords',
        component: () => import('../views/guide/payment/records/Index.vue'),
        meta: { permission: 'payment' }
      },
      
      // 安装与售后工单跟进模块
      {
        path: 'tickets/list',
        name: 'GuideTicketsList',
        component: () => import('../views/guide/tickets/list/Index.vue'),
        meta: { permission: 'tickets' }
      },
      {
        path: 'tickets/detail/:id',
        name: 'GuideTicketDetail',
        component: () => import('../views/guide/tickets/detail/Index.vue'),
        meta: { permission: 'tickets' }
      },
      {
        path: 'tickets/follow/:id',
        name: 'GuideTicketFollow',
        component: () => import('../views/guide/tickets/follow/Index.vue'),
        meta: { permission: 'tickets' }
      },
      {
        path: 'tickets/apply',
        name: 'GuideTicketApply',
        component: () => import('../views/guide/tickets/apply/Index.vue'),
        meta: { permission: 'tickets' }
      },
      
      // 客户转介绍裂变工具模块
      {
        path: 'referral/rules',
        name: 'GuideReferralRules',
        component: () => import('../views/guide/referral/rules/Index.vue'),
        meta: { permission: 'referral' }
      },
      {
        path: 'referral/posters',
        name: 'GuideReferralPosters',
        component: () => import('../views/guide/referral/posters/Index.vue'),
        meta: { permission: 'referral' }
      },
      {
        path: 'referral/records',
        name: 'GuideReferralRecords',
        component: () => import('../views/guide/referral/records/Index.vue'),
        meta: { permission: 'referral' }
      },
      {
        path: 'referral/rewards',
        name: 'GuideReferralRewards',
        component: () => import('../views/guide/referral/rewards/Index.vue'),
        meta: { permission: 'referral' }
      },
      
      // AI智能销售辅助模块
      {
        path: 'ai/suggestions',
        name: 'GuideAISuggestions',
        component: () => import('../views/guide/ai/suggestions/Index.vue'),
        meta: { permission: 'ai' }
      },
      {
        path: 'ai/reminders',
        name: 'GuideAIReminders',
        component: () => import('../views/guide/ai/reminders/Index.vue'),
        meta: { permission: 'ai' }
      },
      {
        path: 'ai/analysis',
        name: 'GuideAIAnalysis',
        component: () => import('../views/guide/ai/analysis/Index.vue'),
        meta: { permission: 'ai' }
      },
      
      // 精细化客户标签体系模块
      {
        path: 'tags/manage',
        name: 'GuideTagsManage',
        component: () => import('../views/guide/tags/manage/Index.vue'),
        meta: { permission: 'tags' }
      },
      {
        path: 'tags/edit/:id',
        name: 'GuideTagEdit',
        component: () => import('../views/guide/tags/edit/Index.vue'),
        meta: { permission: 'tags' }
      },
      {
        path: 'tags/filter',
        name: 'GuideTagsFilter',
        component: () => import('../views/guide/tags/filter/Index.vue'),
        meta: { permission: 'tags' }
      },
      {
        path: 'tags/mass-send',
        name: 'GuideTagsMassSend',
        component: () => import('../views/guide/tags/mass-send/Index.vue'),
        meta: { permission: 'tags' }
      },
      
      // 自定义表单工具模块
      {
        path: 'forms/templates',
        name: 'GuideFormsTemplates',
        component: () => import('../views/guide/forms/templates/Index.vue'),
        meta: { permission: 'forms' }
      },
      {
        path: 'forms/create',
        name: 'GuideFormCreate',
        component: () => import('../views/guide/forms/create/Index.vue'),
        meta: { permission: 'forms' }
      },
      {
        path: 'forms/share/:id',
        name: 'GuideFormShare',
        component: () => import('../views/guide/forms/share/Index.vue'),
        meta: { permission: 'forms' }
      },
      {
        path: 'forms/statistics',
        name: 'GuideFormsStatistics',
        component: () => import('../views/guide/forms/statistics/Index.vue'),
        meta: { permission: 'forms' }
      },
      
      // 量房全流程管理模块
      {
        path: 'measure/list',
        name: 'GuideMeasureList',
        component: () => import('../views/guide/measure/list/Index.vue'),
        meta: { permission: 'measure' }
      },
      {
        path: 'measure/create',
        name: 'GuideMeasureCreate',
        component: () => import('../views/guide/measure/create/Index.vue'),
        meta: { permission: 'measure' }
      },
      {
        path: 'measure/detail/:id',
        name: 'GuideMeasureDetail',
        component: () => import('../views/guide/measure/detail/Index.vue'),
        meta: { permission: 'measure' }
      },
      {
        path: 'measure/follow/:id',
        name: 'GuideMeasureFollow',
        component: () => import('../views/guide/measure/follow/Index.vue'),
        meta: { permission: 'measure' }
      },
      // 分享模块
      {
        path: 'share',
        name: 'GuideShare',
        component: () => import('../views/guide/share/Index.vue'),
        meta: { permission: 'share' }
      },
      // 待办事项模块
      {
        path: 'todo/list',
        name: 'GuideTodoList',
        component: () => import('../views/guide/todo/list/Index.vue'),
        meta: { permission: 'todo' }
      }
    ]
  },
  
  // 门店管理端路由
  {
    path: '/store',
    name: 'StoreLayout',
    component: () => import('../components/StoreLayout.vue'),
    meta: { requiresAuth: true, terminal: 'store' },
    children: [
      {
        path: 'home',
        name: 'StoreHome',
        component: () => import('../views/store/Home.vue'),
        meta: { permission: 'dashboard' }
      },
      {
        path: 'products',
        name: 'StoreProducts',
        component: () => import('../views/store/Products.vue'),
        meta: { permission: 'products' }
      },
      {
        path: 'cases',
        name: 'StoreCases',
        component: () => import('../views/store/Cases.vue'),
        meta: { permission: 'cases' }
      },
      {
        path: 'customers',
        name: 'StoreCustomers',
        component: () => import('../views/store/customers/Index.vue'),
        meta: { permission: 'customers' }
      },
      {
        path: 'customers/detail/:id',
        name: 'StoreCustomerDetail',
        component: () => import('../views/store/customers/Detail.vue'),
        meta: { permission: 'customers' }
      },
      {
        path: 'customers/assign',
        name: 'StoreCustomerAssign',
        component: () => import('../views/store/customers/Assign.vue'),
        meta: { permission: 'customers' }
      },
      {
        path: 'customers/follow',
        name: 'StoreCustomerFollow',
        component: () => import('../views/store/customers/Follow.vue'),
        meta: { permission: 'customers' }
      },
      {
        path: 'customers/behavior',
        name: 'StoreCustomerBehavior',
        component: () => import('../views/store/customers/Behavior.vue'),
        meta: { permission: 'customers' }
      },
      {
        path: 'users',
        name: 'StoreUsers',
        component: () => import('../views/store/Users.vue'),
        meta: { permission: 'users' }
      },
      {
        path: 'users/guide-accounts',
        name: 'StoreGuideAccounts',
        component: () => import('../views/store/users/GuideAccounts.vue'),
        meta: { permission: 'users' }
      },
      {
        path: 'users/resignation',
        name: 'StoreResignation',
        component: () => import('../views/store/users/Resignation.vue'),
        meta: { permission: 'users' }
      },
      {
        path: 'users/operation-logs',
        name: 'StoreOperationLogs',
        component: () => import('../views/store/users/OperationLogs.vue'),
        meta: { permission: 'users' }
      },
      // 订单管理模块
      {
        path: 'orders/overview',
        name: 'StoreOrdersOverview',
        component: () => import('../views/store/orders/overview/Index.vue'),
        meta: { permission: 'orders' }
      },
      {
        path: 'orders/list',
        name: 'StoreOrdersList',
        component: () => import('../views/store/orders/list/Index.vue'),
        meta: { permission: 'orders' }
      },
      {
        path: 'orders/detail/:id',
        name: 'StoreOrderDetail',
        component: () => import('../views/store/orders/detail/Index.vue'),
        meta: { permission: 'orders' }
      },
      {
        path: 'orders/production',
        name: 'StoreOrdersProduction',
        component: () => import('../views/store/orders/production/Index.vue'),
        meta: { permission: 'orders' }
      },
      {
        path: 'orders/delivery',
        name: 'StoreOrdersDelivery',
        component: () => import('../views/store/orders/delivery/Index.vue'),
        meta: { permission: 'orders' }
      },
      // 财务对账管理模块
      {
        path: 'finance/overview',
        name: 'StoreFinanceOverview',
        component: () => import('../views/store/finance/overview/Index.vue'),
        meta: { permission: 'finance' }
      },
      {
        path: 'finance/reconciliation',
        name: 'StoreFinanceReconciliation',
        component: () => import('../views/store/finance/reconciliation/Index.vue'),
        meta: { permission: 'finance' }
      },
      {
        path: 'finance/receivables',
        name: 'StoreFinanceReceivables',
        component: () => import('../views/store/finance/receivables/Index.vue'),
        meta: { permission: 'finance' }
      },
      {
        path: 'finance/invoices',
        name: 'StoreFinanceInvoices',
        component: () => import('../views/store/finance/invoices/Index.vue'),
        meta: { permission: 'finance' }
      },
      // 售后服务管理模块
      {
        path: 'service/overview',
        name: 'StoreServiceOverview',
        component: () => import('../views/store/service/overview/Index.vue'),
        meta: { permission: 'service' }
      },
      {
        path: 'service/list',
        name: 'StoreServiceList',
        component: () => import('../views/store/service/list/Index.vue'),
        meta: { permission: 'service' }
      },
      {
        path: 'service/processing/:id',
        name: 'StoreServiceProcessing',
        component: () => import('../views/store/service/processing/Index.vue'),
        meta: { permission: 'service' }
      },
      {
        path: 'service/reviews',
        name: 'StoreServiceReviews',
        component: () => import('../views/store/service/reviews/Index.vue'),
        meta: { permission: 'service' }
      },
      // 安装师傅管理模块
      {
        path: 'installers/info',
        name: 'StoreInstallersInfo',
        component: () => import('../views/store/installers/info/Index.vue'),
        meta: { permission: 'installers' }
      },
      {
        path: 'installers/dispatch',
        name: 'StoreInstallersDispatch',
        component: () => import('../views/store/installers/dispatch/Index.vue'),
        meta: { permission: 'installers' }
      },
      {
        path: 'installers/quality',
        name: 'StoreInstallersQuality',
        component: () => import('../views/store/installers/quality/Index.vue'),
        meta: { permission: 'installers' }
      },
      // 客户转介绍管理模块
      {
        path: 'referral/overview',
        name: 'StoreReferralOverview',
        component: () => import('../views/store/referral/overview/Index.vue'),
        meta: { permission: 'referral' }
      },
      {
        path: 'referral/records',
        name: 'StoreReferralRecords',
        component: () => import('../views/store/referral/records/Index.vue'),
        meta: { permission: 'referral' }
      },
      {
        path: 'referral/rewards',
        name: 'StoreReferralRewards',
        component: () => import('../views/store/referral/rewards/Index.vue'),
        meta: { permission: 'referral' }
      },
      {
        path: 'referral/statistics',
        name: 'StoreReferralStatistics',
        component: () => import('../views/store/referral/statistics/Index.vue'),
        meta: { permission: 'referral' }
      },
      {
        path: 'marketing/headquarters',
        name: 'StoreMarketingHeadquarters',
        component: () => import('../views/store/marketing/headquarters/Index.vue'),
        meta: { permission: 'marketing' }
      },
      {
        path: 'marketing/store',
        name: 'StoreMarketingStore',
        component: () => import('../views/store/marketing/store/Index.vue'),
        meta: { permission: 'marketing' }
      },
      {
        path: 'marketing/data',
        name: 'StoreMarketingData',
        component: () => import('../views/store/marketing/data/Index.vue'),
        meta: { permission: 'marketing' }
      },
      {
        path: 'marketing/sms',
        name: 'StoreMarketingSms',
        component: () => import('../views/store/marketing/sms/Index.vue'),
        meta: { permission: 'marketing' }
      },
      // 门店采购商城模块
      {
        path: 'purchase/products',
        name: 'StorePurchaseProducts',
        component: () => import('../views/store/purchase/products/Index.vue'),
        meta: { permission: 'purchase' }
      },
      {
        path: 'purchase/cart',
        name: 'StorePurchaseCart',
        component: () => import('../views/store/purchase/cart/Index.vue'),
        meta: { permission: 'purchase' }
      },
      {
        path: 'purchase/orders',
        name: 'StorePurchaseOrders',
        component: () => import('../views/store/purchase/orders/Index.vue'),
        meta: { permission: 'purchase' }
      },
      {
        path: 'purchase/aftersales',
        name: 'StorePurchaseAftersales',
        component: () => import('../views/store/purchase/aftersales/Index.vue'),
        meta: { permission: 'purchase' }
      },
      // 门店经营数据看板
      {
        path: 'dashboard',
        name: 'StoreDashboard',
        component: () => import('../views/store/dashboard/Index.vue'),
        meta: { permission: 'dashboard' }
      },
      // 团队培训与业绩管理
      {
        path: 'training',
        name: 'StoreTraining',
        component: () => import('../views/store/training/Index.vue'),
        meta: { permission: 'training' }
      },
      // 门店基础配置
      {
        path: 'settings',
        name: 'StoreSettings',
        component: () => import('../views/store/settings/Index.vue'),
        meta: { permission: 'settings' }
      }
    ]
  },
  
  // 总部运营端路由
  {
    path: '/headquarters',
    name: 'HeadquartersLayout',
    component: () => import('../components/HeadquartersLayout.vue'),
    meta: { requiresAuth: true, terminal: 'headquarters' },
    children: [
      {
        path: 'home',
        name: 'HeadquartersHome',
        component: () => import('../views/headquarters/Home.vue'),
        meta: { permission: 'dashboard' }
      },
      {
        path: 'products',
        name: 'HeadquartersProducts',
        component: () => import('../views/headquarters/Products.vue'),
        meta: { permission: 'products' }
      },
      {
        path: 'cases',
        name: 'HeadquartersCases',
        component: () => import('../views/headquarters/Cases.vue'),
        meta: { permission: 'cases' }
      },
      {
        path: 'customers',
        name: 'HeadquartersCustomers',
        component: () => import('../views/headquarters/Customers.vue'),
        meta: { permission: 'customers' }
      },
      {
        path: 'users',
        name: 'HeadquartersUsers',
        component: () => import('../views/headquarters/Users.vue'),
        meta: { permission: 'users' }
      },
      {
        path: 'settings',
        name: 'HeadquartersSettings',
        component: () => import('../views/headquarters/Settings.vue'),
        meta: { permission: 'settings' }
      },
      {
        path: 'settings/platform',
        name: 'HeadquartersSettingsPlatform',
        component: () => import('../views/headquarters/settings/Platform.vue'),
        meta: { permission: 'settings' }
      },
      {
        path: 'settings/menu',
        name: 'HeadquartersSettingsMenu',
        component: () => import('../views/headquarters/system/Menu.vue'),
        meta: { permission: 'settings' }
      },
      {
        path: 'settings/dictionary',
        name: 'HeadquartersSettingsDictionary',
        component: () => import('../views/headquarters/settings/Dictionary.vue'),
        meta: { permission: 'settings' }
      },
      {
        path: 'settings/log',
        name: 'HeadquartersSettingsLog',
        component: () => import('../views/headquarters/settings/Log.vue'),
        meta: { permission: 'settings' }
      },
      // 财务结算管理模块
      {
        path: 'finance',
        name: 'HeadquartersFinance',
        component: () => import('../views/headquarters/finance/Index.vue'),
        meta: { permission: 'finance' }
      },
      {
        path: 'finance/reconciliation',
        name: 'HeadquartersFinanceReconciliation',
        component: () => import('../views/headquarters/finance/Reconciliation.vue'),
        meta: { permission: 'finance' }
      },
      {
        path: 'finance/rebate',
        name: 'HeadquartersFinanceRebate',
        component: () => import('../views/headquarters/finance/Rebate.vue'),
        meta: { permission: 'finance' }
      },
      {
        path: 'finance/deposit',
        name: 'HeadquartersFinanceDeposit',
        component: () => import('../views/headquarters/finance/Deposit.vue'),
        meta: { permission: 'finance' }
      },
      {
        path: 'finance/invoice',
        name: 'HeadquartersFinanceInvoice',
        component: () => import('../views/headquarters/finance/Invoice.vue'),
        meta: { permission: 'finance' }
      },
      // 安装服务全链路管控模块
      {
        path: 'service',
        name: 'HeadquartersService',
        component: () => import('../views/headquarters/service/Index.vue'),
        meta: { permission: 'service' }
      },
      {
        path: 'service/workers',
        name: 'HeadquartersServiceWorkers',
        component: () => import('../views/headquarters/service/Workers.vue'),
        meta: { permission: 'service' }
      },
      {
        path: 'service/orders',
        name: 'HeadquartersServiceOrders',
        component: () => import('../views/headquarters/service/Orders.vue'),
        meta: { permission: 'service' }
      },
      {
        path: 'service/quality',
        name: 'HeadquartersServiceQuality',
        component: () => import('../views/headquarters/service/Quality.vue'),
        meta: { permission: 'service' }
      },
      {
        path: 'service/reviews',
        name: 'HeadquartersServiceReviews',
        component: () => import('../views/headquarters/service/Reviews.vue'),
        meta: { permission: 'service' }
      },
      // 品牌合规管控模块
      {
        path: 'compliance',
        name: 'HeadquartersCompliance',
        component: () => import('../views/headquarters/compliance/Index.vue'),
        meta: { permission: 'compliance' }
      },
      {
        path: 'compliance/pricing',
        name: 'HeadquartersCompliancePricing',
        component: () => import('../views/headquarters/compliance/Pricing.vue'),
        meta: { permission: 'compliance' }
      },
      {
        path: 'compliance/warnings',
        name: 'HeadquartersComplianceWarnings',
        component: () => import('../views/headquarters/compliance/Warnings.vue'),
        meta: { permission: 'compliance' }
      },
      // 供应链对接管理模块
      {
        path: 'supply',
        name: 'HeadquartersSupply',
        component: () => import('../views/headquarters/supply/Index.vue'),
        meta: { permission: 'supply' }
      },
      {
        path: 'supply/production',
        name: 'HeadquartersSupplyProduction',
        component: () => import('../views/headquarters/supply/Production.vue'),
        meta: { permission: 'supply' }
      },
      {
        path: 'supply/inventory',
        name: 'HeadquartersSupplyInventory',
        component: () => import('../views/headquarters/supply/Inventory.vue'),
        meta: { permission: 'supply' }
      },
      {
        path: 'supply/logistics',
        name: 'HeadquartersSupplyLogistics',
        component: () => import('../views/headquarters/supply/Logistics.vue'),
        meta: { permission: 'supply' }
      },
      {
        path: 'supply/suppliers',
        name: 'HeadquartersSupplySuppliers',
        component: () => import('../views/headquarters/supply/Suppliers.vue'),
        meta: { permission: 'supply' }
      },
      // 加盟商招商全流程管理模块
      {
        path: 'franchise',
        name: 'HeadquartersFranchise',
        component: () => import('../views/headquarters/franchise/Index.vue'),
        meta: { permission: 'franchise' }
      },
      {
        path: 'franchise/intents',
        name: 'HeadquartersFranchiseIntents',
        component: () => import('../views/headquarters/franchise/Intents.vue'),
        meta: { permission: 'franchise' }
      },
      {
        path: 'franchise/process',
        name: 'HeadquartersFranchiseProcess',
        component: () => import('../views/headquarters/franchise/Process.vue'),
        meta: { permission: 'franchise' }
      },
      {
        path: 'franchise/contracts',
        name: 'HeadquartersFranchiseContracts',
        component: () => import('../views/headquarters/franchise/Contracts.vue'),
        meta: { permission: 'franchise' }
      },
      {
        path: 'franchise/policies',
        name: 'HeadquartersFranchisePolicies',
        component: () => import('../views/headquarters/franchise/Policies.vue'),
        meta: { permission: 'franchise' }
      },
      // B端采购商城管理模块
      {
        path: 'purchase',
        name: 'HeadquartersPurchase',
        component: () => import('../views/headquarters/purchase/Index.vue'),
        meta: { permission: 'purchase' }
      },
      {
        path: 'purchase/products',
        name: 'HeadquartersPurchaseProducts',
        component: () => import('../views/headquarters/purchase/Products.vue'),
        meta: { permission: 'purchase' }
      },
      {
        path: 'purchase/orders',
        name: 'HeadquartersPurchaseOrders',
        component: () => import('../views/headquarters/purchase/Orders.vue'),
        meta: { permission: 'purchase' }
      },
      {
        path: 'purchase/suppliers',
        name: 'HeadquartersPurchaseSuppliers',
        component: () => import('../views/headquarters/purchase/Suppliers.vue'),
        meta: { permission: 'purchase' }
      },
      // 培训赋能管理模块
      {
        path: 'training',
        name: 'HeadquartersTraining',
        component: () => import('../views/headquarters/training/Index.vue'),
        meta: { permission: 'training' }
      },
      {
        path: 'training/courses',
        name: 'HeadquartersTrainingCourses',
        component: () => import('../views/headquarters/training/Courses.vue'),
        meta: { permission: 'training' }
      },
      {
        path: 'training/system',
        name: 'HeadquartersTrainingSystem',
        component: () => import('../views/headquarters/training/System.vue'),
        meta: { permission: 'training' }
      },
      {
        path: 'training/activities',
        name: 'HeadquartersTrainingActivities',
        component: () => import('../views/headquarters/training/Activities.vue'),
        meta: { permission: 'training' }
      },
      // 组织与账号权限管理模块
      {
        path: 'stores',
        name: 'HeadquartersStores',
        component: () => import('../views/headquarters/stores/Index.vue'),
        meta: { permission: 'stores' }
      },
      {
        path: 'logs',
        name: 'HeadquartersLogs',
        component: () => import('../views/headquarters/logs/Index.vue'),
        meta: { permission: 'logs' }
      },
      // 内容资源统一管控中心
      {
        path: 'scripts',
        name: 'HeadquartersScripts',
        component: () => import('../views/headquarters/scripts/Index.vue'),
        meta: { permission: 'scripts' }
      },
      {
        path: 'materials',
        name: 'HeadquartersMaterials',
        component: () => import('../views/headquarters/materials/Index.vue'),
        meta: { permission: 'materials' }
      },
      // 全平台客资统筹管理
      {
        path: 'ocean',
        name: 'HeadquartersOcean',
        component: () => import('../views/headquarters/ocean/Index.vue'),
        meta: { permission: 'ocean' }
      },
      {
        path: 'transfer',
        name: 'HeadquartersTransfer',
        component: () => import('../views/headquarters/transfer/Index.vue'),
        meta: { permission: 'transfer' }
      },
      // 营销工具与活动总控
      {
        path: 'marketing/tools',
        name: 'HeadquartersMarketingTools',
        component: () => import('../views/headquarters/marketing/Tools.vue'),
        meta: { permission: 'marketing' }
      },
      {
        path: 'marketing/activities',
        name: 'HeadquartersMarketingActivities',
        component: () => import('../views/headquarters/marketing/Activities.vue'),
        meta: { permission: 'marketing' }
      },
      {
        path: 'marketing/community',
        name: 'HeadquartersMarketingCommunity',
        component: () => import('../views/headquarters/marketing/Community.vue'),
        meta: { permission: 'marketing' }
      },
      {
        path: 'marketing/sms',
        name: 'HeadquartersMarketingSms',
        component: () => import('../views/headquarters/marketing/Sms.vue'),
        meta: { permission: 'marketing' }
      },
      // 全链路数据运营中心
      {
        path: 'data/analysis',
        name: 'HeadquartersDataAnalysis',
        component: () => import('../views/headquarters/data/Analysis.vue'),
        meta: { permission: 'data' }
      },
      {
        path: 'data/reports',
        name: 'HeadquartersDataReports',
        component: () => import('../views/headquarters/data/Reports.vue'),
        meta: { permission: 'data' }
      },
      {
        path: 'data/alerts',
        name: 'HeadquartersDataAlerts',
        component: () => import('../views/headquarters/data/Alerts.vue'),
        meta: { permission: 'data' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 初始化用户状态
  if (!userStore.isLoggedIn) {
    userStore.initUserState()
  }
  
  // 不需要认证的路由
  if (!to.meta.requiresAuth) {
    next()
    return
  }
  
  // 需要认证的路由
  if (!userStore.isLoggedIn) {
    next('/terminal-select')
    return
  }
  
  // 终端权限检查
  if (to.meta.terminal && to.meta.terminal !== userStore.selectedTerminal) {
    // 根据用户当前终端跳转到对应首页
    let homePath = '/'
    switch (userStore.selectedTerminal) {
      case 'headquarters':
        homePath = '/headquarters/home'
        break
      case 'store':
        homePath = '/store/home'
        break
      case 'guide':
        homePath = '/guide/dashboard'
        break
      default:
        homePath = '/terminal-select'
    }
    next(homePath)
    return
  }
  
  // 权限检查
  if (to.meta.permission && !userStore.hasPermission(to.meta.permission)) {
    next(from.path || '/terminal-select')
    return
  }
  
  next()
})

export default router