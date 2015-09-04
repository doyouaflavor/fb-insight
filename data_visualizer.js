

arrStat=[];
var $g1=null;
$xscale=null;
$yscale=null;

data_visualize=function(data){

	//console.log(data);
	arrStat=data;

	

	padding={
		top:20,
		left:80,
		buttom:80,
		right:80
	};
	width=720;
	height=400;

	$xscale=d3.scale.ordinal()
		.domain(d3.range(arrStat.length))
		.rangePoints([padding.left,width-padding.right]);

	$yscale=d3.scale.linear()
		.domain([0,arrStat[arrStat.length-1].totalDist])
		.range([height-padding.buttom,padding.top]);

	/*
	str=$xscale(0)+","+$yscale(0);
	for (var i = 0; i < arrStat.length; i++) {
		str+=" "+$xscale(i)+","+$yscale(arrStat[i].totalDist);
	};
	*/

	$("#graph").append('<svg>');
	$svg=d3.select('#graph svg');
	$svg.attr('width',width).attr('height',height);
	$g1=$svg.append("g").attr('id','group1').selectAll('#group1');

	//畫軸
	d3.selectAll('#group1').append('line')
	.attr('x1',$xscale(0))
	.attr('y1',$yscale(0))
	.attr('x2',$xscale(arrStat.length-1))
	.attr('y2',$yscale(0));

	d3.selectAll('#group1').append('line')
	.attr('x1',$xscale(0))
	.attr('y1',$yscale(0))
	.attr('x2',$xscale(0))
	.attr('y2',$yscale(arrStat[arrStat.length-1].totalDist));


	//畫圖表的折線
	$svg.selectAll('#group1').data(arrStat).enter()
	.append('line')
	.attr('id',function(d,i){return 'line'+d.timeFrom})
	.attr('x1',function(d,i){return $xscale(i-1)})
	.attr('y1',function(d,i){return $yscale(d.lastDist)})
	.attr('x2',function(d,i){return $xscale(i)})
	.attr('y2',function(d,i){return $yscale(d.totalDist)});

	//畫達成目標的線
	for (var i = 0; i < arrStat.length; i++) {
		arcTar=arrStat[i].archiveTarget;
		if(arcTar.length>=1){
			for (var j = 0; j < arcTar.length; j++) {
				d3.selectAll('#group1').append('line')
				.attr('x1',$xscale(0))
				.attr('y1',$yscale(target[arcTar[j]]["dist"]))
				.attr('x2',$xscale(i-1)+($xscale(1)-$xscale(0))
					*($yscale(target[arcTar[j]]["dist"])-$yscale(arrStat[i].lastDist))
					/($yscale(arrStat[i].totalDist)-$yscale(arrStat[i].lastDist)))//
				.attr('y2',$yscale(target[arcTar[j]]["dist"]))
				.style('stroke-opacity',0.2);
				
				d3.selectAll('#group1').append('text').text(target[arcTar[j]]["to"])
				.attr('x',padding.left-14*target[arcTar[j]]["to"].length)
				.attr('y',$yscale(target[arcTar[j]]["dist"]));
			};
		};
	};

	//畫日期的線

	firstYear=parseInt(arrStat[0]['timeTag'].substr(0,4));
	currYear=parseInt(ad((new Date()).getYear()));

	console.log(firstYear);
	console.log(currYear);
	for (var i = 1; i <= currYear-firstYear; i++) {
		statObj=getStatObjFromDate((firstYear+i)+'/1/1');
		d3.selectAll('#group1').append('text')
		.text(statObj.timeTag.substr(0,5))
		.attr('transform','translate('
			+$xscale(arrStat.indexOf(statObj))
			+","
			+$yscale(0)
			+")rotate(45)");

		d3.selectAll('#group1').append('line')
		.attr('x1',$xscale(arrStat.indexOf(statObj)))
		.attr('y1',$yscale(0))
		.attr('x2',$xscale(arrStat.indexOf(statObj)))
		.attr('y2',$yscale(statObj.lastDist))
		.style('stroke-opacity',0.2);

		
	};
	



	/*
	d3.selectAll('#group1').append('polyline')
	.attr('points',str)
	.attr('id','totalDist');
	*/



/*
	for (var i = 1; i < data.length; i++) {
		arrData=data[i].split(",");

		objStat=null;
		for (var j = 0; j < arrStat.length; j++) {
			if((new Date(arrData[0])).getTime()>= arrStat[j].timeFrom &&
			   (new Date(arrData[0])).getTime()< arrStat[j].timeTo){
				objStat=arrStat[j]; 
				break;
			   };

		};

		if(objStat==null){
			arr=arrData[0].split("/");
			dataMonth=parseInt(arr[1]);
			dataMonth=(Math.floor(dataMonth/3)*3)+1;
			str=arr[0]+"/"+dataMonth.toString()+"/"+arr[1]
			date=new Date(str);
			nextSeasonDate=nextSeasonFirstDay(str);

			objStat={
				
				timeFrom:date.getTime(),
				timeTo:nextSeasonDate.getTime(),
				strYear:ad(date.getYear())+"年",
				strSeason:"第"+Math.floor((date.getMonth()+3)/3)+"季",
				name:function(){return this.strYear+this.strSeason},
				totalDist:0,
				totalCount:0
			}
			arrStat.push(objStat)
		}
		//已經有了objStat
		objStat.totalCount+=1;
		objStat.totalDist+=parseInt(arrData[1]);



	};


	//設定全域變數
	width=800;
	height=300;
	padding=70;
	filler="2:1";
	arrFil=[];
	arrFil[0]=parseInt(filler[0]);
	arrFil[1]=parseInt(filler[2]);
	em=16;

	center={
		x:padding,
		y:height-padding
	}
	xlength=width-2*padding;
	ylength=height-2*padding;

	unitWidth=function(arr){return xlength/arr.length};
	rectWidth=function(arr){return arrFil[1]*unitWidth(arr)/(arrFil[0]+arrFil[1])};
	offsetWidth=function(arr){return arrFil[0]*unitWidth(arr)/(arrFil[0]+arrFil[1])};

		//取得最大值
		arrMax=function(){
			max=arr[0].totalDist
			for (var i = 0; i < arr.length; i++) {
				if(arr[i].totalDist>max)max=arr[i];
			};
			return max;
		}


	main=function(){

		//初始化
		$("#graph").append('<svg>').hide().show('slow');
		$svg=d3.select('#graph svg');
		$svg.attr('width',width).attr('height',height);
		$g1=$svg.append("g").attr('id','group1').selectAll('#group1');

		//指定要代入的資料矩陣是什麼
		arr=arrStat;
		//arr=arrCmetOverCmeo("h");
		//console.log(arr);


		$g1data=$g1.data(arr).enter();

		$g1data.append('rect')
			.attr('x',function(d,i){
				return padding+i*unitWidth(arr)-rectWidth(arr);
			})
			.attr('y',function(d,i){
				return height-padding;
			})
			.attr('width',function(d,i){
				return rectWidth(arr)
			})
			.attr("height",0)
			.attr('fill','#A5DEE4')
			.transition()
			.duration(3000)
			.attr('y',function(d,i){
				return height-padding-(d.totalDist)*ylength/arrMax(arr);
			})
			.attr('height',function(d,i){
				return (d.totalDist)*ylength/arrMax(arr)
			});

		//加入tag的字
		$g1data.append('text').text(function(d,i){return d.name()})
			.attr('x',function(d,i){
				return padding+i*unitWidth(arr)-(1.5)*rectWidth(arr);
			})
			.attr('color','#7B90D2')
			.attr('y',function(d,i){
				return height-padding+em;
			});

		//加入value的字
		$g1data.append('text').text(function(d,i){return d.totalDist+"公尺"})
			//.attr('x',function(d,i){
			//	return padding+i*xlength/arr.length-2*5;
			//})
			//.attr('y',function(d,i){
			//	return height-padding-d*ylength/arrMax(arr);
			//})
			.attr('transform',function(d,i){
				str="";
				str+='translate(';
				str+=(padding+i*unitWidth(arr));
				str+=',';
				str+=(height-padding)-em;
				str+=')';
				str+='rotate(-90)';
				return str;
			})
			.transition().duration(3000)
			.attr('transform',function(d,i){
				str="";
				str+='translate(';
				str+=(padding+i*unitWidth(arr));
				str+=',';
				str+=(height-padding-(d.totalDist)*ylength/arrMax(arr))-em;
				str+=')';
				str+='rotate(-90)';
				return str;
			});


	};

	main();
	*/

}