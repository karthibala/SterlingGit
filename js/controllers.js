angular.module('starter.controllers', [])
.controller('mainController', function($scope,$ionicPlatform,$rootScope) {
	$ionicPlatform.ready(function() {
		$rootScope.IOS = ionic.Platform.isIOS();
		$rootScope.Android = ionic.Platform.isAndroid();
		if($rootScope.IOS==true){
			$scope.layout='style-ios'
		}else if($rootScope.Android==true){
			$scope.layout='style-android'
		}
	})
})
.controller('loginCtrl', function($scope,$timeout,$cordovaNetwork,$cordovaDialogs,$location,$ionicLoading,$ionicPopup,$ionicTabsDelegate,$http,$rootScope) {
	$scope.loginData={username:'',password:''};
	$scope.hidetabb=$rootScope.hidetab;
	$scope.logIn = function (loginData) {
		$ionicLoading.show({
		template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
		});
		if($cordovaNetwork.isOffline())
		{
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please Connect with internet'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please Connect with internet', 'Sorry', 'ok')
				.then(function() {
				});
				return false;
			}	
		}
		else if($scope.loginData.username==""){
			$ionicLoading.hide()
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please Enter Username'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please Enter Username', 'Sorry', 'OK')
				.then(function() {
				});
				return false;
			}	
		}
		else if($scope.loginData.password=="")
		{
			$ionicLoading.hide()
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please Enter Password'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please Enter Password', 'Sorry', 'ok')
				.then(function() {
				});
				return false;
			}	
			
		}
		else
		{
			$http.post(' http://app.sterlinghsa.com/api/v1/user/login',{username:$scope.loginData.username,password:$scope.loginData.password},{headers: {'Content-Type':'application/json; charset=utf-8'} })     
			.success(function(data) {
				if(data.status == "SUCCESS"){
					$ionicLoading.hide()
					localStorage.setItem('access_token',data.access_token);
					localStorage.setItem('username',$scope.loginData.username);
					window.location.href = 'index.html#/app/hsa';				
				}else if(data.status=="FAILED"){
					$ionicLoading.hide();
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: 'Username or password is incorrect'
						});

						alertPopup.then(function(res) {
						});
					}else{
						$cordovaDialogs.alert('Username or password is incorrect ', 'Sorry', 'OK')
							.then(function() {
						});
						return false;
					}	
				}
			}).error(function(err){		
			});
		}
	}
})
//HSA Start//
.controller('HsaCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$ionicHistory,$ionicTabsDelegate,$ionicPopup) {
 
 $scope.goForward = function () {
  
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1) {
            $ionicTabsDelegate.select(selected + 1);
        }
    }
    
 localStorage.setItem("backCount","2");
 $scope.username = localStorage.getItem('username');
 $scope.access_token = localStorage.getItem('access_token');
  $http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
     .success(function(data){
    $rootScope.acctype=data.account_types;
    if(data.account_types.HSA!=undefined){
     localStorage.setItem('account_types',data.account_types.HSA);
     $scope.account_type=data.account_types.HSA;
     $rootScope.hsaaccno=data.account_types.HSA.ACCT_NUM;
     $rootScope.hsaaccId=data.account_types.HSA.ACCT_ID;
    }else if(data.account_types.FSA!=undefined){
     localStorage.setItem('account_types',data.account_types.FSA);
     $scope.account_types=data.account_types.FSA;
     $rootScope.fsaaccno=data.account_types.FSA.ACCT_NUM;
     $rootScope.fsaaccId=data.account_types.FSA.ACCT_ID;
    }else if(data.account_types.HRA!=undefined){
     localStorage.setItem('account_types',data.account_types.HRA);
     $scope.account_types=data.account_types.HRA;
     $rootScope.hraaccno=data.account_types.HRA.ACCT_NUM; 
     $rootScope.hraaccId=data.account_types.HRA.ACCT_ID;
    }else if(data.account_types.COBRA!=undefined){
     localStorage.setItem('account_types',data.account_types.COBRA);
     $scope.account_types=data.account_types.COBRA;
     $rootScope.hraaccno=data.account_types.COBRA.ACCT_NUM; 
     $rootScope.hraaccId=data.account_types.COBRA.ACCT_ID;
     $rootScope.cobrassn=data.account_types.COBRA.SSN;
    }
    
     $http.get(' http://app.sterlinghsa.com/api/v1/accounts/accountinfo',{params:{'type':'hsa','acc_num': data.account_types.HSA.ACCT_NUM},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
     .success(function(data){
      $scope.contributions=data.total_contributions.CURRENT_YR_CONTRB;
     }).error(function(err){
      
     });
      }).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
   });
})
.controller('makecontributeCtrl', function($scope,$cordovaNetwork,$rootScope,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$filter) {
	$rootScope.hidecontent=true;
	$scope.TransDate="";
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccno=$rootScope.hsaaccno;
	$scope.hsaacctype=$rootScope.hsaacctype;
	$scope.acc_num=$rootScope.hsaaccno;
	$scope.makecontribute={selectAccount:'',amount:'',TransDate:'',feeamount:'',selectdescription:''};
	$scope.hsaaccId=$rootScope.hsaaccId;
	$scope.floatlabel=false;
	$scope.floatlabel1=false;
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');

	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	$scope.SelectFloat1 = function ()
	{ 
		$scope.floatlabel1=true;
	}
	
	$scope.getTransDate=function(){
		var options = {
			date: new Date(),
			mode: 'date', // or 'time'
			minDate: new Date(),

		}
		$ionicPlatform.ready(function(){
			$cordovaDatePicker.show(options).then(function(date){
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.makecontribute.TransDate=selectedDate;
			});
		})

	};
	
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}	
	}else{
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/bankdetails",{params:{'type':'hsa', 'acc_num':$scope.hsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			$scope.bank_details=data.bank_details;
		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}	
		});
	}
	
    $http.get(' http://app.sterlinghsa.com/api/v1/accounts/accountinfo',{params:{'type':'hsa','acc_num': $scope.acc_num},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$ionicLoading.hide();
		$scope.total_contribution = data.total_contributions;
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
	});
 
	$http.get(' http://app.sterlinghsa.com/api/v1/accounts/description',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.description=data.description ;
	}).error(function(err){
	});
 
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/balances",{params:{'type':'hra'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$ionicLoading.hide();
		$scope.Availablebalance=data.balances.BALANCE;
	}).error(function(err){
	});	
  
	$scope.submitvalues=function(){
		if($scope.makecontribute.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});

			}	
		}else if($scope.date >= $scope.makecontribute.TransDate){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please select future date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please select future date','Sorry','OK')
				.then(function() {
				});
			}
		}else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});

			$http.post(" http://app.sterlinghsa.com/api/v1/accounts/makecontribution",{'acct_id':$scope.hsaaccId,'acct_type':$scope.hsaacctype,'bank_acct_id':$scope.makecontribute.selectAccount.BANK_ACC_ID,'amount':$scope.makecontribute.amount,'fee_amount':$scope.makecontribute.feeamount,'reason_code':$scope.makecontribute.selectdescription.FEE_CODE,'trans_date':$scope.makecontribute.TransDate},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){
				if(data.status == "SUCCESS")
				{
					$ionicLoading.hide();
					$scope.transactionid = data.transaction_id;	
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Contribution Submitted Successfully',
							template: 'Transaction ID is '+ "" + $scope.transactionid 
						});

						alertPopup.then(function(res) {
							$scope.makecontribute={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
							$scope.myForm.setPristine();
						});
					}else{
						$cordovaDialogs.alert('Transaction ID is '+ "" + $scope.transactionid , 'Contribution Submitted Successfully', 'OK')
						.then(function() {
							$scope.makecontribute={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
							$scope.myForm.setPristine();

						});
						return false;
					}	
					
				}else if(data.status == "FAILED"){
					$ionicLoading.hide();
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: data.error_message 
						});

						alertPopup.then(function(res) {
							$scope.makecontribute={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
							$scope.myForm.setPristine();
						});
					}else{
						$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
						.then(function() {
							$scope.makecontribute={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;
					});
					return false;
					}						
				}
			}).error(function(err){
			});
		}
	}
	
	$scope.goback=function()
	{
		$location.path("/app/hsa")
	}
	
})
.controller('AccountCtrl', function($rootScope,$scope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$ionicHistory,$ionicPopup) {
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.acc_num=$rootScope.hsaaccno;

	$http.get(' http://app.sterlinghsa.com/api/v1/accounts/accountinfo',{params:{'type':'hsa','acc_num': $scope.acc_num},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$ionicLoading.hide();
		localStorage.setItem('account_information',data.account_information);
		localStorage.setItem('total_contributions',data.total_contributions);
		$scope.account_information=data.account_information;
		$rootScope.total_contributions = data.total_contributions;

	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}

	});
	$scope.goback=function()
	{
		window.history.back();
	}
			
})
.controller('ActivitystmntCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$filter) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$rootScope.activity={startDate:'',EndtDate:''};
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	
	$scope.pick=function(){	

		if($scope.activity.EndtDate=="" || $scope.activity.startDate ==""){
			$cordovaDialogs.confirm('Please select date', 'Sorry', 'ok')
			.then(function(buttonIndex)
			{
				if(buttonIndex=="1")
				{
					localStorage.clear();
					$location.path('activitystmnt');
				}
			});

		}	
		else if($scope.activity.startDate >$scope.date){
			$cordovaDialogs.confirm('Cannot select future date in From date', 'Sorry', 'ok')
			.then(function(buttonIndex)
			{
			if(buttonIndex=="1")
			{
				localStorage.clear();
				$location.path('activitystmnt');
			}
			});

		}
		else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});
			$http.post('http://app.sterlinghsa.com/api/v1/accounts/activitystatement',{fromdate:$rootScope.activity.startDate,todate:$rootScope.activity.EndtDate, 'account':$rootScope.hsaaccno },{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
			.success(function(data){
				$rootScope.summary_list=data.summary_list;
				$rootScope.activity_list=data.activity_list;
				$ionicLoading.hide();
				$location.path("hsastatement");
				$scope.activity={};

			}).error(function(err){
			
			});
		}
	};

	$scope.getStartDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.activity.startDate=selectedDate;

		});
	};
	
	$scope.getEndDate=function(){
		var today = new Date();
		var _maxDate = new Date();
		_maxDate.setMonth(today.getMonth()+900);

		var maxdate = ionic.Platform.isIOS() ? new Date(_maxDate.getFullYear(),_maxDate.getMonth(),_maxDate.getDay()) :
		(new Date(_maxDate.getFullYear(), _maxDate.getMonth(), _maxDate.getDay())).valueOf();
		var minDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: minDate,maxDate: maxdate, mode: 'date'}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.activity.EndtDate=selectedDate;
		});

	}

	$scope.goback=function()
	{
		$rootScope.hidecontent=true;
		$scope.activity={};
		$location.path("app/hsa");
		
	}
})
.controller('PaymeCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaImagePicker,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaCamera,$ionicPopup,$filter) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.paymeValues={selectAccount:'',amount:'',TransDate:'',category:'',imgValue:''};
	$scope.access_token = localStorage.getItem('access_token');
    $scope.hsaaccId=$rootScope.hsaaccId;
    $scope.hsaaccno=$rootScope.hsaaccno;
	$scope.msghide=true;
	$scope.floatlabel=false;
	$scope.floatlabel1=false;
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	$scope.SelectFloat1 = function ()
	{ 
		$scope.floatlabel1=true;
	}
	
	
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
					maximumImagesCount: 5,
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
					
				} else {
					var options = {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
		.then(function(options) {
			if(options==1){
				var options = {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
			}else if(options==2){
				var options = {
					maximumImagesCount: 5,
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
			}
		});
		}
	}
	
	$scope.TransDate="";
	$scope.getTransDate=function(){
		var options = {
			date: new Date(),
			mode: 'date', // or 'time'
			minDate: new Date(),

		}
	$ionicPlatform.ready(function(){
		$cordovaDatePicker.show(options).then(function(date){

			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.paymeValues.TransDate=selectedDate;
		});
		})

	};
	 	
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Please Connect with internet'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.alert('Please Connect with internet', 'Sorry', 'ok')
			.then(function() {
			});
			return false;
		}
	}else{
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/bankdetails",{params:{'type':'hsa', 'acc_num':$scope.hsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$scope.bank_details=data.bank_details;
		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	 
	$http.get('  http://app.sterlinghsa.com/api/v1/accounts/categories',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.categories=data.categories;
		}).error(function(err){
    });
 
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/balances",{params:{'type':'hsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.Availablebalance=data.balances.BALANCE;
	}).error(function(err){

	});
  
	$scope.payme=function(myForm){
		if($scope.paymeValues.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});
			}
		}else if($scope.date >= $scope.paymeValues.TransDate){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please select future date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please select future date','Sorry','OK')
				.then(function() {
				});
			}
		}else if($scope.imgSrc==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else {	
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});

			$http.post("http://app.sterlinghsa.com/api/v1/accounts/payme",{'hsa_acct_id': $scope.hsaaccId,'bank_acct_id':$scope.paymeValues.selectAccount.BANK_ACC_ID,'amount':$scope.paymeValues.amount,'category':$scope.paymeValues.category.LOOKUP_CODE,'trans_date':$scope.paymeValues.TransDate,"receipt":$scope.imgSrc,"file_name":$scope.randomFile,"file_mime_type":'image/jpeg'},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){
				if(data.status == "SUCCESS"){
					$ionicLoading.hide();
					$scope.transactionid = data.transaction_id;
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Disbursement Submitted Successfully',
							template: 'Please reference this Disbursement number'+ " " + $scope.transactionid +" "+'for further communication.'
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.paymeValues={};
						$scope.floatlabel=false;
						$scope.floatlabel1=false;
						});
					}else{
							$cordovaDialogs.alert('Please reference this Disbursement number'+ " " + $scope.transactionid +" "+'for further communication.', 'Disbursement Submitted Successfully', 'OK')
							.then(function() {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.paymeValues={};
							$scope.floatlabel=false;
							$scope.floatlabel1=false;	
						});
						return false;
					}		
				}else if(data.status == "FAILED"){
					$ionicLoading.hide();
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: data.error_message
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.paymeValues={};
						$scope.floatlabel=false;
						$scope.floatlabel1=false;
						});
					}else{
						$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
						.then(function($setUntouched,$setPristine) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.paymeValues={};
						$scope.floatlabel=false;
						$scope.floatlabel1=false;
						
						});
						return false;
						}	
				}
			}).error(function(err){
			});
		}

	}

	 $scope.$on('$ionicView.beforeEnter', function () {
           $scope.goback();
     });

	$scope.goback=function(input)
	{
		$location.path("app/hsa");
	}
	
	
})
.controller('PayproviderCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$cordovaCamera,$ionicPopup,$filter) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.hsaaccId=$rootScope.hsaaccId;
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccno=$rootScope.hsaaccno;
	$scope.payprovierValues={selectPayee:'',patient_name:'',amount:'',TransDate:'',description:''};
	$scope.floatlabel=false;
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	$scope.TransDate="";
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
					maximumImagesCount: 5,
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
					
					
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc= imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
		.then(function(options) {
			if(options==1){
				var options = {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.CAMERA,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
			}else if(options==2){
				var options = {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
					targetWidth: 100,
					targetHeight: 100,
					popoverOptions: CameraPopoverOptions,
					saveToPhotoAlbum: false,
					correctOrientation:true
				};
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.imgSrc= imageData;
					$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
				}, function(err) {
				});
			}
		});
		return false;
		}
		
	}
	
	
	$scope.getTransDate=function(){
		var options = {
			date: new Date(),
			mode: 'date', // or 'time'
			minDate: new Date(),

		}
		$ionicPlatform.ready(function(){
			$cordovaDatePicker.show(options).then(function(date){
				var date1=date.toString();
				var dataas=date1.split(" ");
				var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
				var mon=""; 
				if(Month.indexOf(dataas[1]).toString().length==1)
				{
					mon="0"+Month.indexOf(dataas[1]);
				}
				else
				{
					mon = Month.indexOf(dataas[1]);
				}
				var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
				$scope.payprovierValues.TransDate=selectedDate;
			});
		})

	};
	
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
	}else{
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/bankdetails",{params:{'type':'hsa', 'acc_num':$scope.hsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.bank_details=data.bank_details;
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
	});
	}
	
	$http.get('  http://app.sterlinghsa.com/api/v1/accounts/categories',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.categories=data.categories;
	}).error(function(err){
	});
 
	$http.get(' http://app.sterlinghsa.com/api/v1/accounts/description',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.descriptions=data.description ;
	}).error(function(err){
	});
	
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/payeeslist',{params:{'acc_num':$scope.hsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		
		$scope.payee=data.payee ;
	}).error(function(err){
	});
	
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/balances",{params:{'type':'hsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.availablebalance=data.balances.BALANCE;
	}).error(function(err){

	});
	
	 
	$scope.submitValue=function()
	{
		if($scope.payprovierValues.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});
			}
		}else if($scope.date >= $scope.payprovierValues.TransDate){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please select future date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please select future date','Sorry','OK')
				.then(function() {
				});
			}
		}else if($scope.imgSrc==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});

			$http.post("http://app.sterlinghsa.com/api/v1/accounts/payprovider",{'hsa_acct_id':$scope.hsaaccId,'vendor_id':$scope.payprovierValues.selectPayee.VENDOR_ID,'amount':$scope.payprovierValues.amount,'patient_name':$scope.payprovierValues.patient_name,'trans_date':$scope.payprovierValues.TransDate,"receipt":$scope.imgSrc,"file_name":$scope.randomFile,"file_mime_type":'image/jpeg'},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){

				if(data.status == "SUCCESS")
				{
					$ionicLoading.hide();
					$scope.transactionid = data.transaction_id;
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Submitted Successfully',
							template: 'Your Tansaction ID '+ "--->" + $scope.transactionid
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.payprovierValues={};
						$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert('Your Tansaction ID '+ "--->" + $scope.transactionid , 'Submitted successsfully', 'OK')
						.then(function() {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.payprovierValues={};
							$scope.floatlabel=false;
						});
						return false;

					}	
					
				}else if(data.status == "FAILED"){
					$ionicLoading.hide();
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: data.error_message
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.payprovierValues={};
							$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
					.then(function() {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.payprovierValues={};
							$scope.floatlabel=false;
						});
						return false;
					}	
					
				}
			}).error(function(err){
			});
		}

	}
	$scope.goback=function()
	{
		$rootScope.hidecontent=true;
		$location.path("app/hsa");
	}
	
})
.controller('TaxyearCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,	$rootScope,$sce,$cordovaFileOpener2,$cordovaFileTransfer,$ionicPopup,$cordovaFile) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	if($cordovaNetwork.isOffline())
    {
     $ionicLoading.hide();
	 if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
		}
    }
	else
	{
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/taxstatement",{params:{'acct_id':$rootScope.hsaaccId},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.      access_token} } )
	.success(function(data){
		$ionicLoading.hide();
		$scope.tax_statement_list = data.tax_statement_list;

	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
		}
	});
    }
	
	$scope.form1099=function(){
		if($rootScope.IOS==true){
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/taxstatementpdf',
				params:{acct_num:$rootScope.hsaaccno,type:'1099',tax_year:$scope.tax_statement_list[0].TAX_YEAR},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {
					'Content-type' : 'application/pdf',
					'Authorization':$scope.access_token
				},
				cache: true,
			}).success(function(data) {
				var blob = new Blob([data], { type: 'application/pdf' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = "1099.pdf";
				var contentFile = blob;
				//alert(cordova.file.dataDirectory);
				$cordovaFile.createDir(cordova.file.documentsDirectory, "Sterling", true)
				.then(function (success) {
					//alert(JSON.stringify(success));
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						//alert("writeFile"+JSON.stringify(success));
						/*$cordovaFileOpener2.open(success.target.localURL,'application/pdf')
						.then(function(){alert("open")},function(err){
							//alert("Error");
							//alert(JSON.stringify(err));
						})*/
						
						var alertPopup = $ionicPopup.alert({
							title: 'Success',
							template: 'Form 1099-SA download successsfully'
						});
						alertPopup.then(function(res) {});
						
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}else{
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/taxstatementpdf',
				params:{acct_num:$rootScope.hsaaccno,type:'1099',tax_year:$scope.tax_statement_list[0].TAX_YEAR},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {
					'Content-type' : 'application/pdf',
					'Authorization':$scope.access_token
				},
				cache: true,
			}).success(function(data) {
				var blob = new Blob([data], { type: 'application/pdf' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = "1099.pdf";
				var contentFile = blob;
				$cordovaFile.createDir(cordova.file.externalRootDirectory, "Sterling Administration", true)
				.then(function (success) {
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						$cordovaFileOpener2.open(success.target.localURL,'application/pdf')
						.then(function(){},function(err){})
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}
	}
	
	$scope.form5498=function(){
		if($rootScope.IOS==true){
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/taxstatementpdf',
				params:{acct_num:$rootScope.hsaaccno,type:'5498',tax_year:$scope.tax_statement_list[0].TAX_YEAR},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {
					'Content-type' : 'application/pdf',
					'Authorization':$scope.access_token
				},
				cache: true,
			}).success(function(data) {
				var blob = new Blob([data], { type: 'application/pdf' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = "5498.pdf";
				var contentFile = blob;
				//alert(cordova.file.dataDirectory);
				$cordovaFile.createDir(cordova.file.documentsDirectory, "Sterling", true)
				.then(function (success) {
					//alert(JSON.stringify(success));
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						//alert("writeFile"+JSON.stringify(success));
						/*$cordovaFileOpener2.open(success.target.localURL,'application/pdf')
						.then(function(){alert("open")},function(err){
							//alert("Error");
							//alert(JSON.stringify(err));
						})*/
						
						var alertPopup = $ionicPopup.alert({
							title: 'Success',
							template: 'Form 5498-SA download successsfully'
						});
						alertPopup.then(function(res) {});
						
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}else{
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/taxstatementpdf',
				params:{acct_num:$rootScope.hsaaccno,type:'5498',tax_year:$scope.tax_statement_list[0].TAX_YEAR},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {
					'Content-type' : 'application/pdf',
					'Authorization':$scope.access_token
				},
				cache: true,
			}).success(function(data) {
				var blob = new Blob([data], { type: 'application/pdf' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = "5498.pdf";
				var contentFile = blob;
				$cordovaFile.createDir(cordova.file.externalRootDirectory, "Sterling Administration", true)
				.then(function (success) {
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						$cordovaFileOpener2.open(success.target.localURL,'application/pdf')
						.then(function(){},function(err){})
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}
	}

	$scope.goback=function()
	{
		$rootScope.hidecontent=true;
		$location.path("app/hsa");
	}
})
.controller('HsastatementCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.date=$scope.activity;
	$scope.summary= $rootScope.summary_list;
	$scope.activity_list=$rootScope.activity_list;

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("/activitystmnt")
	}

})
.controller('activityContributionyCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');

	$scope.goback=function()
	{
		$location.path("activity");
	}
	
})
.controller('DisbursementCtrl', function($rootScope,$scope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.goback=function()
	{
		$location.path("activity");
	}
	
})
.controller('ScheduledcontributeCtrl', function($scope,$ionicHistory,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/schedule",{params:{'acct_id':$scope.hsaaccId,'trans_type':'c'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){ 
	$ionicLoading.hide();
	if(data.schedule_list!=null){
		$scope.schedule_list=data.schedule_list;

	}else{
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No Scheduledcontribution'
				});

				alertPopup.then(function(res) {
					$location.path("/activityContribution");
				});
		}else{
				$cordovaDialogs.confirm('No Scheduledcontribution', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					$location.path("/activityContribution");
				}
			});
		}
	}
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
		}
	});
 
	$scope.goback=function()
	{
		$location.path("/activityContribution")
	}
})

//FSA Starts//
.controller('FsaCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$ionicTabsDelegate,$ionicSideMenuDelegate,$ionicPopup) {
	localStorage.setItem("backCount","2");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json;  charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		localStorage.setItem('account_types',data.account_types.FSA);
		$rootScope.acctype=data.account_types;
		$scope.account_types=data.account_types.FSA;
		$rootScope.fsaaccno=data.account_types.FSA.ACCT_NUM;
		$rootScope.fsaaccId=data.account_types.FSA.ACCT_ID;
		$scope.debit();
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
			
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
		}
	});
	$scope.debit=function(){
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.fsaaccno,'trans_type':'d','plan_type':'fsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
				$scope.debit_card_list=data.debit_card_list[0];
				$rootScope.debit_card_transNo = $scope.debit_card_list.TRANSACTION_NUMBER;
				$rootScope.debit_card_amount = $scope.debit_card_list.AMOUNT;
		}).error(function(err){
			$ionicLoading.hide();
		});
	}
	
	$scope.goBack = function () {
		var selected = $ionicTabsDelegate.selectedIndex();
		if (selected != -1 && selected != 0) {
			$ionicTabsDelegate.select(selected - 1);
		}
	}
	$scope.goforward=function(){
		if($scope.acctype.HRA==null)
		{	   							 
			$location.path('/app/cobra');				  
		}
		else
		{
			$location.path('/app/hra');  
		}
	}
})
.controller('ContributionCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		window.history.back();
	}
})
.controller('MakeCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("/app/hsa");
	}
	
})
.controller('ActivityCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
		}
	}else{
		$http.get('  http://app.sterlinghsa.com/api/v1/accounts/categories',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
		.success(function(data){
		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/hsa");
	}
	
})
.controller('RecentCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
		}
	}else{
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id':$scope.hsaaccId,'trans_type':'c','plan_type':'hsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.transcation_list==null){
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'No RecentContribution'
					});

					alertPopup.then(function(res) {
						$location.path('/activityContribution');
					});
				}else{
					$cordovaDialogs.confirm('No RecentContribution', 'Sorry', 'ok')
						.then(function(buttonIndex) {
							if(buttonIndex=="1")
							{
								$location.path('/activityContribution');
							}
						}); 
				}
			
			}
			else{
				$scope.transcation_list=data.transcation_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("/activityContribution")
	}
	
})
.controller('RecentdisburseCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicPopup,$ionicLoading,$cordovaNetwork) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	if($cordovaNetwork.isOffline())
	{
	$ionicLoading.hide();
	if($rootScope.IOS==true){
		var alertPopup = $ionicPopup.alert({
			title: 'Sorry',
			template: 'Session expired, Please Login Again'
		});

		alertPopup.then(function(res) {
			localStorage.clear();
			window.location='login.html#/login';
		});
	}else{
		$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
		.then(function(buttonIndex) {
			if(buttonIndex=="1")
			{
				localStorage.clear();
				window.location='login.html#/login';
			}
		});
		return false;
	}
	}else{
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id':$scope.hsaaccId,'trans_type':'d','plan_type':'hsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$ionicLoading.hide();
		if(data.transcation_list==null){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No RecentDisbursement'
				});

				alertPopup.then(function(res) {
					$location.path('/disbursement');
				});
			}else{
				$cordovaDialogs.confirm('No RecentDisbursement', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/disbursement');
					}
			}); 
		}
			
		}
		else{
			$scope.transcation_list=data.transcation_list;
		}
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	});
	}
	
	$scope.goback=function()
	{
		$location.path("/disbursement")
	}
	
})
.controller('ScheduledDisbursementCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/schedule",{params:{'acct_id':$scope.hsaaccId,'trans_type':'d'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){ 
		$ionicLoading.hide();
		if(data.schedule_list==null){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No ScheduledDisbursement'
				});

				alertPopup.then(function(res) {
					$location.path('/disbursement');
				});
			}else{
				$cordovaDialogs.confirm('No ScheduledDisbursement', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					$location.path('/disbursement');
				}
			}); 
			}
			
		}
		else{
			$scope.schedule_list=data.schedule_list;
		}

	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}

	});

	$scope.goback=function()
	{
		$location.path("/disbursement")
	}
})
.controller('lastdisbursementCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}else{
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id':$scope.fsaaccId,'trans_type':'d','plan_type':'fsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.transcation_list==null){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No RecentDisbursement'
				});

				alertPopup.then(function(res) {
					$location.path('/fsacontribution');
				});
			}else{
				$cordovaDialogs.confirm('No RecentDisbursement', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/fsacontribution');
					}
				}); 
			}
				
			}
			else{
				$scope.transcation_list=data.transcation_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("app/fsa")
	}
	
})
.controller('lastcontributionCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}else{
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id':$scope.fsaaccId,'trans_type':'c','plan_type':'fsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.transcation_list==null){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No RecentContribution'
				});

				alertPopup.then(function(res) {
					$location.path('/fsacontribution');
				});
			}else{
				$cordovaDialogs.confirm('No RecentContribution', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/fsacontribution');
					}
				}); 
			}
				
			}
			else{
				$scope.transcation_list=data.transcation_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("app/fsa")
	}
	
})
.controller('fsacontributionCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa")
	}
	
})
.controller('InformationCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup,$ionicPopup) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.acc=$rootScope.fsaaccno;

	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Please Connect with internet'
			});

			alertPopup.then(function(res) {
			});
		}else{
			$cordovaDialogs.alert('Please Connect with internet', 'Sorry', 'ok')
			.then(function() {
			});
			return false;
		}
	}else{	 
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/accountinfo",{params:{'type':'fsa','acc_num':$scope.acc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){ 
			$scope.accnumber=data.account_information;
		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	 
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa");
	}

})
.controller('AvailablebalanceCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup) {
	$rootScope.hidecontent=true;
	$scope.fsaccno=$rootScope.fsaaccno;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Please Connect with internet'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Please Connect with internet', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}else{
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.fsaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$rootScope.available_balances = data.available_balances;
		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa")
	}
})
.controller('newclaimCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicScrollDelegate,$rootScope,$cordovaCamera,$ionicPopup,$filter) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
	$scope.hsaaccno=$rootScope.hsaaccno;
	$scope.fsaaccno=$rootScope.fsaaccno;
	$scope.fsaaccId=$rootScope.fsaaccId;
	$scope.plan_types=$rootScope.plan_types;
	$scope.newclaim_plantype=$rootScope.newclaim_plantype;
	$scope.newclaim_balance=$rootScope.newclaim_balance;
	$scope.newclaimvalues={taxid:'',amount:'',dependent:'',patient:'',Bankaccount:'',startTransDate:'',endTransDate:''};
	//$scope.imgSrc=[];
	//$scope.randomFile=[];
	$scope.floatlabel=false;
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	$ionicScrollDelegate.scrollBottom(true);
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}

	$scope.goback=function()
	{
		$scope.plan_types={};
		$location.path("new");
	}
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						 $scope.imgSrc=imageData;
						 $scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
					
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}
	}
	
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/payeeslist',{params:{'acc_num': $scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.payee=data.payee ;
	}).error(function(err){

	});
   
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/bankdetails",{params:{'type':'fsa', 'acc_num':$scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.bank_details=data.bank_details;
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	});
   
    $scope.getTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.newclaimvalues.startTransDate=selectedDate;

		});
	};
	$scope.EndgetTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.newclaimvalues.endTransDate=selectedDate;

		});
	};
	
	$scope.newclaimsubmit=function(){
		if($scope.newclaimvalues.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});
			}
		}
		else if($scope.newclaimvalues.startTransDate > $scope.newclaimvalues.endTransDate){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'End Date should not be less than start Date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('End Date should not be less than start Date')
				.then(function() {
				});
			}
		}
		else if($scope.newclaimvalues.endTransDate >$scope.date){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Cannot select future date in End date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Cannot select future date in End date')
				.then(function() {
				});
			}

		}else if(document.getElementsByName('imgValue').length==0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}
		else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});
			
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/newclaimrequest_base64",{'acct_num':  $scope.fsaaccno,
			'acct_id':$scope.fsaaccId,
			'bank_acct_id':$scope.newclaimvalues.Bankaccount.BANK_ACC_ID,
			'amount':$scope.newclaimvalues.amount,
			'service_start_date':$scope.newclaimvalues.startTransDate,
			'service_end_date':$scope.newclaimvalues.endTransDate,
			'patient_name':$scope.newclaimvalues.patient,
			'plan_type':$rootScope.planCode,
			'claim_method':'SUBSCRIBER_ONLINE_ACH',
			'vendor_id':'',
			'vendor_acc_num':'',
			'insurance_category':'',
			'description':$scope.newclaimvalues.description,
			'note':'Mobile',
			'memo':'',
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'
			},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){

			if(data.status == "SUCCESS"){
				$ionicLoading.hide();
				$scope.claim_id = data.claim_id;
				$location.path("/new");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Claim Submitted Successfully',
						template: 'Claim number is'+ " " + $scope.claim_id
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;
					});
				}else{
					$cordovaDialogs.alert('Claim number is'+ " " + $scope.claim_id, 'Claim Submitted Successfully', 'OK')
					.then(function() {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;
					});
					return false;
				}	
			}else if(data.status == "FAILED"){
				$ionicLoading.hide();
				$location.path("/new");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: data.error_message
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;	
					});
				}else{
					$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
					.then(function($setUntouched,$setPristine) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;		    
					});
					return false;
				}	
				
			}

			}).error(function(err){
			});
		}

	}
})
.controller('RecentdisCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		window.history.back();
	}
})
.controller('RecentcontributeCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","4");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		window.history.back();
	}
})

