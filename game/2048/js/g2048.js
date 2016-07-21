$(document).ready(function(){
    var game={
        /**
        *属性
        */
       //方块移动速度，单位毫秒
		speed : 200,
        //得分
        score : 0,
		//消灭的方块数
		die : 0,
		//是否开始
		nostart : true,
        
        
        /**
        *方法
        */
        //开始  kn=键盘编码
        start : function(kn){
            if(!(kn==37||kn==38||kn==39||kn==40)||game.nostart){
				return false;
			}else{
				$(".test").empty();
				game.mnc(kn);
			}
        },
        
        //开始时随机生成2个方块
        default : function(){
            game.addcube();
            game.addcube();
        },
        
        //添加方块
        addcube : function(){
            var rnd=game.rndcube();
            if(rnd){
                var cube="<div class='cube pos"+rnd+"'>2</div>";
                $(".box").prepend(cube);
            }
			game.state();
			//判断是否结束游戏
            game.end();
        },
        
        //随机位置,不能与已有方块重叠
        rndcube : function(){
            var cur=game.curcube();
            var arrk=game.blank(cur);
            //随机选择一个空位置
            var rnd=Math.floor(Math.random()*arrk.length);
            return arrk[rnd];
        },
        
        //当前不为空的位置编号集合
        curcube : function(){
            //当前方块节点
            var cur=$("div[class*='pos']");
            //获得当前所有不为空的位置编号
            var arr=new Array();
            for(var i=0; i<cur.length; i++){
                var j=i+1;
                var cl=$(".box div[class*='pos']:nth-child("+j+")").attr("class");
                cl=game.replace_c(cl);
                arr[i]=cl;
            }
            return arr;
        },
        
        //所有空位置编号
        blank : function(cur){
            //得到所有空位置编号
            var arrk=new Array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
            for(var j=0; j<cur.length; j++){
                for(var i=0; i<arrk.length; i++){
                    if(arrk[i]==cur[j]){
                        arrk.splice(i,1);
                    }
                }
            }
            return arrk;
        },
        
        //得到class里的编号
        replace_c : function(cl){
            var reg=new RegExp(".*pos([0-9]+).*");
            var num=cl.replace(reg,"$1")
            num=parseInt(num)
            return num;
        },
        
        //移动并合并方块
        mnc : function(kn){
			//获得空白位置和非空位置
			var cur=game.curcube();
            //对数组进行排序
            if(kn==37||kn==38){
                cur.sort(function(a,b){return a-b})
            }else{
                cur.sort(function(a,b){return b-a})
            }
//            alert(["9","3","6"].sort(function(a,b){return a<b}))
			var arrk=game.blank(cur);
//			alert(cur);
			//是否有可移动方块
			var moved=false;
			var last=false;
			//循环当前方块
			for(var i=0; i<cur.length; i++){
				//得到当前方块行列数
				var row=game.rc(cur[i])[0];
				var col=game.rc(cur[i])[1];
				//当前方块中的数字
				var number=game.num(cur[i]);
                
                var behind = game.behind(cur[i],kn,cur);
                var result = game.result(behind,number);
                var mlength=result[0];
                var combine=result[1];
                var last = i == cur.length-1 ? true : false;
                var moved = mlength>0 || moved ? true : false;
//                alert("数组："+behind+"\n结果"+result)
                game.move(cur[i],mlength,combine,last,moved,kn);
//                game.test(cur[i],mlength,combine,behind,moved);
			}

        },
        
        //从编号得到行数和列数
        rc : function(id){
            var arr=new Array();
            var row=Math.ceil(id/4);
            var col=id%4;
            col=col==0?4:col;
            arr[0]=row;
            arr[1]=col;
            return arr;
        },
		
		//从编号得到方块中的数字
		num : function(id){
			return parseInt($(".pos"+id).html());
		},
        
        //根据编号和方向判断前面的元素，返回数组
        behind : function(id,kn,cur){
            var row=game.rc(id)[0];
            var col=game.rc(id)[1];
            //将当前方块前面的方块内数字按顺序存入数组
            var arr=new Array();
            switch(kn){
                case 37:
                    var j=col-1;
                    for(var i=0; i<col; i++){
                        arr[j]=game.num(id-i)?game.num(id-i):0;
                        j--;
                    };
                    break;
                case 38:
                    var j=row-1;
                    for(var i=0; i<row; i++){
                        arr[j]=game.num(id-i*4)?game.num(id-i*4):0;
                        j--;
                    };
                    break;
                case 39:
                    var j=4-col;
                    for(var i=0; i<5-col; i++){
                        arr[j]=game.num(id+i)?game.num(id+i):0;
                        j--;
                    };
                    break;
                case 40:
                    var j=4-row;
                    for(var i=0; i<5-row; i++){
                        arr[j]=game.num(id+i*4)?game.num(id+i*4):0;
                        j--;
                    };
                    break;
            }
            return arr;
        },
        
        //根据behind判断要移动的格数和是否合并
        result : function(behind,number){
            var arr=new Array();
            if(behind.length==1){
                arr[0]=0;
                arr[1]=false;
                return arr;
            };
            var count=0;       //统计移动次数
            var combine=false; //是否合并
			var cb=0;          //当前之前合并次数
            for(var i=0; i<behind.length-1; i++){
                var one=behind[i];
                var two=behind[i+1];
                if(one==0){
                    behind=game.del(behind,i);
					i = count>0 && cb>0 ? i-1 : -1;
                    count++;
                }else if(one==two){
                    count++;
					cb++;
                    i++;
                    if(i==behind.length-1){
                        combine=true;
                    }
                }
            }
            arr[0]=count;
            arr[1]=combine;
            return arr;
        },
            
        //从数组中删除第下标为m-n的元素
        del : function(arr,m){
            if(m<0) return arr;
            return arr.slice(0,m).concat(arr.slice(m+1,arr.length));
        },
        
        //移动  cid=1~16位置编号,last是否最后一次,moved是否移动了方块
        move : function(cid,mlength,combine,last,moved,kn){
            //移动距离，单位像素
			var long=mlength*85;
            //移动后的位置编号
            var afid=0;
            switch(kn){
                case 37:
                    afid=parseInt(cid-mlength);
                    $(".pos"+cid).animate(
                        {left :"-="+long+"px"},
                        game.speed,
                        function(){
                            $(this).removeClass("pos"+cid).addClass("pos"+afid).removeAttr("style");
                            if(combine){
                                game.combine(afid);
                            }
                            if(last&&moved){
                                game.addcube();
                            }
                        }
                    );
                    break;
                case 38:
                    afid=parseInt(cid-(mlength*4));
                    $(".pos"+cid).animate(
                        {top :"-="+long+"px"},
                        game.speed,
                        function(){
                            $(this).removeClass("pos"+cid).addClass("pos"+afid).removeAttr("style");
                            if(combine){
                                game.combine(afid);
                            }
                            if(last&&moved){
                                game.addcube();
                            }
                        }
                    );
                    break;
                case 39:
                    afid=parseInt(cid+mlength);
                    $(".pos"+cid).animate(
                        {left :"+="+long+"px"},
                        game.speed,
                        function(){
                            $(this).removeClass("pos"+cid).addClass("pos"+afid).removeAttr("style");
                            if(combine){
                                game.combine(afid);
                            }
                            if(last&&moved){
                                game.addcube();
                            }
                        }
                    );
                    break;
                case 40:
                    afid=parseInt(cid+(mlength*4));
                    $(".pos"+cid).animate(
                        {top :"+="+long+"px"},
                        game.speed,
                        function(){
                            $(this).removeClass("pos"+cid).addClass("pos"+afid).removeAttr("style");
                            if(combine){
                                game.combine(afid);
                            }
                            if(last&&moved){
                                game.addcube();
                            }
                        }
                    );
                    break;
            };
        },
		
		//合并方块
		combine : function(id){
			if($(".pos"+id).length>1){$(".pos"+id+":first").remove()}
			var num=$(".pos"+id).html();
			num=parseInt(num);
			$(".pos"+id).html(num*2).addClass("num"+num*2).removeClass("num"+num);
			game.score+=num*2;
			game.die++;
		},
		
		//判断是否游戏结束
		end : function(){
			var cur=game.curcube();
			if(cur.length<16) return false;
			cur.sort(function(a,b){return a-b});
			var ending=true;
			for(var i=0; i<cur.length; i++){
				var number=game.num(cur[i]);
				var around=game.tblr(parseInt(cur[i]));
				for(var j=0; j<around.length; j++){
					if(number==around[j]) ending=false;
				}
			}
			if(ending){
				$(".endbox").fadeIn(500);
				$(".endscore").html(game.score);
                game.nostart=true;
			}
		},
		
		//根据方块位置得到上下左右方块的数字,返回数字集合
		tblr : function(id){
			var arr=new Array();
			var t = id-4, b = id+4, l = id%4==1 ? 0 : id-1, r = id%4==0? 0 : id+1;
//			var arr[0] = $(".pos"+t).length>0 ? $(".pos"+t).html() : 0;
//			var arr[0] = $(".pos"+b).length>0 ? $(".pos"+b)).html() : 0;
//			var arr[0] = $(".pos"+l).length>0 ? $(".pos"+l).html() : 0;
//			var arr[0] = $(".pos"+r).length>0 ? $(".pos"+r).html() :  0;
			if($(".pos"+t).length>0){arr[0]=$(".pos"+t).html()}else{arr[0]=0};
			if($(".pos"+b).length>0){arr[1]=$(".pos"+b).html()}else{arr[1]=0};
			if($(".pos"+l).length>0){arr[2]=$(".pos"+l).html()}else{arr[2]=0};
			if($(".pos"+r).length>0){arr[3]=$(".pos"+r).html()}else{arr[3]=0};
			return arr;
		},
		
		//状态
		state : function(){
			game.cnum();
			game.seescore();
			game.seedie();
//			$(".isend").html(game.end())
//			alert(game.end())
		},
        //显示方块总数
        cnum : function(){
            var num=$(".box .cube").length;
            $(".cnum").html(num);
        },
        //显示得分
        seescore : function(){
            $(".score").html(game.score);
        },
		//显示消灭方块数
		seedie : function(){
			$(".die").html(game.die);
		},
        //测试方块状态
        test : function(cid,mlength,combine,behind,moved){
		    var str="";
            str+="原始编号："+cid+"<br/>移动距离："+mlength+"<br/>是否合并："+combine+"<br/>所在数组："+behind+"<br/>是否移动："+moved+"<br/><br/>";
            $(".test").append(str);
        }
    };
    document.onkeydown=function(){
        if(!$(".cube").is(":animated")){
            game.start(keyUp())
//            $(".pos2,.pos15").html("4");
        }
    };
	
	//点击开始按钮
	$(".start").click(function(){
		game.nostart=false;
		$(".box .cube").remove();
		game.default();
	});
});


//加载事件
$(document).ready(function(){
	
	
});

 function keyUp(){
    if(navigator.appName == "Microsoft Internet Explorer"){
        var keycode = event.keyCode;
     }else{
         var keycode =  keyUp.caller.arguments[0].which;　     　　
    }
    return keycode;
}




