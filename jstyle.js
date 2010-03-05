/* JSTYLE - MIT License - (c) 2010 BeeBole.com  - rev 1.0 */
window.jstyle = (function(arg){
	var vars = {},
		agent = navigator.userAgent.toLowerCase(),
		browsers = {
			'mozilla':agent.indexOf('mozilla') > -1,
			'ie':agent.indexOf('msie') > -1,
			'Opera':agent.indexOf('opera') > -1,
			'webkit':agent.indexOf('webkit') > -1
		},
		json2css = function(json){
			var jstyle = this,
				parseJSON = function(sub){
				var a = [], 
					prop, subProp, 
					varCall = /(\$(\S+))/, varVal, vars = jstyle.vars;
				for(prop in sub){
					subProp = sub[prop];
					if(typeof subProp === 'object'){
						a.push(prop + '{' + parseJSON(subProp) + '}');
					}else{
						if((varCall).test(subProp)){
							varVal = vars[subProp.match(varCall)[2]];
							varVal = typeof varVal === 'function' ? varVal.call(jstyle, json) : varVal;
							if(subProp){
								subProp = subProp.replace(varCall, varVal);
							}
						}
						a.push(prop + ':' + subProp + ';');
					}
				}
				return a.join('');
			};
			return parseJSON(json);
		},
		add2head = function(node){
			document.getElementsByTagName('HEAD')[0].appendChild(node);
		},
		isArray = function(obj){
			return Object.prototype.toString.call( obj ) === "[object Array]";
		},
		rmNode = function(id){
			if(typeof id === 'undefined'){return;}
			node = typeof id === 'object' ? id : document.getElementById(id);
			if(node.tagName){
				node.parentNode.removeChild(node);
			}
		};
	
	return {
		css:'',
		browsers:browsers,
		json:{},
		styleNode:{},
		vars:{},
		addMethod:function(name, fn){
			this[name] = fn;
			return this;
		},
		addLink:function(href, id){
			rmNode(id);
			var link = document.createElement('LINK');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			id && (link.id = id);
			add2head(link);
			link.href = href;
			return this;
		},
		addStyle:function(rules){
			if(typeof rules === 'function'){ return rules.call(this); }
			rules && this.addRules(rules);
			var styleNode = this.styleNode;
			rmNode(styleNode);
			styleNode = document.createElement('STYLE');
			styleNode.setAttribute('type', 'text/css');
			add2head(styleNode);
			this.css = json2css.call(this, this.json);
			styleNode.styleSheet ?
				styleNode.styleSheet.cssText = this.css:
				styleNode.appendChild( document.createTextNode(this.css) );
			return this;
		},
		addRules:function(rules, ctxt){
			ctxt = ctxt || this.json;
			if(typeof rules === 'function'){ return rules.call(this); }
			var subRules;
			for(rule in rules){
				subRules = rules[rule];
				if(typeof subRules === 'object'){
					ctxt[rule] = ctxt[rule] || {};
					this.addRules(subRules, ctxt[rule]);
				}else{
					ctxt[rule] = rules[rule];
				}
			}
			return this;
		},
		removeRules:function(rules){
			if(typeof rules === 'function'){ return rules.call(this); }
			rules = isArray(rules) ? rules : [rules];
			var i = 0, ii = rules.length, rule;
			for(;i<ii;i++){
				rule = rules[i];
				this.json[rule] && delete this.json[rule];
			}
			return this;
		},
		setVars:function(varHash){
			for(v in varHash){
				if(this.vars[v]){
					alert('The name ' + v + ' is already in use(' + this.vars[v] + '), please choose another one');
					break;
				}else{
					this.vars[v] = varHash[v];
				}
			}
			return this;
		}
	};
})();