.controller('NewCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	localStorage.setItem("backCount","2");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.fsaaccId=$rootScope.fsaaccId;
	$scope.fsaccno=$rootScope.fsaaccno;
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.fsaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.available_balances = data.available_balances;
	})

	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/plan-type",{params:{'acct_id':$scope.fsaaccId},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		if(data.plan_types==null){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There is no plan-type for this user'
				});

				alertPopup.then(function(res) {
					$location.path('/app/fsa');
				});
			}else{
				$cordovaDialogs.alert('There is no plan-type for this user','Sorry','OK')
				.then(function() {
					$location.path('/app/fsa');
				});
			}
		}else{
			$scope.plan_types=data.plan_types;
		}
	}).error(function(err){
	});
 
	$scope.plan_type={};
	$scope.getClaimData=function(claim){
		for(var i=0;i<$scope.available_balances.length;i++){
			if($scope.available_balances[i].PLAN_TYPE==claim.LOOKUP_CODE){
				$rootScope.newclaim_balance =$scope.available_balances[i].BALANCE;
				$rootScope.newclaim_plantype=$scope.available_balances[i].PLAN_DESC;
			}
		}
		if(claim.MEANING === 'Dependent Care FSA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=true;
			$rootScope.taxcontent=true;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.MEANING === 'Transit FSA'){
			$rootScope.patientname=false;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.MEANING === 'Limited Purpose Healthcare FSA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.MEANING === 'HRACFC'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.MEANING === 'Healthcare FSA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.MEANING === 'HRAOHIOCHRIST'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.MEANING === 'Parking FSA'){
			$rootScope.patientname=false;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}
		$scope.plan_type={};

	}

	$scope.goback=function()
	{
		$location.path("app/fsa");
	}
})
.controller('FsapaymeCtrl', function($scope,$ionicPopup, $timeout ,$ionicModal,$location, $ionicHistory,$ionicSideMenuDelegate, $cordovaDialogs) {
	$scope.goback=function()
	{
		$location.path("app/fsa")
	}
})
.controller('fsapayproviderCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	localStorage.setItem("backCount","2");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.fsaaccId=$rootScope.fsaaccId;
	$scope.fsaccno=$rootScope.fsaaccno;
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.fsaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.available_balances = data.available_balances;
	})

	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/plan-type",{params:{'acct_id':$scope.fsaaccId},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		if(data.plan_types==null){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There is no plan-type for this user'
				});

				alertPopup.then(function(res) {
					$location.path('/app/fsa');
				});
			}else{
				$cordovaDialogs.alert('There is no plan-type for this user','Sorry','OK')
				.then(function() {
					$location.path('/app/fsa');
				});
			}
		}else{
			$rootScope.plan_types=data.plan_types;
		}
	}).error(function(err){
	});
  
	$scope.getClaimData=function(claim){
		for(var i=0;i<$scope.available_balances.length;i++){
			if($scope.available_balances[i].PLAN_TYPE==claim.LOOKUP_CODE){
				$rootScope.newclaim_balance =$scope.available_balances[i].BALANCE;
				$rootScope.newclaim_plantype=$scope.available_balances[i].PLAN_DESC;
			}
		}
		if(claim.MEANING === 'Dependent Care FSA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=true;
			$rootScope.taxcontent=true;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");

		}else if(claim.MEANING === 'Transit FSA'){
			$rootScope.patientname=false;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");

		}else if(claim.MEANING === 'Limited Purpose Healthcare FSA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.MEANING === 'HRACFC'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}else if(claim.MEANING === 'Healthcare FSA'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.MEANING === 'HRAOHIOCHRIST'){
			$rootScope.patientname=true;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/newclaim");
		}else if(claim.MEANING === 'Parking FSA'){
			$rootScope.patientname=false;
			$rootScope.dependentName=false;
			$rootScope.taxcontent=false;
			$rootScope.planCode=claim.LOOKUP_CODE;
			$location.path("/fsadependent");
		}
	}
	
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa");
	}
})
.controller('fsadependentCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicScrollDelegate,$rootScope,$cordovaCamera,$ionicPopup,$filter) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hsaaccId=$rootScope.hsaaccId;
    $scope.hsaaccno=$rootScope.hsaaccno;
	$scope.fsaaccno=$rootScope.fsaaccno;
	$scope.fsaaccId=$rootScope.fsaaccId;
	$scope.plan_types=$rootScope.plan_types;
	$scope.newclaim_plantype=$rootScope.newclaim_plantype;
	$scope.newclaim_balance=$rootScope.newclaim_balance;
    $scope.newclaimvalues={taxid:'',amount:'',dependent:'',patient:'',Bankaccount:'',startTransDate:'',endTransDate:''};
	//$scope.imgSrc=[];
	//$scope.randomFile=[];
	$scope.floatlabel=false;
	$scope.date = $filter('date')(new Date(),'MM/dd/yyyy');
	 $ionicScrollDelegate.scrollBottom(true);
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	
	$scope.goback=function()
	{
		$location.path("fsapayprovider");
	}
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});	
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}	
	}
	
	$scope.newclaimFsa=function(){
		if($scope.newclaimvalues.amount == 0){
			$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
			.then(function() {
			});
		}
		else if($scope.newclaimvalues.startTransDate > $scope.newclaimvalues.endTransDate){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'End Date should not be less than start Date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('End Date should not be less than start Date')
				.then(function() {
				});
			}
		}
		else if($scope.newclaimvalues.endTransDate >$scope.date){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Cannot select future date in End date'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Cannot select future date in End date')
				.then(function() {
				});
			}

		}else if(document.getElementsByName('imgValue').length==0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});

			$http.post("http://app.sterlinghsa.com/api/v1/accounts/newclaimrequest_base64",{'acct_num':  $scope.fsaaccno,
			'acct_id':$scope.fsaaccId,
			'bank_acct_id':'',
			'amount':$scope.newclaimvalues.amount,
			'service_start_date':$scope.newclaimvalues.startTransDate,
			'service_end_date':$scope.newclaimvalues.endTransDate,
			'patient_name':$scope.newclaimvalues.patient,
			'plan_type':$rootScope.planCode,
			'claim_method':'SUBSCRIBER_ONLINE_ACH',
			'vendor_id':$scope.newclaimvalues.selectpayee.VENDOR_ID,
			'vendor_acc_num':'',
			'insurance_category':'',
			'description':$scope.newclaimvalues.description,
			'note':'Mobile',
			'memo':'',
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){
			if(data.status == "SUCCESS"){
				$ionicLoading.hide();
				$scope.claim_id = data.claim_id;
				$location.path("/fsapayprovider");
				if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Claim Submitted Successfully',
							template: 'Claim number is'+ " " + $scope.claim_id
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.newclaimvalues={};
							$scope.floatlabel=false;
						});
				}else{
						$cordovaDialogs.alert('Claim number is'+ " " + $scope.claim_id, 'Claim Submitted Successfully', 'OK')
						.then(function() {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.newclaimvalues={};
							$scope.floatlabel=false;
						});
						return false;
				}	
			}else if(data.status == "FAILED"){
				$ionicLoading.hide();
				$location.path("/fsapayprovider");
				if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: data.error_message
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.newclaimvalues={};
							$scope.floatlabel=false;
						});
				}else{
					$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
					.then(function($setUntouched,$setPristine) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.newclaimvalues={};
						$scope.floatlabel=false;
					});
					return false;
				}	
			}
			}).error(function(err){
			})
		}
	}
    
   
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/payeeslist',{params:{'acc_num': $scope.fsaaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.payee=data.payee ;
	}).error(function(err){
	});
	
	$scope.getTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.newclaimvalues.startTransDate=selectedDate;

		});
	};
	$scope.EndgetTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.newclaimvalues.endTransDate=selectedDate;

		});
	};
})

