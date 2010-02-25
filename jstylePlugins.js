jstyle()

.addMethod('css2json', function(css){
	var css2 = css || this.css, 
		json = {},
		s, e, k, v, i, ii, props;
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
})

.addMethod('dom2css', function(id){
	id = id || domId;
	var styleNodes = id ? [document.getElementById(id)]:document.getElementsByTagName('STYLE'),
		i = 0, ii = styleNodes.length;
	for(;i < ii; i++){
		css += styleNodes[i].styleSheet ? styleNodes[i].styleSheet.cssText : styleNodes[i].innerHTML;
	}
	this.css = css;
	return this;
});