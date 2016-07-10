$(function() {

	var id,
		baseTree = {
			"1000": {
				"1468028955456": {
					"name": "分类1",
					"code": "1",
					"type": "1",
					"index": 21
				},
				"1468028966102": {
					"name": "分类2",
					"code": "2",
					"type": "1",
					"index": 22
				},
				"1468028969572": {
					"name": "标题1",
					"code": "1",
					"type": "2",
					"index": 14
				},
				"1468028974779": {
					"name": "标题2",
					"code": "2",
					"type": "2",
					"index": 15
				},
				"1468028985708": {
					"name": "底部1",
					"code": "1",
					"type": "3",
					"index": 14
				},
				"1468028990846": {
					"name": "底部2",
					"code": "2",
					"type": "3",
					"index": 15
				},
				"1468073132243": {
					"name": "分类3",
					"code": "3",
					"type": "1",
					"index": 23
				}
			},
			"1001": {
				"1468029214695": {
					"name": "aaa",
					"code": "1",
					"type": "3"
				},
				"1468029220959": {
					"name": "bbb",
					"code": "1",
					"type": "2"
				}
			}
		};

	var $context = $('#d2'),
		$name = $context.find('#videoName'),
		$code = $context.find('#videoCode'),
		$type = $context.find('input[name="videoType"]'),
		$selector = $(".f-select"),
		$checked,
		iRadio = 1,
		listID,
		max = $type.length;

	var flags = {};
	var oIndexs = {};


	//弹层1
	var d1 = dialog({
		id: 'd1',
		title: '添加视频 step1',
		width: 400,
		height: 400,
		okValue: '保存',
		ok: function() {
			this.close();
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
				updateData();
				renderAll(baseTree[listID]);
				this.close();
				setValue(null);
			}
			return false;
		},
		cancel: function() {
			this.close();
			setValue(null);
			return false;
		},
		cancelDisplay: false,
		content: document.getElementById('d2')
	});

	//唤起弹层1
	$('.btnAddVideo').on('click', function() {
		listID = $(this).data('listid');
		if ($.isEmptyObject(baseTree[listID])) {
			baseTree[listID] = {};
		}
		renderAll(baseTree[listID])
		d1.showModal();
	});

	//新增
	$('#btnAddVideoList').on('click', function() {
		$('.f-li-select').hide();
		id = +new Date();
		baseTree[listID][id] = {};
		d2.showModal();
	});

	//编辑
	$('.datas').on('click', '.edit', function() {
		$('.f-li-select').show();
		var $li = $(this).parent('li');
		id = $li.data('id');
		setValue(baseTree[listID][id]);
		d2.showModal();
	});

	//删除
	$('.datas').on('click', '.del', function() {
		var $li = $(this).parent('li'),
			id = $li.data('id'),
			name = $(this).siblings('.name').text();
		dialog({
			title: '警告',
			width: 220,
			content: '确认要删除<b>' + name + '</b>吗？',
			ok: function() {
				$li.remove();
				delete baseTree[listID][id];
				renderAll(baseTree[listID]);
			}
		}).showModal();
	});


	$('input[name="videoType"]').on('change', function() {
		iRadio = $(this).val();
	});



	function renderLi(obj, key) { // obj = baseTree[listID][id]
		var $li = $('<li data-id="' + key + '" data-type="'+ obj.type +'" data-index="'+ obj.index +'"><input type="button" class="del" value="删除" /><input type="button" class="edit" value="编辑" /><span title="' + obj.name + '" class="name">' + obj.name + '</span></li>');
		var title = $type.eq(obj.type - 1).parent().data('name');

		if (!flags[obj.type]) { //说明是第一次插入
			var $datas = $('.datas'),
				$area = $('<div class="area area' + obj.type + '">').appendTo($datas),
				$ul = $('<ul>').appendTo($area),
				$title = $('<h3>' + title + '</h3>').prependTo($area);

			flags[obj.type] = true;
		}
		$('.area' + obj.type).find('ul').append($li);
	}

	function renderAll(obj) { // obj = baseTree[listID]
		//重置每种位置的下标 保证循环时都从0开始
		for (var i = 0; i < max; i++) {
			oIndexs[i + 1] = 0;
		};
		flags = {};	//重置是否第一次插入对象
		$('.datas').empty();
		for (var key in obj) {
			obj[key].index = oIndexs[obj[key].type]++;
			renderLi(obj[key], key)
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
			$type.eq(data.type - 1).prop('checked', true);
		} else {
			$name.val('');
			$code.val('');
			$type.eq(0).prop('checked', true);
			$selector.val(0)
		}
	}


	function updateData() { //更新一条li的数据
		$checked = $('input[name="videoType"]:checked');
		baseTree[listID][id] = {
			name: $name.val(),
			code: $code.val(),
			type: $checked.val(),
			index: baseTree[listID][id].index
		};
		iRadio = baseTree[listID][id].type;
		sortData(baseTree[listID][id])
	}


	//上下排序
	function sortData(obj){
		var curIndex = $selector.val();
		if (curIndex == 1) { //上移
			if (obj.index == 0) {
				console.log('已经是第一个了')
			} else {
				//将自己-1、找到上条数据，将其index+1，
				var prevID = findObj(baseTree[listID], obj.type, obj.index-1);
				var temp = $.extend(true, {}, baseTree[listID][prevID]);
				baseTree[listID][prevID] = obj;
				baseTree[listID][id] = temp;
			}
		};
		if (curIndex == 2) { //下移
			if (obj.index >= oIndexs[obj.type] - 1) { //oIndexs[obj.type]每一组的最大数
				console.log('已经是最后一个了')
			}else{
				//将自己-1、找到上条数据，将其index+1，
				var nextID = findObj(baseTree[listID], obj.type, obj.index+1);
				var temp = $.extend(true, {}, baseTree[listID][nextID]);
				baseTree[listID][nextID] = obj;
				baseTree[listID][id] = temp;
			}
		};
	}

	function findObj(objs, type, index) {
		for (var key in objs) {
			var obj = objs[key];
			if (obj.type == type && obj.index == index) {
				return key;
			};
		}
	}



	/**
	 * 下面所有代码只是为了展示最后的数据，实际应用可以去掉
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