.controller('HealthCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/hsa");
	}
})

.controller('fsacardclaimCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/fsa")
	}
	
})

.controller('fsacarddetailCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.fsaaccno=$rootScope.fsaaccno;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}else{ 
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.fsaaccno,'trans_type':'d','plan_type':'fsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.debit_card_list==null){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No debit card purchase Detail'
				});

				alertPopup.then(function(res) {
					$location.path('app/fsa');
				});
			}else{
				$cordovaDialogs.confirm('No debit card purchase Detail', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('app/fsa');
					}
				}); 
			}
				
			}
			else{
				$scope.debit_card_list=data.debit_card_list[0];
				$rootScope.debit_card_transNo = $scope.debit_card_list.TRANSACTION_NUMBER; 
				$rootScope.debit_card_amount = $scope.debit_card_list.AMOUNT;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("app/fsa")
	}
	
})

.controller('fsaclaimdetailCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$cordovaFile,$cordovaFileOpener2) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.trans_num=$rootScope.debit_card_transNo
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}else{
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/claimdetail",{params:{'trans_num':$scope.trans_num,'trans_type':'c','plan_type':'fsa'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.payment_information==null){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No Claim Detail'
				});

				alertPopup.then(function(res) {
					$location.path('/fsacardclaim');
				});
			}else{
				$cordovaDialogs.confirm('No Claim Detail', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/fsacardclaim');
					}
				}); 
			}
				
			}
			else{
				$scope.payment_information=data.payment_information[0];
				$scope.docs_list=data.docs_list;
				//alert("payment_information-"+JSON.stringify($scope.payment_information))
				//alert("docs_list-"+JSON.stringify($scope.docs_list))
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	
	$scope.getDocument=function(doc){
		if($rootScope.IOS==true){
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/downloadclaimdocument',
				params:{id:doc.ATTACHMENT_ID},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {'Authorization':$scope.access_token},
				cache: true,
			}).success(function(data) {
				var arrayBufferView = new Uint8Array(data);
				var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = doc.DOCUMENT_NAME;
				var contentFile = blob;
				//alert(cordova.file.dataDirectory);
				$cordovaFile.createDir(cordova.file.documentsDirectory, "Sterling Administration/Claim Docs", true)
				.then(function (success) {
					//alert(JSON.stringify(success));
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						var alertPopup = $ionicPopup.alert({
							title: 'Success',
							template: 'Document'+doc.DOCUMENT_NAME+'downloaded successsfully'
						});
						alertPopup.then(function(res) {});
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}else{
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/downloadclaimdocument',
				params:{id:doc.ATTACHMENT_ID},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {'Authorization':$scope.access_token},
				cache: true,
			}).success(function(data) {
				var arrayBufferView = new Uint8Array(data);
				var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = doc.DOCUMENT_NAME;
				var contentFile = blob;
				$cordovaFile.createDir(cordova.file.externalRootDirectory, "Sterling Administration/Claim Docs", true)
				.then(function (success) {
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						$cordovaFileOpener2.open(success.target.localURL,'image/png')
						.then(function(){},function(err){})
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}
	}
	
	$scope.goback=function()
	{
		$location.path("app/fsa")
	}
	
})

.controller('fsanewcardclaimCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicScrollDelegate,$rootScope,$cordovaCamera,$ionicPopup,$filter) {
	$rootScope.hidecontent=true;
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.trans_num=$rootScope.debit_card_transNo;
	$scope.debit_card_amount = $rootScope.debit_card_amount;
	$scope.imgSrc;
	$scope.floatlabel=false;
	
	$ionicScrollDelegate.scrollBottom(true);
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}

	$scope.goback=function()
	{
		$scope.plan_types={};
		$location.path("/fsacardclaim");
	}
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						 $scope.imgSrc=imageData;
						 $scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
					
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}
	}
	   
	$scope.newclaimsubmit=function(){
		if($scope.imgSrc==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else if($scope.trans_num==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: "You Can't upload any receipt"
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert("You Can't upload any receipt")
				.then(function() {
				});
			}
		}
		else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});
			
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/uploadclaimdocument",{'claim_id':  $scope.trans_num,
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'
			},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){

			if(data.status == "SUCCESS"){
				$ionicLoading.hide();
				$scope.claim_id = data.claim_id;
				$location.path("/fsacardclaim");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Success',
						template: 'Claim Submitted Successfully'
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;
					});
				}else{
					$cordovaDialogs.alert('Claim Submitted Successfully', 'Success', 'OK')
					.then(function() {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;
					});
					return false;
				}	
			}else if(data.status == "FAILED"){
				$ionicLoading.hide();
				$location.path("/fsacardclaim");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: data.error_message
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;	
					});
				}else{
					$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
					.then(function($setUntouched,$setPristine) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;		    
					});
					return false;
				}	
				
			}

			}).error(function(err){
			});
		}

	}
})

