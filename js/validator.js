/******************策略对象******************/
var strategies = {
	isNonEmpty: function(value, errMsg){
		if(value === ''){
			return errMsg;
		}
	},
	minLength: function(value, length, errMsg){
		if(value.length < length){
			return errMsg;
		}
	},
	isMobile: function(value, errMsg){
		if(!/(^1[3|5|6|7|8|9][0-9]{9}$)/.test(value)){
			return errMsg;
		}
	}
};
/******************验证类******************/
var Validator = function(){
	this.cache = [];//保存校验规则
};
Validator.prototype.add = function(ele, rules){
	var self = this;
	for( var i = 0, rule; rule = rules[ i++ ]; ){
		console.log(i);
		(function(rule,i){ 
			var strategyAry = rule.strategy.split(":");// 把strategy 和参数分开
			var errMsg = rule.errorMsg;
			self.cache.push(function(){// 把校验的步骤用空函数包装起来，并且放入cache
				console.log(i,rule);
				var strategy = strategyAry.shift();// 用户挑选的strategy
				strategyAry.unshift(ele.value);// 把input 的value 添加进参数列表
				strategyAry.push(errMsg);// 把errorMsg 添加进参数列表
				return strategies[strategy].apply(ele, strategyAry);
			});
		})(rule,i);
	}
};
Validator.prototype.start = function(){
	for(var i=0,validatorFunc; validatorFunc=this.cache[i++];){
		var msg = validatorFunc();// 开始校验，并取得校验后的返回信息
		if(msg){// 如果有确切的返回值，说明校验没有通过
			return msg;
		}
	}
};