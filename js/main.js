$(function(){
	// 左側toolbox的開關
	$(".switch").on('click', function(){
		if(!$(this).parent('.toolbox').hasClass('open')){
			$(this).parent('.toolbox').addClass('open');
		}else{
			$(this).parent('.toolbox').removeClass('open');
		}
	});	
	//dynamic 設定一秒後出現刪除鈕 按其他地方就消失
	//點擊body關閉shake和刪除鈕
	$('body').on('click', function(evt){
		if(!$(evt.target).closest('.box').length) { //點擊處非box
			$('.box').each(function(){
				if($(this).hasClass('shake')){
					$(this).removeClass('shake');
					$(this).find('.delete').hide();
				}
			});
 		}
 		//左側toolbox按body也關閉
 		if(!$(evt.target).closest('.toolbox').length) {
 			if($('.toolbox').hasClass('open')){
 				$('.toolbox').removeClass('open');
 			}
 		}
 		if(!$(evt.target).closest('.more').length) {
 			$('.more').each(function(){
 				$(this).find('.menu').hide();
 				$(this).removeClass('open');
 			});
 		}
	});
	$(document).delegate('.more','click', function() {
		if($(this).hasClass('open')){
			$(this).find('.menu').hide();
			$(this).removeClass('open');
		}else{
			$(this).find('.menu').show();
			$(this).addClass('open');
		}
	});

	//dynamic出現的刪除鈕點擊刪除
	$(document).delegate('.delete','click', function() {
		$(this).parents('.box').remove();
	});

	//dynamic出現的edit按鈕
	function edithide(){
		$('.editbox .currenttype .type').val('');
		$('.editbox .title').val('');
		$('.black_cover').hide();
		$('.editbox').hide();
		thisbox = undefined;
	}

	var thisbox; //須要edit的box
	$(document).delegate('.edit','click', function() {
		thisbox = $(this).parents('.box');
		$('.black_cover').show();
		$('.editbox').show();
		$('.editbox').find('.title').val(thisbox.find('.title').text());
		$('.editbox').find('.width').val(thisbox.attr("class").substr(8));
		var type = thisbox.data("type");
		$('.editbox').find('.type').text(thisbox.attr("data-type"));
	});
	$('.black_cover').on('click', function() {
		edithide();
		optionhide();
	});
	$('.editbox .delete').on('click', function() {
		edithide();
		optionhide();
	});
	$('.editbox .cancelbtn').on('click', function() {
		edithide();
		optionhide();
	});
	//儲存
	$('.editbox .savebtn').on('click', function() {
		thisbox.find('.title').text($('.editbox .title').val());
		var type = $('.type').text();
		var num = thisbox.find('.c3').attr('id').slice(6); //應該要從資料庫來撈值
		var DataSource = $('.source').val();
		var w = $('.width').val();
		thisbox.removeAttr('class');
		thisbox.addClass('box box-'+w);
		thisbox.attr("data-type",type);
		changechart(num, type, DataSource);
		edithide();
		optionhide();
	});	
	function optionhide(){
		$('.option').hide();
		$('.option').removeClass(' open');
		$('.arrow').removeClass(' open');
	}
	$('.currenttype').on('click', function() {
		if($('.option').hasClass('open')){
			optionhide();
		}else{
			$('.option').show();
			$('.option').addClass(' open');
			$('.arrow').addClass(' open');
		}
	});
	$('.option div').on('click', function() {
		var type = $(this).attr('class');
		$('.type').text(type);
		optionhide();
	});
	
});