// Other Controllers
.controller('AppCtrl', function($scope,$ionicPopup, $timeout ,$ionicModal,$location,$cordovaDialogs, $rootScope,$http) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$rootScope.acctype=data.account_types;
		if($scope.acctype.HSA!=null)
		{
			$scope.hidehsa=true; 
			$scope.showHsamenu=true;
			$location.path('/app/hsa');
			$scope.homePath="#/app/hsa";
		}
		if($scope.acctype.FSA!=null){
			$scope.hidefsa=true;
			$scope.showFsamenu=true;
			$location.path('/app/fsa');
			$scope.homePath="#/app/fsa";
		}
		if($scope.acctype.COBRA!=null){
			$scope.hidecobra=true;
			$scope.showCobramenu=true;							 
			$location.path('/app/cobra');
			$scope.homePath="#/app/cobra";
		}
		if($scope.acctype.HRA!=null){
			$scope.hidehra=true;
			$scope.showHramenu=true;	
			$location.path('/app/hra');
			$scope.homePath="#/app/hra";
		}

	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	});
	
	$scope.hidefsa=false;
	$scope.hidehsa=false;
	$scope.hidecobra=false;
	$scope.hidehra=false;
	$scope.showCobramenu=false;
	$scope.showHramenu=false;
	$scope.showFsamenu=false;
	$scope.showHsamenu=false;
  
	$scope.exiqt = function() {

		var confirmPopup = $ionicPopup.confirm({
			title: 'Do you want to close',

			template: 'Are you sure',
			buttons : [{
				text : 'yes',
				type : 'button-positive button-outline',
			}, {
				text : 'No',
				type : 'button-positive button-outline',

			}]
		});

		confirmPopup.then(function(res) {
			if(res) {
				console.log('You are sure');
			} else {
				console.log('You are not sure');
			}
		});
	};
  
	$scope.exit=function()
	{
		$location.path("/login");	
	}
  
	$scope.toggleSomething = function(){
		$scope.isVisible = !$scope.isVisible;
		$scope.isVisible1=false;
		$scope.isHra=false;
		$scope.isCobra=false;
		console.log('make sure toggleSomething() is firing*');
	}

	$scope.toggleSomething1 = function(){
		$scope.isVisible1 = !$scope.isVisible1;
		$scope.isVisible=false;
		$scope.isHra=false;
		$scope.isCobra=false;
		console.log('make sure toggleSomething() is firing*');
	}
	$scope.toggleHra = function(){
		$scope.isHra = !$scope.isHra;
		$scope.isVisible=false;
		$scope.isVisible1=false;
		$scope.isCobra=false;
		console.log('make sure toggleSomething() is firing*');
	}
	$scope.toggleCobra = function(){
		$scope.isCobra = !$scope.isCobra;
		$scope.isVisible=false;
		$scope.isVisible1=false;
		$scope.isHra=false;
		console.log('make sure toggleSomething() is firing*');
	}

	$scope.logOut=function()
	{
		if($rootScope.IOS==true){
				var confirmPopup = $ionicPopup.confirm({
				title: 'Do you want to Logout',
				template: 'Are you sure',
				okText: 'No',
				cancelText: 'Yes',
			});
			confirmPopup.then(function(res) {
				if(res) {
					console.log('You are not sure');
				} else {
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
		}else{
			$cordovaDialogs.confirm('Do you want to Logout', 'Are you sure', ['Yes','No'])
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
				localStorage.clear();
				window.location='login.html#/login';
				}
				else{
				ionic.Platform.exitApp();
				}
			});
		}
	}
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		window.history.back();
	}

	$scope.show1 = false;
	$scope.show2 = false;
	$scope.click1 = function($event) { 
		$event.stopPropagation();
		$scope.show1 = !$scope.show1;
		$scope.show2 = false;
		$ionicListDelegate.closeOptionButtons(); 
	}
	
	$scope.hideAll = function() 
	{ 
		$scope.show2 = false;
		$scope.show1 = false;
		$scope.isVisible1=false;
		$scope.isVisible=false;
		$scope.isHra=false;
		$scope.isCobra=false;
		$ionicListDelegate.closeOptionButtons(); 
	}

})
.controller('HeaderCtrl', function($scope,$ionicPopup, $timeout ,$ionicModal,$location, $ionicHistory, $cordovaDialogs) {
	$scope.Logout=function()
	{
		$cordovaDialogs.confirm('Do you want to Logout', 'Are you sure', ['Yes','No'])
		.then(function(buttonIndex) {
			if(buttonIndex=="1")
			{
				localStorage.clear();
				$location.path("login.html#/login");
			}	  
		});
	}
	$scope.goBack = function()
	{
		if (localStorage.getItem("backCount")==1) {
			localStorage.setItem("backCount","0")
			$cordovaDialogs.confirm('Are You Sure', 'Do you Want to Close ', ['Yes','No'])
			.then(function(buttonIndex) {
				if (buttonIndex=='1') {
					ionic.Platform.exitApp();
				}
			});
		}else if(localStorage.getItem("backCount")==0){
			$cordovaDialogs.confirm('Are You Sure', 'Do you Want to Close ', ['Yes','No'])
			.then(function(buttonIndex) {
				if (buttonIndex=='1') {
					ionic.Platform.exitApp();
				}
			});
		}
		else if (localStorage.getItem("backCount")>1) 
		{
			var backcount=parseInt(localStorage.getItem("backCount"));
			var backcount=backcount-1;
			localStorage.setItem("backCount",backcount);
			window.history.back();
		}
	};
})

