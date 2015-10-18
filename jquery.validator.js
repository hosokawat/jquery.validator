;
(function() {
    GroupValidator = (function() {
        return {
            extend: function(rule_name, func) {
                this[rule_name] = func;
            }
        };
    })();
    validator.extend('required', function(data) {
        return data.length > 0;
    });

    $.error_messsages = {};

    function first() {
        for (var key in this) {
            return this[key];
        }
    }

    var next_uid = (function() {
        var next_uid = 0;
        return function uid() {
            return next_uid++;
        };
    })();

    function rule_parse(rule_text) {
        var result = [];
        var split_comma = rule_text.split(/,/g);
        var rules = [];
        var shift = false;
        var param_pattern = /(.*)[\(\)](.*)/;
        var current_name = '';
        for (var i = 0; i < split_comma.length; i++) {
            if (param_pattern.test(split_comma[i])) {
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
            result.push(Rule(this, name, group, rules[key], priority, uid, group_key));
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
            group_key: group_key
        };
    }

    function validate(rule) {
        var result = run_validator.call(rule.input, rule.name, rule.params);
        if (!result) {
            return Error(rule.name, rule.input, rule.priority, rule.uid, rule.params,null);
        }
        return;
    }

    function run_validator(rule_name, params) {
        if (typeof validator[rule_name] == 'undefined') {
            console.error('validate rule ' + rule_name　 + ' is undefined');
            return true;
        }
        return validator[rule_name].apply(this, [$(this).val()].concat(params));
    }

    function group_validate(rules) {
        var inputs = {};
        var params = {};
        var rule_name = first.call(rules).name;
        var key;
        for (key in rules) {
            inputs[rules[key].group_key] = $(rules[key].input).val();
            params[rules[key].group_key] = rules[key].params;
        }

        var errors = [];
        if (!run_group_validator.call(this, rule_name, inputs, params)) {
            for (key in rules) {
                errors.push(Error(rule_name, rules[key].input, rules[key].priority, rules[key].uid, rules[key].params,rules[key].group_key));
            }
        }
        return errors;
    }

    function run_group_validator(rule_name, inputs, params) {
        if (typeof GroupValidator[rule_name] == 'undefined') {
            console.error('group validate rule ' + rule_name　 + ' is undefined');
            return true;
        }
        return GroupValidator[rule_name].call(this, inputs, params);
    }


    function create_error_message(rule_name, params, group_key) {
      var error_id = rule_name;
      if(group_key != null) {
        error_id = error_id + '.' + group_key;
      }
        if (typeof $.error_messsages[error_id] == 'undefined') {
            return '';
        }

        var message = $.error_messsages[error_id];
        for (var i = 0; i < params.length; i++) {
            var regExp = new RegExp('\\{' + i + '}', 'g');
            out = regExp;
            message = message.replace(regExp, params[i]);
        }

        return message;
    }

    function Error(rule_name, input, priority, uid, params,group_key) {
        return {
            rule_name: rule_name,
            input: input,
            priority: priority,
            uid: uid,
            message: create_error_message(rule_name, params, group_key)
        };
    }


    $.validator_default_options = {
        setup: function() {
        },
        success: function() {
        },
        fail: function() {
        },
        default_submit: true,
        manual_validate: function() {
        },
        message_class: 'validator_message',
        output_errors: function output_errors(output_error, errors,message_class) {
            for (var key in errors) {
                if($(this).data('validate-message-destination')) {
                output_error.call($($(this).data('validate-message-destination')), errors[key].message, errors[key],message_class);
                } else {
                output_error.call(this, errors[key].message, errors[key],message_class);

                }
                if($(this).data('validate-message-gate') != 'multi') {
                  break;
                }
            }
        },
        output_error: function output_error(message,error,message_class) {
            $(this).after("<p style='color:red' class='" + message_class + "'>" + message + "</p>");
        },
        finish: function() {
        }
    };
    $.fn.validator = function(_options) {
        options = $.extend({}, $.validator_default_options, _options);
        $(this).submit(function() {
            if ($.validator(this, options).length == 0 && options.default_submit) {
                return true;
            } else {
                return false;
            }
        });
    };
    $.validator = function(form, options) {
        return _validator.call(form, options);
    };

    function _validator(_options) {
        var options = $.extend({}, $.validator_default_options, _options);
        var form = this;
        options.setup.call(this, options);
        var group_validates = {};
        var errors = [];
        $(this).find('.' + options.message_class).remove();
        $(this).find('input').each(function() {

            var $input = $(this);
            var rules_text = $(this).data('validate-rules');
            if (typeof rules_text === 'undefined') return;
            var rules = rule_parse.call($input, rules_text);
            if (rules_text.split(',').indexOf('required') < 0 && $input.val().length === 0) {
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

        for (var key in group_validates) {
            errors = errors.concat(group_validate.call(form, group_validates[key]));
        }

        options.manual_validate.call(this, errors, options);
        var input_errors = {};
        errors = $.grep(errors, function(e) {
            return e;
        });

        $(errors).each(function() {
            if (typeof input_errors[this.uid] == 'undefined') {
                input_errors[this.uid] = [];
            }
            input_errors[this.uid][this.priority] = this;
        });
        for (var key in input_errors) {
            if (typeof input_errors[key] == 'undefined') {
                return;
            }
            options.output_errors.call(first.call(input_errors[key]).input, options.output_error, input_errors[key],options.message_class);
        }

        if (input_errors.length > 0) {
            options.fail.call(form, errors, options);
        } else {
            options.success.call(form, errors, options);
        }

        options.finish.call(form, errors, options);

        return errors;
    }

})();
