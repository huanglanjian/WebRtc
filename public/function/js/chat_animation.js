$(function(){
	var flag=0;
	$('#rightArrow').on("click",function(){
		if(flag==1){
			$("#floatchat").animate({right: '-19%'},300);
            $("#whiteboard").animate({width:'55%'},300);
			$(this).animate({right: '-5px'},300);
			$(this).css('background-position','-50px 0');
			flag=0;
		}else{
			$("#floatchat").animate({right: '1%',width:'18%'},300);
            $("#whiteboard").animate({width:'+38%'},300);
			$(this).animate({right: '0%'},300);
			$(this).css('background-position','0px 0');
			flag=1;
		}
	});

});
$(function(){
	var flag= 0;
	$('#leftArrow').on("click",function(){
		if(flag==1){
			$("#friend_file").animate({left: '-22%'},300);
			//$("#whiteboard").animate({width:'55%'},300);
			$(this).animate({left: '-5px'},300);
			//$(this).css('background-position','-50px 0');
			flag=0;
		}else{
			$("#friend_file").animate({left: '5%',width:'22%'},300);
			//$("#whiteboard").animate({width:'+38%'},300);
			$(this).animate({left: '0%'},300);
			//$(this).css('background-position','0px 0');
			flag=1;
		}
	});
});
$(function(){
    var flag= 0;
    $('#leftvideo').on("click",function(){
        if(flag==1){
            $("#sharevideo").animate({left: '-35%',height:"0"},300);
            //$("#whiteboard").animate({width:'55%'},300);
            $(this).animate({left: '-5px'},300);
            //$(this).css('background-position','-50px 0');
            flag=0;
        }else{
            $("#sharevideo").animate({left: '5%',width:'35%',height:"50%"},300);
            //$("#whiteboard").animate({width:'+38%'},300);
            $(this).animate({left: '0%'},300);
            //$(this).css('background-position','0px 0');
            flag=1;
        }
    });
});