.controller('contactCtrl', function($scope,$location,$rootScope, $stateParams, $http) {
	localStorage.setItem("backCount","2");
	$rootScope.hidecontent=true;

	$scope.backcontrol=function()
	{
		$location.path("/app/hsa")
	}
	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("/app/hsa")
	}
})


// HRA contoller
.controller('HraCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$rootScope.hraaccno=data.account_types.HRA.ACCT_NUM; 
		$rootScope.hraaccId=data.account_types.HRA.ACCT_ID;
	}).error(function(err){

	});

	$scope.goBack=function(){
		$location.path("app/fsa");
	}
	
	$scope.goforward=function(){
		$location.path("app/cobra");
	}
})
.controller('HraacctCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraacc= $rootScope.hraaccno;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Please Connect with internet'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Please Connect with internet', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}
	else
	{	 
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/accountinfo",{params:{'type':'hra','acc_num':$scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){ 
			$scope.accnumber=data.account_information;
		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
})
.controller('HracontributionCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraid= $rootScope.hraaccId;

	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}
	else
	{
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id': $scope.hraid,'trans_type':'c','plan_type':'hra'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.transcation_list==null){
				$cordovaDialogs.confirm('No RecentContribution', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/fsacontribution');
					}
				}); 
			}
			else{
			$scope.transcation_list=data.transcation_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
	
	
})
.controller('HradisburseCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraid= $rootScope.hraaccId;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}
	else
	{
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-activity",{params:{'acct_id':$scope.hraid,'trans_type':'d','plan_type':'hra'},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.transcation_list==null)
			{
				$cordovaDialogs.confirm('No RecentDisbursement', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/fsacontribution');
					}
				}); 
			}
			else
			{
				$scope.transcation_list=data.transcation_list;
			}

		}).error(function(err){
				$ionicLoading.hide();
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: 'Session expired, Please Login Again'
					});

					alertPopup.then(function(res) {
						localStorage.clear();
						window.location='login.html#/login';
					});
				}else{
					$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
					.then(function(buttonIndex) {
						if(buttonIndex=="1")
						{
							localStorage.clear();
							window.location='login.html#/login';
						}
					});
					return false;
				}
		});
	}

	$scope.goback=function()
	{
		$location.path("app/hra")
	}
})
.controller('HranewclaimCtrl', function($scope,$location,$rootScope, $stateParams, $http) {
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
})
.controller('HrarecentCtrl', function($scope,$location,$rootScope, $stateParams, $http) {
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
})
.controller('HrapaymeCtrl', function($scope,$location,$rootScope,$ionicPopup,$cordovaDialogs,$stateParams, $http) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraid= $rootScope.hraaccId;
	$scope.hraacc= $rootScope.hraaccno;
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.available_balances = data.available_balances;
	})
	
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/plan-type",{params:{'acct_id':$scope.hraid},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		if(data.plan_types==null){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There is no plan-type for this user'
				});

				alertPopup.then(function(res) {
					$location.path('/app/hra');
				});
			}else{
				$cordovaDialogs.alert('There is no plan-type for this user','Sorry','OK')
				.then(function() {
					$location.path('/app/hra');
				});
			}
		}else{
			$scope.plan_types=data.plan_types;
		}
	}).error(function(err){
	});
	$scope.getClaimData=function(claim){
		for(var i=0;i<$scope.available_balances.length;i++){
			if($scope.available_balances[i].PLAN_TYPE==claim.LOOKUP_CODE){
				$rootScope.newclaim_balance =$scope.available_balances[i].BALANCE;
			}
		}
		if(claim.MEANING === 'HR4INDE'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAFirmenich'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAApportable'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAOHIOCHRIST'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAJNOLAN'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRACAREAL'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}
	}
	
	$scope.goback=function()
	{
		$location.path("/hranewclaim");
	}
})
.controller('HrapayproviderCtrl', function($scope,$location,$rootScope,$ionicPopup,$cordovaDialogs,$stateParams, $http) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraid= $rootScope.hraaccId;
	$scope.hraacc= $rootScope.hraaccno;
	
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$scope.available_balances = data.available_balances;
	})
	
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/plan-type",{params:{'acct_id':$scope.hraid},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		if(data.plan_types==null){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'There is no plan-type for this user'
				});

				alertPopup.then(function(res) {
					$location.path('/app/hra');
				});
			}else{
				$cordovaDialogs.alert('There is no plan-type for this user','Sorry','OK')
				.then(function() {
					$location.path('/app/hra');
				});
			}
		}else{
			$scope.plan_types=data.plan_types;
		}
	}).error(function(err){
	});
  
	$scope.plan_type="";
	$scope.getClaimData=function(claim){
		for(var i=0;i<$scope.available_balances.length;i++){
			if($scope.available_balances[i].PLAN_TYPE==claim.LOOKUP_CODE){
				$rootScope.newclaim_balance =$scope.available_balances[i].BALANCE;
			}
		}
		if(claim.MEANING === 'HR4INDE'){
			$location.path("/payprovideracoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAFirmenich'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAApportable'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAOHIOCHRIST'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRAJNOLAN'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}else if(claim.MEANING === 'HRACAREAL'){
			$location.path("/paymeacoinde");
			$rootScope.planCode=claim.LOOKUP_CODE;
		}
	}
	$scope.goback=function()
	{
		$location.path("/hranewclaim");
	}
	
})
.controller('HrabalCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$ionicPopup) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraacc= $rootScope.hraaccno;
	
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Please Connect with internet'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Please Connect with internet', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}else{
		$http.get("http://app.sterlinghsa.com/api/v1/accounts/availablebalances",{params:{ 'acct_num':$scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$rootScope.available_balances = data.available_balances;
		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res){
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
})
.controller('PaymeacoindeCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$cordovaCamera,$ionicPopup) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.newclaim_balance=$rootScope.newclaim_balance;
	$scope.hraacc= $rootScope.hraaccno;
	$scope.hsaaccno=$rootScope.hsaaccno;
	$scope.acoinde = {selectAccount:'',amount:'',description:'',startTransDate:'',endTransDate:''};
	//$scope.imgSrc=[];
	//$scope.randomFile=[];
	$scope.floatlabel=false;
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}
	}
		
	$http.get("http://app.sterlinghsa.com/api/v1/accounts/bankdetails",{params:{'type':'hra', 'acc_num':$scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		if(data.status=="FAILED"){
			$scope.msg=data.error_message;
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: $scope.msg
				});

				alertPopup.then(function(res){
				});
			}else{
				$cordovaDialogs.alert($scope.msg, 'Sorry', 'ok')
				.then(function() {
				});
				return false;
			}
			
		}
		$scope.bank_details=data.bank_details;
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res){
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
		}
	});
 
	$scope.getTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.acoinde.startTransDate=selectedDate;

		});
	};
	$scope.EndgetTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.acoinde.endTransDate=selectedDate;

		});
	};
 
	$scope.submitValues=function(){
		if($scope.acoinde.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res){
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});
			}
		}else if(document.getElementsByName('imgValue').length==0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else{
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/newclaimrequest_base64",{'acct_num':  $scope.fsaaccno,
			'acct_id':$scope.fsaaccId,
			'bank_acct_id':$scope.acoinde.Bankaccount.BANK_ACC_ID,
			'amount':$scope.acoinde.amount,
			'service_start_date':$scope.acoinde.startTransDate,
			'service_end_date':$scope.acoinde.endTransDate,
			'patient_name':'',
			'plan_type':$rootScope.planCode,
			'claim_method':'SUBSCRIBER_ONLINE_ACH',
			'vendor_id':'',
			'vendor_acc_num':'',
			'insurance_category':'',
			'description':$scope.acoinde.description,
			'note':'Mobile',
			'memo':'',
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){
				if(data.status == "SUCCESS"){
					$ionicLoading.hide();
					$scope.claim_id = data.claim_id;
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Claim Submitted Successfully',
							template: 'Claim number is'+ " " + $scope.claim_id
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.acoinde={};
							$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert('Claim number is'+ " " + $scope.claim_id, 'Claim Submitted Successfully', 'OK')
						.then(function() {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.acoinde={};
							$scope.floatlabel=false;
						});
						return false;
					}	
				}else if(data.status == "FAILED"){
					$ionicLoading.hide();
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: data.error_message
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.acoinde={};
							$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
						.then(function($setUntouched,$setPristine) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.acoinde={};
							$scope.floatlabel=false;
						});
						return false;
					}	
				}
			}).error(function(err){
			});
		}
	}
	$scope.goback=function()
	{
		$location.path("/hrapayme");
	}
	
})
.controller('PayprovideracoindeCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope,$cordovaCamera,$ionicPopup) {
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.newclaim_balance=$rootScope.newclaim_balance;
	$scope.hraacc= $rootScope.hraaccno;
	$scope.provideracoinde={selectpayee:'',amount:'',description:'',startTransDate:'',endTransDate:''};
	//$scope.imgSrc=[];
	//$scope.randomFile=[];
	$scope.floatlabel=false;
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}
	
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}
		
	}
	
	$scope.submitValues=function(){
		if($scope.provideracoinde.amount == 0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please enter the amount greater than 0'
				});

				alertPopup.then(function(res){
				});
			}else{
				$cordovaDialogs.alert('Please enter the amount greater than 0','Sorry','OK')
				.then(function() {
				});
			}
		}else if(document.getElementsByName('imgValue').length==0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else{
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/newclaimrequest_base64",{'acct_num': $scope.hraacc,
			'acct_id':$scope.fsaaccId,
			'bank_acct_id':'',
			'amount':$scope.provideracoinde.amount,
			'service_start_date':$scope.provideracoinde.startTransDate,
			'service_end_date':$scope.provideracoinde.endTransDate,
			'patient_name':$scope.provideracoinde.patient,
			'plan_type':$rootScope.planCode,
			'claim_method':'SUBSCRIBER_ONLINE_ACH',
			'vendor_id':$scope.provideracoinde.selectpayee.VENDOR_ID,
			'vendor_acc_num':'',
			'insurance_category':'',
			'description':$scope.provideracoinde.description,
			'note':'Mobile App',
			'memo':'',
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){
				if(data.status == "SUCCESS"){
					$ionicLoading.hide();
					$scope.claim_id = data.claim_id;
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Claim Submitted Successfully',
							template: 'Claim number is'+ " " + $scope.claim_id
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.provideracoinde={};
							$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert('Claim number is'+ " " + $scope.claim_id, 'Claim Submitted Successfully', 'OK')
						.then(function() {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.provideracoinde={};
							$scope.floatlabel=false;
						});
						return false;
					}	
				}else if(data.status == "FAILED"){
					$ionicLoading.hide();
					if($rootScope.IOS==true){
						var alertPopup = $ionicPopup.alert({
							title: 'Sorry',
							template: data.error_message
						});

						alertPopup.then(function(res) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.provideracoinde={};
							$scope.floatlabel=false;
						});
					}else{
						$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
						.then(function($setUntouched,$setPristine) {
							$scope.imgSrc= '';
							var myEl = angular.element( document.querySelector( '#receipt' ) );
							myEl.removeAttr('src');
							$scope.provideracoinde={};
							$scope.floatlabel=false;	    
						});
						return false;
					}	
				}
			}).error(function(err){
			});
		}
	}
 
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/payeeslist',{params:{'acc_num': $scope.hraacc},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$scope.payee=data.payee ;
	}).error(function(err){
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res){
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
		}
	});
 
	$scope.getTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.provideracoinde.startTransDate=selectedDate;
		});
	};
	$scope.EndgetTransDate=function(){
		var today = new Date();
		var _minDate = new Date();
		_minDate.setMonth(today.getMonth() -1000);
		var mindate = ionic.Platform.isIOS() ? new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay()) :
		(new Date(_minDate.getFullYear(), _minDate.getMonth(), _minDate.getDay())).valueOf();
		var maxDate = ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf();

		$cordovaDatePicker.show({date: today,minDate: mindate,maxDate: maxDate}).then
		(function(date)
		{
			var date1=date.toString();
			var dataas=date1.split(" ");
			var Month = ["App","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			var mon=""; 
			if(Month.indexOf(dataas[1]).toString().length==1)
			{
				mon="0"+Month.indexOf(dataas[1]);
			}
			else
			{
				mon = Month.indexOf(dataas[1]);
			}
			var selectedDate=mon+'/'+dataas[2]+'/'+dataas[3];
			$scope.provideracoinde.endTransDate=selectedDate;

		});
	};

	$scope.goback=function()
	{
		$location.path("/hrapayprovider");
	}

})


