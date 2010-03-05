jstyle.css2json = function(css){
	var css2 = css || this.css, 
		json = {},
		s, e, k, v, i, ii, props,
		clean = function(s){
			var t = s.replace(/^\s\s*/, ''),
				w = /\s/, 
				l = t.length;
			while(w.test(t.charAt(l--)));
			return t.slice(0, l + 1).replace(/\s*\n\s*/g, '').replace(/\t/g,'').replace(/\/\*[^\*]+\*\//m, '');
		};
	while(css2){
		s = css2.indexOf('{');
		e = css2.indexOf('}', s);
		if (s > -1 && e > -1){
			k = clean(css2.substr(0, s));
			v = clean(css2.substring(s + 1, e));
			css2 = css2.substr(e + 1);
			if(v){
				json[k] = {};
				v = v.split(/;/);
				i = 0; ii = v.length;
				for(;i<ii;i++){
					props = v[i].split(/:/);
					if(props[1]){
						json[k][clean(props[0])] = clean(props[1]);
					}
				}
			}
		}else{
			css2 = false;
		}
	};
	this.json = json;
	return this;
};

jstyle.dom2css = function(){
	var styleNodes = document.getElementsByTagName('STYLE'),
		i = 0, ii = styleNodes.length, css;
	do{
		css += styleNodes[i].styleSheet ? styleNodes[i].styleSheet.cssText : styleNodes[i].innerHTML;
	}while(++i < ii)
	this.css = css;
	return this;
};