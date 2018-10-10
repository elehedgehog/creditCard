//授权相关的单独放在一个js里面，只有部分需要的页面再使用，防止过多的配置太容易外露
var grantManager={
		//获取app本地通讯录信息
		listLocalContacts:function(){
			var u = navigator.userAgent;
			if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {			
				return androidGrantManager.listLocalContacts();					
			} else if (u.indexOf('iPhone') > -1) {
				iosGrantManager.uploadAddressBookBridge()
			} else {
				//非安卓和IOS的不处理
			}
			return null;
		},
		//对app进行授权
		getLocalContactsAuthority:function(){
			var u = navigator.userAgent;
			if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {			
				androidGrantManager.getLocalContactsAuthority();				
			} else if (u.indexOf('iPhone') > -1) {
				

			} else {
				//非安卓和IOS的不处理
			}
		},
		//判断app是否已经授权了
		checkLocalContactsAuthority:function(){
			try {
				var u = navigator.userAgent;
				if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {	
					return androidGrantManager.checkLocalContactsAuthority()					
				} else if (u.indexOf('iPhone') > -1) {
					

				} else {
					//非安卓和IOS的不处理
				}
			}catch (err) {
                //没有方法不处理,异常捕获不阻断页面其他js的正常使用
				  //var txt="There was an error on this page.\n\n";
				  ////txt+="Error description: " + err.message + "\n\n";
				  //txt+="Click OK to continue.\n\n";
				  
			}
			
			return 0;
		},
		//授权身份证
		checkIdCard:function(){
			try {
				var u = navigator.userAgent;
				if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {	
					return androidGrantManager.checkIdCard()					
				} else if (u.indexOf('iPhone') > -1) {
					return iosGrantManager.checkIdCard();
				} else {
					//非安卓和IOS的不处理
				}
			}catch (err) {
                //没有方法不处理,异常捕获不阻断页面其他js的正常使用
				  //var txt="There was an error on this page.\n\n";
				  //txt+="Error description: " + err.message + "\n\n";
				  //txt+="Click OK to continue.\n\n";
				 
			}
			
			return 0;
		},
		//综合联系人授权
		grantContact:function(){
			try {
				var u = navigator.userAgent;
				if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {	
					//1.判断是否授权(0授权、1授权)、2授权、3数据拉取
					if(contactList==null || contactList==""){
						androidGrantManager.getLocalContactsAuthority();
					}
					var isGrant=androidGrantManager.checkLocalContactsAuthority();
					if(isGrant == 1 || isGrant == "1" ){
						//拉取报告
						var list=androidGrantManager.listLocalContacts();
					}else{
						//授权，拉取数据
						androidGrantManager.getLocalContactsAuthority();
						var list=androidGrantManager.listLocalContacts();
					}
				} else if (u.indexOf('iPhone') > -1) {
					
				} else {
					//非安卓和IOS的不处理
				}
			}catch (err) {
				//没有方法不处理,异常捕获不阻断页面其他js的正常使用
				//var txt="There was an error on this page.\n\n";
				//txt+="Error description: " + err.message + "\n\n";
				//txt+="Click OK to continue.\n\n";
				
			}
			
			return 0;
		}
}
//调用安卓本地api相关的管理
var androidGrantManager={
		listLocalContacts:function(){
			try {
				//查询所有本地联系人，如需要授权返回""		
				var contactsJson=window.javaScriptFunction.uploadContactsBridge();
				if(contactsJson!=null && contactsJson!="" && JSON.stringify(contactsJson).length>5){
					contactList=contactsJson;
					return contactList;
				}else{
					return "";
				}
				//直接存入库
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
				  var txt="There was an error on this page.\n\n";
				  txt+="Error description: " + err.message + "\n\n";
				  txt+="Click OK to continue.\n\n";
				  
			}
			return null;
		},
		getLocalContactsAuthority:function(){
			try {
				//联系人授权
				window.javaScriptFunction.getLocalContactsAuthority();
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
			}
		},
		checkLocalContactsAuthority:function(){
			try {
				//检查联系人读取是否已经授权，1已经授权,0未授权
				return window.javaScriptFunction.checkLocalContactsAuthority();
			} catch (err) {
                 //没有方法不处理,异常捕获不阻断页面其他js的正常使用
				  var txt="There was an error on this page.\n\n";
				  txt+="Error description: " + err.message + "\n\n";
				  txt+="Click OK to continue.\n\n";
				  
			}
			return 0;
		},
		checkIdCard:function(){
			try {
				//通知进行身份证进行sdk
				return window.javaScriptFunction.checkIdCard();
			} catch (err) {
				//没有方法不处理,异常捕获不阻断页面其他js的正常使用
				var txt="There was an error on this page.\n\n";
				txt+="Error description: " + err.message + "\n\n";
				txt+="Click OK to continue.\n\n";
				
			}
			return 0;
		}
}
//设置一个全局变量，对页面有效的，方便IOS异步使用
var contactList=null;
//ios 授权项
var iosGrantManager={
		 /*这段代码是固定的，必须要放到js中*/
		setupWebViewJavascriptBridge:function (callback) {
		    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
		    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
		    window.WVJBCallbacks = [callback];
		    var WVJBIframe = document.createElement('iframe');
		    WVJBIframe.style.display = 'none';
		    WVJBIframe.src = 'https://__bridge_loaded__';
		    document.documentElement.appendChild(WVJBIframe);
		    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
		},
		//通知ios进行 手机通讯录拉取
		uploadAddressBookBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('uploadContactsBridge',
				         function callback(response) {
				           //回调
//						  alert(JSON.stringify(response))
					      contactList=response;
				         })

			   })
		},
		//友盟埋点
		mobClickEventBridge:function(eventId,eventName){
				var eventData={};
				eventData.eventId=eventId;
				eventData.eventName=eventName;
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('mobClickEventBridge',eventData,
				         function callback(response) {
				           //回调
						   ////alert(JSON.stringify(response))
				         })

			   })
		},
		//获取设备名称：getDeviceNameBridge
		getDeviceNameBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getDeviceNameBridge',
				         function callback(response) {
				           //回调
						   ////alert(JSON.stringify(response))
				         })

			   })
		},
		//iphone名称：getiPhoneNameBridge
		getiPhoneNameBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getiPhoneNameBridge',
				         function callback(response) {
				           //回调
						   ////alert(JSON.stringify(response))
				         })

			   })
		},
		//系统名字：getSystemNameBridge
		getSystemNameBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getSystemNameBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//系统版本：getSystemVersionBridge
		getSystemVersionBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getSystemVersionBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//wifi名称：getWifiNameBridge
		getWifiNameBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getWifiNameBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//wifiIP地址：getWifiIpBridge
		getWifiIpBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getWifiIpBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//网络类型：networkTypeBridge
		networkTypeBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('networkTypeBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//分辨率：getDeviceScaleBridge
		getDeviceScaleBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getDeviceScaleBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//idfa：getAdidBridge
		getAdidBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getAdidBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//运营商：getTelephonyCarrierBridge
		getTelephonyCarrierBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getTelephonyCarrierBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//是否越狱：isJailBreakBridge
		isJailBreakBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('isJailBreakBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//内存大小：getTotalMemorySizeBridge
		getTotalMemorySizeBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getTotalMemorySizeBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//可用磁盘大小：getAvailableDiskMemoryBridge
		getAvailableDiskMemoryBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getAvailableDiskMemoryBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//总磁盘大小：getTotalDiskMemoryBridge
		getTotalDiskMemoryBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getTotalDiskMemoryBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//总开机开机时间：getSystemUptimeBridge
		getSystemUptimeBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getSystemUptimeBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//设备类型：isSIMULATORBridge
		isSIMULATORBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('isSIMULATORBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//定位：getLocationBridge
		getLocationBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getLocationBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//设备分辨率：getDeviceScaleBridge
		getDeviceScaleBridge:function(){
			  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getDeviceScaleBridge',
				         function callback(response) {
				           //回调
						   //alert(JSON.stringify(response))
				         })

			   })
		},
		//身份证认证
		checkIdCard:function(){
			/*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
			iosManager.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('checkIdCard',
						function callback(response) {
						//回调
				})
				
			})
		}
}

export {grantManager} 

// var sex="boy";
// var echo=function(value){
// 　　console.log(value)
// }

// export {sex,echo} 