.controller('hracardclaimCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$rootScope) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","3");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');

	$scope.goback=function()
	{
		$rootScope.hidecontent=false;
		$location.path("app/hra")
	}
	
})

.controller('hracarddetailCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hraaccno=$rootScope.hraaccno;
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}else{ 
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/debitcardpurchase",{params:{'acct_num':$scope.hraaccno},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.debit_card_list==null){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No debit card purchase Detail'
				});

				alertPopup.then(function(res) {
					$location.path('app/hra');
				});
			}else{
				$cordovaDialogs.confirm('No debit card purchase Detail', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('app/hra');
					}
				}); 
			}
				
			}
			else{
				$scope.hra_debit_card_list=data.debit_card_list[0];
				$rootScope.hra_debit_card_transNo = $scope.hra_debit_card_list.TRANSACTION_NUMBER; 
				$rootScope.hra_debit_card_amount = $scope.hra_debit_card_list.AMOUNT;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
	
})

.controller('hraclaimdetailCtrl', function($scope,$rootScope,$cordovaNetwork,$ionicPlatform,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicPopup,$cordovaFile,$cordovaFileOpener2) {
	$rootScope.hidecontent=true;
	localStorage.setItem("backCount","5");
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hra_trans_num=$rootScope.hra_debit_card_transNo
	if($cordovaNetwork.isOffline())
	{
		$ionicLoading.hide();
		if($rootScope.IOS==true){
			var alertPopup = $ionicPopup.alert({
				title: 'Sorry',
				template: 'Session expired, Please Login Again'
			});

			alertPopup.then(function(res) {
				localStorage.clear();
				window.location='login.html#/login';
			});
		}else{
			$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
			.then(function(buttonIndex) {
				if(buttonIndex=="1")
				{
					localStorage.clear();
					window.location='login.html#/login';
				}
			});
			return false;
		}
	}else{
		$http.get(" http://app.sterlinghsa.com/api/v1/accounts/claimdetail",{params:{'trans_num':$scope.hra_trans_num},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
		.success(function(data){
			$ionicLoading.hide();
			if(data.payment_information==null){
				if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'No Claim Detail'
				});

				alertPopup.then(function(res) {
					$location.path('/hracardclaim');
				});
			}else{
				$cordovaDialogs.confirm('No Claim Detail', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/hracardclaim');
					}
				}); 
			}
				
			}
			else{
				$scope.hra_payment_information=data.payment_information[0];
				$scope.hra_docs_list=data.docs_list;
			}

		}).error(function(err){
			$ionicLoading.hide();
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res) {
					localStorage.clear();
					window.location='login.html#/login';
				});
			}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
			}
		});
	}
	
	$scope.getDocument=function(doc){
		if($rootScope.IOS==true){
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/downloadclaimdocument',
				params:{id:doc.ATTACHMENT_ID},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {'Authorization':$scope.access_token},
				cache: true,
			}).success(function(data) {
				var arrayBufferView = new Uint8Array(data);
				var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = doc.DOCUMENT_NAME;
				var contentFile = blob;
				//alert(cordova.file.dataDirectory);
				$cordovaFile.createDir(cordova.file.documentsDirectory, "Sterling Administration/Claim Docs", true)
				.then(function (success) {
					//alert(JSON.stringify(success));
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						var alertPopup = $ionicPopup.alert({
							title: 'Success',
							template: 'Document'+doc.DOCUMENT_NAME+'downloaded successsfully'
						});
						alertPopup.then(function(res) {});
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}else{
			$http({
				url : 'http://app.sterlinghsa.com/api/v1/accounts/downloadclaimdocument',
				params:{id:doc.ATTACHMENT_ID},
				method : 'GET',
				responseType : 'arraybuffer',
				headers: {'Authorization':$scope.access_token},
				cache: true,
			}).success(function(data) {
				var arrayBufferView = new Uint8Array(data);
				var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
				var fileURL = URL.createObjectURL(blob);
				var fileName = doc.DOCUMENT_NAME;
				var contentFile = blob;
				$cordovaFile.createDir(cordova.file.externalRootDirectory, "Sterling Administration/Claim Docs", true)
				.then(function (success) {
					$cordovaFile.writeFile(success.nativeURL, fileName,contentFile, true)
					.then(function (success) {
						$cordovaFileOpener2.open(success.target.localURL,'image/png')
						.then(function(){},function(err){})
						}, function (error){	
						});
				},function (error){
				});
			}).error(function(data){});
		}
	}
	
	$scope.goback=function()
	{
		$location.path("app/hra")
	}
	
})

