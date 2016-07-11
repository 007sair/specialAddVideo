$(function() {

	var baseTree = {
		"1000": {
			"1": [{
					"name": "顶部1",
					"code": "1",
					"type": "1"
				}
			],
			"2": [{
					"name": "标题1",
					"code": "1",
					"type": "2"
				}, {
					"name": "标题2",
					"code": "2",
					"type": "2"
				}
			],
			"3": [{
					"name": "底部1",
					"code": "1",
					"type": "3"
				}, {
					"name": "底部2",
					"code": "2",
					"type": "3"
				}
			]
		}
	};

	//dom var
	var $context = $('#d2'),
		$name = $context.find('#videoName'),
		$code = $context.find('#videoCode'),
		$type = $context.find('input[name="videoType"]'),
		$selector = $(".f-select"),
		$datas = $('.datas'),
		$typeTitle = $('.typeTittle');

	var	_id,
		_index = -1,
		_type = 1,
		_radio = 1,
		listID,
		max = $type.length,
		flags = {};

	//弹层1
	var d1 = dialog({
		id: 'd1',
		title: '添加视频 step1',
		width: 400,
		height: 400,
		okValue: '保存',
		ok: function() {
			this.close();
			addSort();
			showResult();
			return false;
		},
		cancel: function() {
			this.close();
			return false;
		},
		cancelDisplay: false,
		content: document.getElementById('d1')
	});

	var d2 = dialog({
		id: 'd2',
		title: '添加视频 step2',
		okValue: '保存',
		ok: function() {
			if (matchValue()){
				update();
				render(baseTree[listID]);
				this.close();
			}
			return false;
		},
		cancel: function() {
			this.close();
			return false;
		},
		onclose: function(){
			setValue(null);
		},
		cancelDisplay: false,
		content: document.getElementById('d2')
	});

	function update() {
		var data = {
			name: $name.val(),
			code: $code.val(),
			type: $('input[name="videoType"]:checked').val()
		};

		var obj = baseTree[listID];

		if (_index < 0) { //新增
			if (!isArray(obj[data.type])) {
				obj[data.type] = [];
			};
			data.id = 'id_' + (+new Date()); //和下面的一起放开使用
			obj[data.type].push(data);
			sort(obj[data.type], obj[data.type].length - 1)
		} else { //编辑
			data.id = _id; //需定义
			var lastIndex = ''; //被编辑的元素在更新数据后的位置
			if (+_type !== +_radio) { //是否有更新radio
				obj[_type].splice(_index, 1);
				obj[_radio].push(data);
				lastIndex = obj[_radio].length - 1;
			} else {
				obj[_radio][_index] = data;
				lastIndex = _index;
			}
			sort(obj[_radio], lastIndex)
		}
	}

	function sort(obj, index) { // obj = baseTree[listID][_radio]
		var selectValue = $selector.val();
		if (selectValue == 1) { //上移
			if (index == 0) {
				console.log('已经是第一个了')
			} else {
				swipe(obj, index, index - 1)
			}
		};
		if (selectValue == 2) { //下移
			if (index >= obj.length - 1) {
				console.log('已经是最后一个了')
			} else {
				swipe(obj, index, index + 1)
			}
		};
	}

	function addSort(){
		for(var key in baseTree[listID]){
			var arr = baseTree[listID][key];
			for (var i = 0; i < arr.length; i++) {
				arr[i].sort = i;
			};
		}
	}


	function render(obj) { // obj = baseTree[listID]
		//reset
		$datas.empty();
		flags = {};
		for (var key in obj) { // 1:{}, 2:{}, 3:{}
			var arr = obj[key],
				type = +key;

			var $area, $ul, $h3, sLi = '';

			if (!flags[type]) { //说明是第一次插入
				$area = $('<div class="area area' + type + '">'),
				$ul = $('<ul>').appendTo($area),
				$h3 = $('<h3>' + $typeTitle.eq(type - 1).data('name') + '</h3>').prependTo($area);

				flags[type] = true;
			}

			if (arr.length) {
				for (var i = 0; i < arr.length; i++) {
					arr[i].id = arr[i].id || '';
					sLi += '<li data-type="' + type + '" data-id="'+ arr[i].id +'"><input type="button" class="del" value="删除" /><input type="button" class="edit" value="编辑" /><span title="' + arr[i].name + '" class="name">' + arr[i].name + '</span></li>';
				};
				$ul.append(sLi);
				$area.appendTo($datas);
			}else{ //空数组时删除这个对象
				delete obj[key];
			}

		}
	}

	//校验step2的value
	function matchValue() {
		if ($name.val() === '') {
			alert('请填写视频名称')
			return false;
		};
		if ($code.val() === '') {
			alert('请填写视频代码')
			return false;
		};
		return true;
	}

	//设置step2的value
	function setValue(data) {
		if (data) {
			$name.val(data.name);
			$code.val(data.code);
			$type.eq(_type - 1).prop('checked', true);
		} else {
			$name.val('');
			$code.val('');
			$type.eq(0).prop('checked', true);
			$selector.val(0);
			_index = -1;
		}
	}

	function swipe(arr, index1, index2) {
		arr[index1] = arr.splice(index2, 1, arr[index1])[0];
		return arr;
	};

	function isArray(object) {
		return object && typeof object === 'object' &&
			typeof object.length === 'number' &&
			typeof object.splice === 'function' &&
			!(object.propertyIsEnumerable('length'));
	}

	//添加视频
	$('.btnAddVideo').on('click', function() {
		listID = $(this).data('listid');
		if ($.isEmptyObject(baseTree[listID])) {
			baseTree[listID] = {};
		}
		render(baseTree[listID]);
		d1.showModal();
	});

	//新增
	$('#btnAddVideoList').on('click', function() {
		d2.showModal();
	});

	//编辑
	$('.datas').on('click', '.edit', function() {
		var $li = $(this).parent('li');
		_type = $li.data('type');
		_index = $li.index();
		_id = $li.data('id');
		_radio = _type;
		setValue(baseTree[listID][_type][_index]);
		d2.showModal();
	});

	//删除
	$('.datas').on('click', '.del', function() {
		var $li = $(this).parent('li'),
			type = $li.data('type'),
			index = $li.index(),
			name = $(this).siblings('.name').text();
		dialog({
			title: '警告',
			width: 220,
			content: '确认要删除<b>' + name + '</b>吗？',
			ok: function() {
				baseTree[listID][type].splice(index, 1);
				render(baseTree[listID]);
			}
		}).showModal();
	});


	$('.f-radio').on('change', function() {
		_radio = $(this).val();
	});



	/**
	 * 下面所有代码只是为了展示最后的数据，实际项目请忽略
	 */
	function showResult() {
		$('#result').html(format(JSON.stringify(baseTree), false))
	}

	function format(txt, compress) { /* 格式化JSON源码(对象转换为JSON文本) */
		var indentChar = '    ';
		if (/^\s*$/.test(txt)) {
			alert('数据为空,无法格式化! ');
			return;
		}
		try {
			var data = eval('(' + txt + ')');
		} catch (e) {
			alert('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err');
			return;
		};
		var draw = [],
			last = false,
			This = this,
			line = compress ? '' : '\n',
			nodeCount = 0,
			maxDepth = 0;

		var notify = function(name, value, isLast, indent, formObj) {
			nodeCount++; /*节点计数*/
			for (var i = 0, tab = ''; i < indent; i++) tab += indentChar; /* 缩进HTML */
			tab = compress ? '' : tab; /*压缩模式忽略缩进*/
			maxDepth = ++indent; /*缩进递增并记录*/
			if (value && value.constructor == Array) { /*处理数组*/
				draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line); /*缩进'[' 然后换行*/
				for (var i = 0; i < value.length; i++)
					notify(i, value[i], i == value.length - 1, indent, false);
				draw.push(tab + ']' + (isLast ? line : (',' + line))); /*缩进']'换行,若非尾元素则添加逗号*/
			} else if (value && typeof value == 'object') { /*处理对象*/
				draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line); /*缩进'{' 然后换行*/
				var len = 0,
					i = 0;
				for (var key in value) len++;
				for (var key in value) notify(key, value[key], ++i == len, indent, true);
				draw.push(tab + '}' + (isLast ? line : (',' + line))); /*缩进'}'换行,若非尾元素则添加逗号*/
			} else {
				if (typeof value == 'string') value = '"' + value + '"';
				draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
			};
		};
		var isLast = true,
			indent = 0;
		notify('', data, isLast, indent, false);
		return draw.join('');
	}

})