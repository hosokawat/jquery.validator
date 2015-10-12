;(function() {
  GroupValidator = (function(){
    return {
      extend:function(rule_name,func){
        this[rule_name] = func;
      }
      //func param elements[group_key],params[group_key]
    }
  })();

  GroupValidator.extend('test',function(datas,params){
    return false;
  })
	$.error_messsages = {
		'isLength': '長さー{0},{1}',
		'isEmail': 'メアドじゃないー',
    'test':'test!'
	};

	function first() {
		for (var key in this) {
			return this[key];
		}
	}

	var next_uid = (function() {
		var next_uid = 0;
		return function uid() {
			return next_uid++;
		}
	})();

	function rule_parse(rule_text) {
		var result = [];
		var split_comma = rule_text.split(/,/g)
		var rules = [];
		var shift = false;
		var param_pattern = /(.*)[\(\)](.*)/;
		var current_name = '';
		for (var i = 0; i < split_comma.length; i++) {
			if (param_pattern.test(split_comma[i])) {
				// include ( or )
				// shift前なら1がrule name それ以外なら2がrule name
				var matches = split_comma[i].match(param_pattern);

				if (shift) {
					var param = matches[1];
					rules[current_name].push(param);
					shift = false;
				} else {
					var rule = matches[1];
					var param = matches[2];
					rules[current_name = rule] = [param];
					shift = true;
				}
			} else {
				//shift前ならrule name それ以外なら current_nameのパラム
				if (shift) {
					rules[current_name].push(split_comma[i]);
				} else {
					current_name = split_comma[i];
					rules[current_name] = [];
				}
			}
		}

		var priority = 0;
		var uid = next_uid();
		for (var key in rules) {
			var name, group, group_key;
			if (/#/.test(key)) {
				var matches = key.match(/([^#]+)#([^\\.]+)(?:\.(.+))*/);
				name = matches[1];
				group = matches[2];
        group_key = matches[3];
			} else {
				name = key;
				group = null;
        group_key = null;
			}
			result.push(Rule(this, name, group, rules[key], priority, uid,group_key));
			priority++;
		}
		return result;
	}

	function Rule(input, name, group, params, priority, uid, group_key) {
		return {
			input: input,
			name: name,
			group: group,
			params: params,
			priority: priority,
			uid: uid,
      group_key:group_key
		};
	}

	function validate(rule) {
		var result = run_validator.call(rule.input, rule.name, rule.params);
		if (!result) {
			return Error(rule.name, rule.input, rule.priority, rule.uid, rule.params);
		}
		return;
	}

	function run_validator(rule_name, params) {
		if (typeof validator[rule_name] == 'undefined') {
			console.error('バリデートルール' + rule_name　 + 'は未定義です。')
			return true;
		}
		return validator[rule_name].apply(this, [$(this).val()].concat(params));
	}

	function group_validate(rules) {
    var inputs = {};
    var params = {};
    var rule_name = first.call(rules).name;
    for(var key in rules) {
      inputs[rules[key].group_key] = $(rules[key].input).val();
      params[rules[key].group_key] = rules[key].params;
    };
    console.log('a1');
    console.log(inputs);
    console.log(params);

    var errors = [];
    if(!run_group_validator.call(this, rule_name, inputs, params)) {
      for(var key in rules) {
        console.log('make error');

        console.log(rules[key]);
        errors.push(Error(rule_name, rules[key].input, rules[key].priority, rules[key].uid, rules[key].params));
      };
    }
    console.log('errors');
    console.log(errors);
    return errors;
	}

  function run_group_validator(rule_name, inputs ,params) {
    console.log(inputs);
    console.log(params);

		if (typeof GroupValidator[rule_name] == 'undefined') {
			console.error('バリデートルール' + rule_name　 + 'は未定義です。')
			return true;
		}
    console.log('結果:' + GroupValidator[rule_name].call(this, inputs, params))
		return GroupValidator[rule_name].call(this, inputs, params);
	}


	function create_error_message(rule_name, params) {
		if (typeof $.error_messsages[rule_name] == 'undefined') {
			console.error('エラーメッセージが未定義です')
			return ''
		}

    var message = $.error_messsages[rule_name]
    for(var i = 0 ; i < params.length ; i++) {
      var regExp = new RegExp('\\{'+ i + '}','g');
      out = regExp;
      message = message.replace(regExp,params[i]);
    }

		return message;
	}

	function Error(rule_name, input, priority, uid, params) {
		return {
			rule_name: rule_name,
			input: input,
			priority: priority,
			uid: uid,
			message: create_error_message(rule_name, params)
		};
	}


	$.validator_default_options = {
		setup: function() {    console.log('setup!');},
		success: function() {console.log('success!');},
		fail: function() {console.log('fail!');},
		manual_validate: function() {console.log('manual_validate!');},
    message_class:'validator_message',
		output_errors: function output_errors(output_error, errors) {
			for (var key in errors) {
				output_error.call(this, errors[key].message, errors[key]);
			}
		},
		output_error: function output_error(message) {
			$(this).after("<p style='color:red'>" + message + "</p>");
		},
		finish: function() {console.log('finish!');}
	}
	$.fn.validator = function(options) {
		$(this).submit(function() {
			$.validator(this, options);
		});
	}
	$.validator = function(form, options) {
		return _validator.call(form, options);
	}

	function _validator(_options) {
		// はじめに!
		//parse
		options = $.extend({}, $.validator_default_options, _options);
		form = this;
		options.setup.call(this, options);
		group_validates = {};
		errors = [];
    $(this).find('.' + options.message_class).remove();
		$(this).find('input').each(function() {

			$input = $(this);
			var rules_text = $(this).data('validate-rules');
			if (typeof rules_text == 'undefined') return;
			rules = rule_parse.call($input, rules_text);
			if (rules_text.split(',').indexOf('required') < 0 && $input.val().length == 0) {
				// 必須ではなく空になっていればバリデートしない
				return;
			}
			$(rules).each(function() {
				if (this.group) {
					var group_rule = this.group + '#' + this.name;
					if (typeof group_validates[group_rule] == 'undefined') {
						//グループのは後回し
						group_validates[group_rule] = [];
					}
					group_validates[group_rule].push(this);
				} else {
					errors.push(validate(this));
				}

			});

		});
		//group
		for(var key in group_validates) {
			errors = errors.concat(group_validate.call(form,group_validates[key]));
		};

		options.manual_validate.call(this,errors,options);
		input_errors = [];
		$(errors).each(function() {
			if (typeof input_errors[this.uid] == 'undefined') {
				input_errors[this.uid] = [];
			}
			input_errors[this.uid][this.priority] = this;
		});
		$(input_errors).each(function() {
			if (typeof this == 'undefined') {
				return
			}
			options.output_errors.call(first.call(this).input, options.output_error, this);
		})

		if (input_errors.length > 0) {
			options.fail.call(form, errors, options);
		} else {
			options.success.call(form, errors, options);
		}

		options.finish.call(form, errors, options);

		return errors;
	};

})();

$(function(){
  $('form').validator();
});