.controller('hranewcardclaimCtrl', function($scope,$ionicPlatform,$cordovaNetwork,$cordovaDatePicker,$http,$location,$ionicModal,$cordovaDialogs,$ionicLoading,$cordovaNetwork,$ionicScrollDelegate,$rootScope,$cordovaCamera,$ionicPopup,$filter) {
	$rootScope.hidecontent=true;
	$scope.username = localStorage.getItem('username');
	$scope.access_token = localStorage.getItem('access_token');
	$scope.hra_trans_num=$rootScope.hra_debit_card_transNo;
	//alert($scope.hra_trans_num)
	$scope.hra_debit_card_amount = $rootScope.hra_debit_card_amount;
	$scope.imgSrc;
	$scope.floatlabel=false;
	
	$ionicScrollDelegate.scrollBottom(true);
	
	$scope.SelectFloat = function ()
	{ 
		$scope.floatlabel=true; 
	}

	$scope.goback=function()
	{
		$scope.plan_types={};
		$location.path("/fsacardclaim");
	}
	$scope.upload = function(){
		if($rootScope.IOS==true){
			var confirmPopup = $ionicPopup.confirm({
				title: 'Upload Receipt',
				template: 'Choose your option',
				okText: 'Gallery',
				cancelText: 'Camera',
			});
			confirmPopup.then(function(res) {
				if(res) {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						 $scope.imgSrc=imageData;
						 $scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
					
				} else {
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
		}else{
			$cordovaDialogs.confirm('Choose your option', 'Upload Receipt', ['Camera','Gallery'])
			.then(function(options) {
				if(options==1){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.CAMERA,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}else if(options==2){
					var options = {
						quality: 50,
						destinationType: Camera.DestinationType.DATA_URL,
						sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
						targetWidth: 100,
						targetHeight: 100,
						popoverOptions: CameraPopoverOptions,
						saveToPhotoAlbum: false,
						correctOrientation:true
					};
					$cordovaCamera.getPicture(options).then(function(imageData) {
						$scope.imgSrc=imageData;
						$scope.randomFile=Math.floor((Math.random() * 10000000000) + 1)+".jpg";
					}, function(err) {
					});
				}
			});
			return false;
		}
	}
	   
	$scope.newclaimsubmit=function(){
		if($scope.imgSrc==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Please upload one receipt'
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert('Please upload one receipt')
				.then(function() {
				});
			}

		}else if($scope.trans_num==undefined){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: "You Can't upload any receipt"
				});

				alertPopup.then(function(res) {
				});
			}else{
				$cordovaDialogs.alert("You Can't upload any receipt")
				.then(function() {
				});
			}
		}
		else{
			$ionicLoading.show({
			template: '<ion-spinner icon="ios"></ion-spinner><br>Loading...'
			});
			
			$http.post("http://app.sterlinghsa.com/api/v1/accounts/uploadclaimdocument",{'claim_id':  $scope.hra_trans_num,
			"receipt":$scope.imgSrc,
			"file_name":$scope.randomFile,
			"file_mime_type":'image/jpeg'
			},{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
			.success(function(data){

			if(data.status == "SUCCESS"){
				$ionicLoading.hide();
				$scope.claim_id = data.claim_id;
				$location.path("/hracardclaim");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Success',
						template: 'Claim Submitted Successfully'
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;
					});
				}else{
					$cordovaDialogs.alert('Claim Submitted Successfully', 'Success', 'OK')
					.then(function() {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;
					});
					return false;
				}	
			}else if(data.status == "FAILED"){
				$ionicLoading.hide();
				$location.path("/hracardclaim");
				if($rootScope.IOS==true){
					var alertPopup = $ionicPopup.alert({
						title: 'Sorry',
						template: data.error_message
					});

					alertPopup.then(function(res) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;	
					});
				}else{
					$cordovaDialogs.alert(data.error_message, 'Sorry', 'OK')
					.then(function($setUntouched,$setPristine) {
						$scope.imgSrc= '';
						var myEl = angular.element( document.querySelector( '#receipt' ) );
						myEl.removeAttr('src');
						$scope.floatlabel=false;		    
					});
					return false;
				}	
				
			}

			}).error(function(err){
			});
		}

	}
})

