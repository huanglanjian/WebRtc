$(function(){
	var flagfile = 0, flagvideo = 0, flagright = 0;
	$('#rightArrow').on("click",function(){//聊天区管理
		if(flagvideo==0&&flagfile==0){//其余两个未弹出
			if(flagright==1){
				$("#floatchat").animate({right: '-19%'},300);
				$("#whiteboard").animate({width:'92%'},300);
				$(this).animate({right: '-3px'},300);
				$(this).css('background-position','-50px 0');
				flagright=0;
			}else{
				$("#floatchat").animate({right: '1%',width:'18%'},300);
				$("#whiteboard").animate({width:'+75%'},300);
				$(this).animate({right: '-2%'},300);
				$(this).css('background-position','-15px 0');
				flagright=1;
			}
		}
		if(flagvideo==1){//视频区弹出
			if(flagright==1){
				$("#floatchat").animate({right: '-19%'},300);
				$("#whiteboard").animate({width:'58%'},300);
				$(this).animate({right: '-5px'},300);
				$(this).css('background-position','-50px 0');
				flagright=0;
			}else{
				$("#floatchat").animate({right: '1%',width:'18%'},300);
				$("#whiteboard").animate({width:'40%'},300);
				$(this).animate({right: '-2%'},300);
				$(this).css('background-position','-15px 0');
				flagright=1;
			}
		}
		if(flagvideo==0&&flagfile==1){//好友区弹出
			if(flagright==1){
				$("#floatchat").animate({right: '-19%'},300);
				$("#whiteboard").animate({width:'71%'},300);
				$(this).animate({right: '-5px'},300);
				$(this).css('background-position','-50px 0');
				flagright=0;
			}else{
				$("#floatchat").animate({right: '1%',width:'18%'},300);
				$("#whiteboard").animate({width:'53%'},300);
				$(this).animate({right: '-2%'},300);
				$(this).css('background-position','-15px 0');
				flagright=1;
			}
		}
	});
	$('#leftArrow').on("click",function(){//好友文件区管理
		if(flagvideo==0&&flagright==0){//其余两个未弹出
			if(flagfile==1){
				$("#friend_file").animate({left: '-22%'},300);
				$(".main_area").animate({"margin-left":"-38%"},300);
				$("#whiteboard").animate({width:'92%'},300);
				$(this).animate({left: '-5px'},300);
				flagfile=0;
			}else{
				$("#friend_file").animate({left: '5%',width:'21%'},300);
				$(".main_area").animate({"margin-left":"-16%"},300);
				$("#whiteboard").animate({width:'70%'},300);
				$(this).animate({left: '0%'},300);
				flagfile=1;
			}
		}
		if(flagvideo==1){//视频区弹出
			if(flagfile==1){
				$("#friend_file").animate({left: '-22%'},300);
				$(this).animate({left: '-5px'},300);
				flagfile=0;
			}else{
				$("#friend_file").animate({left: '5%',width:'21%'},300);
				$(this).animate({left: '0%'},300);
				flagfile=1;
			}
		}
		if(flagvideo==0&&flagright==1){//聊天区弹出
			if(flagfile==1){
				$("#friend_file").animate({left: '-22%'},300);
				$(".main_area").animate({"margin-left":"-38%"},300);
				$("#whiteboard").animate({width:'75%'},300);
				$(this).animate({left: '-5px'},300);
				flagfile=0;
			}else{
				$("#friend_file").animate({left: '5%',width:'21%'},300);
				$(".main_area").animate({"margin-left":"-16%"},300);
				$("#whiteboard").animate({width:'53%'},300);
				$(this).animate({left: '0%'},300);
				flagfile=1;
			}
		}
	});
	$('#leftvideo').on("click",function(){//视频区管理
		if(flagright==0&&flagfile==0){//其余两个未弹出
			if(flagvideo==1){
				$("#sharevideo").animate({left: '-34%',height:"0"},300);
				$(".main_area").animate({"margin-left":"-38%"},300);
				$("#whiteboard").animate({width:'92%'},300);
				$(this).animate({left: '-5px'},300);
				flagvideo=0;
			}else{
				$("#sharevideo").animate({left: '5%',width:'34%',height:"70%"},300);
				$(".main_area").animate({"margin-left":"-3%"},300);
				$("#whiteboard").animate({width:'57%'},300);
				$(this).animate({left: '0%'},300);
				flagvideo=1;
			}
		}
		if(flagright==0&&flagfile==1){//好友区弹出
			if(flagvideo==1){
				$("#sharevideo").animate({left: '-34%',height:"0"},300);
				$(".main_area").animate({"margin-left":"-16%"},300);
				$("#whiteboard").animate({width:'70%'},300);
				$(this).animate({left: '-5px'},300);
				flagvideo=0;
			}else{
				$("#sharevideo").animate({left: '5%',width:'34%',height:"70%"},300);
				$(".main_area").animate({"margin-left":"-3%"},300);
				$("#whiteboard").animate({width:'57%'},300);
				$(this).animate({left: '0%'},300);
				flagvideo=1;
			}
		}
		if(flagright==1&&flagfile==0){//聊天区弹出
			if(flagvideo==1){
				$("#sharevideo").animate({left: '-34%',height:"0"},300);
				$(".main_area").animate({"margin-left":"-38%"},300);
				$("#whiteboard").animate({width:'75%'},300);
				$(this).animate({left: '-5px'},300);
				flagvideo=0;
			}else{
				$("#sharevideo").animate({left: '5%',width:'34%',height:"70%"},300);
				$(".main_area").animate({"margin-left":"-3%"},300);
				$("#whiteboard").animate({width:'40%'},300);
				$(this).animate({left: '0%'},300);
				flagvideo=1;
			}
		}
		if(flagright==1&&flagfile==1){//两个都弹出
			if(flagvideo==1){
				$("#sharevideo").animate({left: '-34%',height:"0"},300);
				$(".main_area").animate({"margin-left":"-16%"},300);
				$("#whiteboard").animate({width:'53%'},300);
				$(this).animate({left: '-5px'},300);
				flagvideo=0;
			}else{
				$("#sharevideo").animate({left: '5%',width:'34%',height:"70%"},300);
				$(".main_area").animate({"margin-left":"-3%"},300);
				$("#whiteboard").animate({width:'40%'},300);
				$(this).animate({left: '0%'},300);
				flagvideo=1;
			}
		}
	});
});