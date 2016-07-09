$(function() {

	var id,
		baseTree = {
			"1000": {
				"1468028955456": {
					"name": "111111",
					"code": "1",
					"type": "1"
				},
				"1468028966102": {
					"name": "222222222",
					"code": "1",
					"type": "1"
				},
				"1468028969572": {
					"name": "11111111",
					"code": "1",
					"type": "2"
				},
				"1468028974779": {
					"name": "222222222",
					"code": "1",
					"type": "2"
				},
				"1468028985708": {
					"name": "1111111111",
					"code": "1",
					"type": "3"
				},
				"1468028990846": {
					"name": "222222",
					"code": "1",
					"type": "3"
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
		$checked,
		iRadio = 1,
		listID;

	var flags = {};

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
			update();
			if (match_d2_value()){
				renderAll(baseTree[listID]);
				this.close();
				set_d2_value(null);
			}
			return false;
		},
		cancel: function() {
			this.close();
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
		console.log(baseTree[listID])
	});

	//唤起弹层2
	$('#btnAddVideoList').on('click', function() {
		id = +new Date();
		d2.showModal();
	});

	//编辑
	$('.datas').on('click', '.edit', function() {
		var $li = $(this).parent('li'),
			_id = $li.data('id');
		id = _id;
		set_d2_value(baseTree[listID][id]);
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
			}
		}).showModal();
	});


	$('input[name="videoType"]').on('change', function() {
		iRadio = $(this).val();
	});

	function update() { //更新每一条li的数据
		$checked = $('input[name="videoType"]:checked');
		baseTree[listID][id] = {
			name: $name.val(),
			code: $code.val(),
			type: $checked.val()
		};
		iRadio = baseTree[listID][id].type;
	}

	//渲染前先清空flag
	function renderLi(obj, key) { // obj = baseTree[listID][id]
		var $li = $('<li data-id="' + key + '"><input type="button" class="del" value="删除" /><input type="button" class="edit" value="编辑" /><span title="' + obj.name + '" class="name">' + obj.name + '</span></li>');
		var title = $type.eq(obj.type - 1).parent().data('name');

		if (!flags[obj.type]) { //说明是第一次插入
			var $datas = $('.datas'),
				$area = $('<div class="area area' + obj.type + '">').appendTo($datas),
				$ul = $('<ul>').appendTo($area),
				$title = $('<h3>' + title + '</h3>').prependTo($area);

			flags[obj.type] = true;
		}
		$('.area' + obj.type).find('ul').append($li)
	}

	function renderAll(obj) { // obj = baseTree[listID]
		flags = {};
		$('.datas').empty();
		for (var key in obj) {
			renderLi(obj[key], key)
		}
	}

	//保存第二个弹层的数据

	function initData() {

		$checked = $('input[name="videoType"]:checked');

		function updateData() {
			//设置虚拟data
			baseTree[listID][id] = {
				name: $name.val(),
				code: $code.val(),
				type: $checked.val()
			};
			iRadio = baseTree[listID][id].type;
		}

		if (match_d2_value()) {
			if (!baseTree[listID][id]) { //如果baseTree[listID]里没有这个id，就新增，否则编辑
				updateData();
				// if (!oHave[iRadio]) { //第一次
				// 	var $item = $('<div class="item item'+ iRadio +'" data-type="'+ iRadio +'">').appendTo($('.datas'));
				// 	var $ul = $('<ul></ul>').appendTo($item);
				// 	var $h3 = $('<h3>'+ $checked.parent().data('name') +'</h3>').prependTo($item);
				// 	oHave[iRadio] = iRadio;
				// };
				// $('.item'+iRadio).find('ul').append('<li data-id="' + id + '"><input type="button" class="del" value="删除" /><input type="button" class="edit" value="编辑" /><span title="' + $name.val() + '" class="name">' + $name.val() + '</span></li>');
				var html = '<li data-id="' + id + '"><p>' + $checked.parent().data('name') + '</p><input type="button" class="del" value="删除" /><input type="button" class="edit" value="编辑" /><span title="' + $name.val() + '" class="name">' + $name.val() + '</span></li>';
				$('.datas').append(html)
			} else {
				updateData();
				var $li = $('li[data-id="' + id + '"]');
				$li.find('.name').text($name.val());
				$li.find('p').text($checked.parent().data('name'))
			}

			console.log(iRadio)

			return true;
		}

		return false;

	}


	//校验step2的value

	function match_d2_value() {
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

	function set_d2_value(data) {
		if (data) {
			$name.val(data.name);
			$code.val(data.code);
			$type.eq(data.type - 1).prop('checked', true);
		} else {
			$name.val('');
			$code.val('');
			$type.eq(0).prop('checked', true);
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