// Cobra controller
.controller('CobraCtrl', function($scope,$location,$rootScope, $stateParams, $http,$cordovaDialogs,$location) {
	$scope.access_token = localStorage.getItem('access_token');
	$http.get('http://app.sterlinghsa.com/api/v1/accounts/portfolio',{headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$rootScope.cobrassn=data.account_types.COBRA.SSN;
	}).error(function(err){
	});

	$scope.goBack=function(){
		if($scope.acctype.HRA==null)
		{	   							 
			$location.path('/app/fsa');				  
		}
		else
		{
			$location.path("/app/hra");
		}

	}
	
})
.controller('CobraaccountCtrl', function($scope,$location,$rootScope, $stateParams, $http,$ionicLoading,$cordovaDialogs,$ionicPopup) {
	$scope.access_token = localStorage.getItem('access_token');
	$scope.ssn=$rootScope.cobrassn;
	$http.get(' http://app.sterlinghsa.com/api/v1/accounts/accountinfo',{params:{'type':'cobra','ssn': $scope.ssn},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} })
	.success(function(data){
		$ionicLoading.hide();
		$scope.account_information=data.account_information;

	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res){
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
		}
	});
	
	$scope.goback=function()
	{
		$location.path('/app/cobra');
	}
	
})
.controller('CobraPaymentCtrl', function($scope,$location,$rootScope, $stateParams, $http,$ionicLoading,$cordovaDialogs,$location,$ionicPopup) {
	$scope.access_token = localStorage.getItem('access_token');
	$scope.ssn=$rootScope.cobrassn;
	$http.get(" http://app.sterlinghsa.com/api/v1/accounts/recent-cobra-payments",{params:{'ssn': $scope.ssn},headers: {'Content-Type':'application/json; charset=utf-8','Authorization':$scope.access_token} } )
	.success(function(data){
		$ionicLoading.hide();
		if(data.payment_information.length==0){
			if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Our record indicates that you do not have any COBRA payments'
				});

				alertPopup.then(function(res){
					$location.path('/app/cobra');
				});
			}else{
				$cordovaDialogs.confirm('Our record indicates that you do not have any COBRA payments', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						$location.path('/app/cobra');
					}
				}); 
			}
		}else{
			$scope.payment_information=data.payment_information;
		}
	}).error(function(err){
		$ionicLoading.hide();
		if($rootScope.IOS==true){
				var alertPopup = $ionicPopup.alert({
					title: 'Sorry',
					template: 'Session expired, Please Login Again'
				});

				alertPopup.then(function(res){
					localStorage.clear();
					window.location='login.html#/login';
				});
		}else{
				$cordovaDialogs.confirm('Session expired, Please Login Again', 'Sorry', 'ok')
				.then(function(buttonIndex) {
					if(buttonIndex=="1")
					{
						localStorage.clear();
						window.location='login.html#/login';
					}
				});
				return false;
		}
	});
	
	$scope.goback=function()
	{
		$location.path('/app/cobra');
	}
	
});
