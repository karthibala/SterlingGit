angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

.run(function($ionicPlatform,$rootScope,$location,$state,$cordovaToast,$timeout,$interval) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
	$ionicPlatform.registerBackButtonAction(function () {
	if (condition) {
		//navigator.app.exitApp();
	} else {
		
	}
	}, 100);
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})
	.state('login', {
		cache: false,
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'loginCtrl'
	})
	.state('contact', {
		url: '/contact',
		templateUrl: 'templates/contact.html',
		controller: 'contactCtrl'
	})
	
	.state('app.noplan', {
		url: "/noplan",
		template: "<h1>No active plan</h1>"
	})
	
	// HSA
	.state('app.hsa', {
		url: "/hsa",
		views: {
			'tab-hsa': {
				templateUrl: "templates/hsa.html",
				controller: 'HsaCtrl'
			}
		}
	})
	.state('accounts', {
		url: '/accounts',
		cache: false,
		templateUrl: 'templates/account.html',
		controller: 'AccountCtrl'
	})
	.state('health', {
		cache: false,
		url: '/health',
		templateUrl: 'templates/health.html',
		controller: 'HealthCtrl'
	})
	.state('makecontribution', {
		cache: false,
		url: '/makecontribution',
		templateUrl: 'templates/makecontribution.html',
		controller: 'makecontributeCtrl'
	})
	.state('activitystmnt', {
		cache: false,
		url: '/activitystmnt',
		templateUrl: 'templates/activitystmnt.html',
		controller: 'ActivitystmntCtrl'
	})
	.state('payme', {
		cache: false,
		url: '/payme',
		templateUrl: 'templates/payme.html',
		controller: 'PaymeCtrl'
	})
	.state('payprovider', {
		cache: false,
		url: '/payprovider',
		templateUrl: 'templates/payprovider.html',
		controller: 'PayproviderCtrl'
	})
	.state('taxyear', {
		cache: false,
		url: '/taxyear',
		templateUrl: 'templates/taxyear.html',
		controller: 'TaxyearCtrl'
	})
	.state('hsastatement', {
		cache: false,
		url: '/hsastatement',
		templateUrl: 'templates/hsastatement.html',
		controller: 'HsastatementCtrl'
	})
	.state('activityContribution', {
		cache: false,
		url: '/activityContribution',
		templateUrl: 'templates/activityContribution.html',
		controller: 'activityContributionyCtrl'
	})
	.state('disbursement', {
		cache: false,
		url: '/disbursement',
		templateUrl: 'templates/disbursement.html',
		controller: 'DisbursementCtrl'
	})
	.state('scheduledcontribute', {
		cache: false,
		url: '/scheduledcontribute',
		templateUrl: 'templates/scheduledcontribute.html',
		controller: 'ScheduledcontributeCtrl'
	})
	
	//FSA
	.state('app.fsa', {
		url: "/fsa",
		views: {
			'tab-fsa': {
				templateUrl: "templates/fsa.html",
				controller: 'FsaCtrl'
			}
		}
	})
	.state('contribution', {
		cache: false,
		url: '/contribution',
		templateUrl: 'templates/contribution.html',
		controller: 'ContributionCtrl'
	})
	.state('make', {
		cache: false,
		url: '/make',
		templateUrl: 'templates/make.html',
		controller: 'MakeCtrl'  
	})	
	.state('activity', {
		cache: false,
		url: '/activity',
		templateUrl: 'templates/activity.html',
		controller: 'ActivityCtrl'
	})
	.state('recent', {
		cache: false,
		url: '/recent',
		templateUrl: 'templates/recent.html',
		controller: 'RecentCtrl'
	})
	.state('recentdisburse', {
		cache: false,
		url: '/recentdisburse',
		templateUrl: 'templates/recentdisburse.html',
		controller: 'RecentdisburseCtrl'
	})
	.state('scheduleddisbursement', {
		cache: false,
		url: '/scheduleddisbursement',
		templateUrl: 'templates/scheduleddisbursement.html',
		controller: 'ScheduledDisbursementCtrl'
	})
	.state('lastdisbursement', {
		cache: false,
		url: '/lastdisbursement',
		templateUrl: 'templates/lastdisbursement.html',
		controller: 'lastdisbursementCtrl'
	})
	.state('lastcontribution', {
		cache: false,
		url: '/lastcontribution',
		templateUrl: 'templates/lastcontribution.html',
		controller: 'lastcontributionCtrl'
	})
	.state('fsacontribution', {
		cache: false,
		url: '/fsacontribution',
		templateUrl: 'templates/fsacontribution.html',
		controller: 'fsacontributionCtrl'
	})
	.state('information', {
		cache: false,
		url: '/information',
		templateUrl: 'templates/information.html',
		controller: 'InformationCtrl'
	})
	.state('availablebalance', {
		cache: false,
		url: '/availablebalance',
		templateUrl: 'templates/availablebalance.html',
		controller: 'AvailablebalanceCtrl'
	})
	.state('newclaim', {
		cache: false,
		url: '/newclaim',
		templateUrl: 'templates/newclaim.html',
		controller: 'newclaimCtrl'
	})
	.state('recentdis', {
		cache: false,
		url: '/recentdis',
		templateUrl: 'templates/recentdisburse.html',
		controller: 'RecentdisCtrl'
	})
	.state('recentcontribute', {
		cache: false,
		url: '/recentcontribute',
		templateUrl: 'templates/recentcontribute.html',
		controller: 'RecentcontributeCtrl'
	})
	.state('new', {
		cache: false,
		url: '/new',
		templateUrl: 'templates/new.html',
		controller: 'NewCtrl'
	})
	.state('fsapayme', {
		cache: false,
		url: '/fsapayme',
		templateUrl: 'templates/fsa/fsapayme.html',
		controller: 'FsapaymeCtrl'
	})
	.state('fsapayprovider', {
		cache: false,
		url: '/fsapayprovider',
		templateUrl: 'templates/fsa/fsapayprovider.html',
		controller: 'fsapayproviderCtrl'
	})
	.state('fsadependent', {
		cache: false,
		url: '/fsadependent',
		templateUrl: 'templates/fsa/fsadependent.html',
		controller: 'fsadependentCtrl'
	})	
	.state('fsacardclaim', {
		cache:false,
		url: '/fsacardclaim',
		templateUrl: 'templates/fsa/fsacardclaim.html',
		controller: 'fsacardclaimCtrl'
	})
	.state('fsacarddetail', {
		cache:false,
		url: '/fsacarddetail',
		templateUrl: 'templates/fsa/fsacarddetail.html',
		controller: 'fsacarddetailCtrl'
	})
	.state('fsaclaimdetail', {
		cache:false,
		url: '/fsaclaimdetail',
		templateUrl: 'templates/fsa/fsaclaimdetail.html',
		controller: 'fsaclaimdetailCtrl'
	})
	.state('fsaclaimview', {
		cache:false,
		url: '/fsaclaimview',
		templateUrl: 'templates/fsa/fsaclaimview.html',
		controller: 'fsaclaimviewCtrl'
	})
	.state('fsanewcardclaimview', {
		cache:false,
		url: '/fsanewcardclaimview',
		templateUrl: 'templates/fsa/fsanewcardclaimview.html',
		controller: 'fsanewcardclaimviewCtrl'
	})
	.state('fsanewcardclaim', {
		cache:false,
		url: '/fsanewcardclaim',
		templateUrl: 'templates/fsa/fsanewcardclaim.html',
		controller: 'fsanewcardclaimCtrl'
	})
	
	// HRA 
	.state('app.hra', {
		url: "/hra",
		views: {
			'tab-hra': {
				templateUrl: "templates/hra/hra.html",
				controller: 'HraCtrl'
			}
		}
	})
	.state('hraacct', {
		cache: false,
		url: '/hraacct',
		templateUrl: 'templates/hra/hraacct.html',
		controller: 'HraacctCtrl'
	})
	.state('hracontribution', {
		cache: false,
		url: '/hracontribution',
		templateUrl: 'templates/hra/hracontribution.html',
		controller: 'HracontributionCtrl'
	})
	.state('hradisburse', {
		cache: false,
		url: '/hradisburse',
		templateUrl: 'templates/hra/hradisburse.html',
		controller: 'HradisburseCtrl'
	})
	.state('hranewclaim', {
		cache: false,
		url: '/hranewclaim',
		templateUrl: 'templates/hra/hranewclaim.html',
		controller: 'HranewclaimCtrl'
	})
	.state('hrarecent', {
		cache: false,
		url: '/hrarecent',
		templateUrl: 'templates/hra/hrarecent.html',
		controller: 'HrarecentCtrl'
	})
	.state('hrapayme', {
		cache: false,
		url: '/hrapayme',
		templateUrl: 'templates/hra/hrapayme.html',
		controller: 'HrapaymeCtrl'
	})
	.state('hrapayprovider', {
		cache: false,
		url: '/hrapayprovider',
		templateUrl: 'templates/hra/hrapayprovider.html',
		controller: 'HrapayproviderCtrl'
	})
	.state('hrabal', {
		cache: false,
		url: '/hrabal',
		templateUrl: 'templates/hra/hrabal.html',
		controller: 'HrabalCtrl'
	})
	.state('paymeacoinde', {
		cache: false,
		url: '/paymeacoinde',
		templateUrl: 'templates/hra/paymeacoinde.html',
		controller: 'PaymeacoindeCtrl'
	})
	.state('payprovideracoinde', {
		cache: false,
		url: '/payprovideracoinde',
		templateUrl: 'templates/hra/payprovideracoinde.html',
		controller: 'PayprovideracoindeCtrl'
	})
	.state('hracardclaim', {
		cache:false,
		url: '/hracardclaim',
		templateUrl: 'templates/hra/hracardclaim.html',
		controller: 'hracardclaimCtrl'
	})
	.state('hracarddetail', {
		cache:false,
		url: '/hracarddetail',
		templateUrl: 'templates/hra/hracarddetail.html',
		controller: 'hracarddetailCtrl'
	})
	.state('hraclaimdetail', {
		cache:false,
		url: '/hraclaimdetail',
		templateUrl: 'templates/hra/hraclaimdetail.html',
		controller: 'hraclaimdetailCtrl'
	})
	.state('hraclaimview', {
		cache:false,
		url: '/hraclaimview',
		templateUrl: 'templates/hra/hraclaimview.html',
		controller: 'hraclaimviewCtrl'
	})
	.state('hranewcardclaimview', {
		cache:false,
		url: '/hranewcardclaimview',
		templateUrl: 'templates/hra/hranewcardclaimview.html',
		controller: 'hranewcardclaimviewCtrl'
	})
	.state('hranewcardclaim', {
		cache:false,
		url: '/hranewcardclaim',
		templateUrl: 'templates/hra/hranewcardclaim.html',
		controller: 'hranewcardclaimCtrl'
	})
	// cobra
	.state('app.cobra', {
		url: "/cobra",
		views: {
			'tab-cobra': {
				templateUrl: "templates/cobra/cobra.html",
				controller: 'CobraCtrl'
			}
		}
	})
	.state('cobraaccount', {
		cache: false,
		url: "/cobraaccount",
		templateUrl: "templates/cobra/cobraaccount.html",
		controller: 'CobraaccountCtrl'
	})
	.state('cobrapayment', {
		cache:false,
		url: "/cobrapayment",
		templateUrl: "templates/cobra/cobrapayment.html",
		controller: 'CobraPaymentCtrl'
	});
	$urlRouterProvider.otherwise('/login');
});
