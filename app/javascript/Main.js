var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();

var Main =
{

};

Main.onLoad = function()
{
	alert("onload called");
	// Enable key event processing
	this.enableKeys();
	
	var xml="";
var fanart="";

$('document').ready(function()
	{
	
	$.ajaxSetup({
		cache: false
	});
	
	$.ajax({
		url: "airtel.xml",
		//url:"http://sultry-meadow-8944.herokuapp.com/",
		//dataType:"xml",
		success:function(data){
								alert("request successfull");
								alert(data);
								//xml=$.parseXML(data);
								//alert(xml);
								//$('#blah').html(xml);}
								xml=data;
							} ,
		error : function(e){alert("could not fetch xml - "+e);}
	});
	
	/*var gzip = function()
	{
		alert("gzip called");
		//var url="http://www.whatsonindia.com/XMLTV_Download/filedeliver.aspx?formatname=airtel&requester=adityagargg@gmail.com&password=winterfell";
		var url="airtel.xml.gz"
		gz=TarGZ.stream(url);
		combine(gz);
		
	}
	
	var combine=function(data)
		{
			var copy=gz;
			alert(typeof(copy));
			alert(copy.gzip);
			//$.each(data,function(i){alert(data[i])});
		
		}*/
	
	var tmdb=function(movie){
		alert("tmdb for movie "+movie);
		url="http://api.themoviedb.org/3/search/movie";
		$.ajax({
    		  type: 'GET',
      		  url: url,
		      async: false,
		      data: {query: movie,api_key:"c730c0195acce8c347beec41f2469c50"},
		      jsonpCallback: 'testing',
		      contentType: 'application/json',
		      dataType: 'jsonp',	
		      success: function(json) {
		        console.dir(json);
		        console.dir(json.results[0]);
		        tmdbId=json.results[0].id;
		        getTmdbData(tmdbId);
		        getCast(tmdbId);
		      //  similarMovies(tmdbId);
		        //showFanart(json);
		      },
		      error: function(e) {
		         alert("this is an error"+e.message);
		      }
		  });
	}



	
	
	var ajax=function(movie)
	{
		alert("imdb for "+movie);
		loadUrl="http://imdbapi.com/";
		//$('#blah').html("<img src='images/loading.gif'>").load(loadUrl,{language:"php", version:"5"});
		//$.get(loadUrl,null, function(resp){alert(JSON.stringify(resp))});
		$('.loading').show();
		$('#content').fadeOut();
		var infoBox=$('#movie_info');
		if(!infoBox.length)
		{$('.container').append("<div id='movie_info' class='item-row'></div>");}
		$.ajax({
				
				url: loadUrl,
				data: {t: movie,plot:"full"},
				
				success:function(data){data=JSON.parse(data);
									imdbId=data.imdbID;
									imdb_show(data);
									getTmdbData(imdbId);
									similarMovies(imdbId);
									getTrailer(imdbId);
								},
				error:function(error){alert(error);
				$('.loading').hide();
				$("#content").fadeIn().append("<div class='error'>Aw Snap! Looks like there are some problems with the network. Please try Again after a few minutes.</div>");}
			});
		

	}

	var imdb_show= function(data)
	{
		alert(data);
		$('.loading').hide();
		$('#movie_info').html('').show();

		$("#movie_info").append("<div class='poster span4 offset1'><img src='"+data.Poster+"' /></div>");
		$("#movie_info").append("<div id='details' class='span6'></div>");


		for (i in data)
		{
			$("#details").append("<div class='datatype "+i.toLowerCase()+"' >"+data[i]+"</div>");

		}

		
		

		
	}
	
	var getTmdbData= function(imdbId)
	{
		alert("fanart for "+imdbId); 
		tvdb_url="http://api.themoviedb.org/3/movie/"+imdbId+"?api_key=c730c0195acce8c347beec41f2469c50";
		
		
		$.ajax({
    		  type: 'GET',
      		  url: tvdb_url,
		      async: false,
		      jsonpCallback: 'testing',
		      contentType: 'application/json',
		      dataType: 'jsonp',	
		      success: function(json) {
		        console.dir(json);
		        showFanart(json);
		        tmdb_show(json);
		      },
		      error: function(e) {
		         alert("this is an error"+e.message);
		      }
		  });
	}

	var getCast=function(id)
	{
		alert("cast for : "+id);
		var url="http://api.themoviedb.org/3/movie/"+id+"/casts?api_key=c730c0195acce8c347beec41f2469c50";
		$.ajax({
    		  type: 'GET',
      		  url: url,
		      async: false,
		      contentType: 'application/json',
		      dataType: 'jsonp',	
		      success: function(json) {
		        console.dir(json);
		        },
		      error: function(e) {
		         alert("this is an error"+e.message);
		      }
		  });


	}

	var tmdb_show=function(){


	}

	
	var showFanart=function(json)
	{
		var base="http://cf2.imgobject.com/t/p/original/";
		fanart=base+json.backdrop_path;
		$('body').css('background',"url("+base+json.backdrop_path+") fixed no-repeat");
		$('body').css('background-size','100%');
		
	}

	var similarMovies= function(id)
	{
		url="http://api.themoviedb.org/3/movie/"+id+"/similar_movies?api_key=c730c0195acce8c347beec41f2469c50";
		$.ajax({
			type:'GET',
			url:url,
			contentType: 'application/json',
		    dataType: 'jsonp',
		    success: function(json) {
		        console.dir(json);
		        showRecommendations(json);
		      },
	        error: function(e) {
		         alert(e.message);
		      }

		});
	}

	var showRecommendations= function(data)
	{
		thumb_baseUrl="http://cf2.imgobject.com/t/p/w300/";
		$("#details").append("<div id='suggestions' class='row'></div>");
		for(i=0;i<=2;i++)
		{	
			$('#suggestions').append("<div class='similar span2 s"+i+"' id='"+data.results[i].id+"' ><img src='"+
			thumb_baseUrl+data.results[i].poster_path+"' /><div class='title'>"+data.results[i].original_title+"</div></div>");
			
		}

	}

	var getTrailer= function(id)
	{
		url="http://api.themoviedb.org/3/movie/"+id+"/trailers?api_key=c730c0195acce8c347beec41f2469c50";
		$.ajax({
			type:'GET',
			url:url,
			contentType: 'application/json',
		    dataType: 'jsonp',
		    success: function(json) {
		        console.dir(json);
		        viewTrailer(json);
		                },
	        error: function(e) {
		         alert(e.message);
		      }

		});

	}

	var viewTrailer= function(json)
	{
		id=json.youtube[0].source;
		$('#details').append("<div class='trailer item' id='"+id+"' >Trailer</div>");
		$('#details').on('click','.trailer', function()
		{
			$('#details').fadeOut();
			$('#content').append('<iframe id="ytplayer" type="text/html" width="1280" height="720" src="https://www.youtube.com/embed/'+id+'?autoplay=1" frameborder="0" allowfullscreen>');
		});
		
	}
	
	
	function tvListing(title)
	{
	  alert("function called");
	  //find every Tutorial and print the author
	  $("#content").html("");
	  
	  //alert("channel[id*='"+title+"']");
	  var channel=$(xml).find("channel[id*='"+title+"']").attr('id').slice(5,-3);
	  $("#content").append("<div class='channel'>"+channel+"</div>");
	  $(xml).find("programme[channel*='"+title+"']").each(function()
	  {
	    $("#content").append("<div class='listing item'><span class='show'>" + $(this).find("title").text() +"</span></a><span class='time'>"+ $(this).attr('start').slice(8, 12) +" : "+ $(this).attr('stop').slice(8, 12)+"</span></div>");
	  });
	  $('.listing').click(function(){var movie = $(this).children('.show').html();
	  								alert(movie);
	  								ajax(movie);

	  								});
	}


	var find_listing= function()
		{
			var title=$("input[name=title]").val().toUpperCase();
			alert(title);
			var list="";
			$('#content').html('');
			$(xml).find('programme title').each(function(){
				var temp=$(this).text();
				var res=temp.indexOf(title);
				if(res!=-1)
				{alert("match found");
				list=$(this).parent();
				showListing(list);
				}	
				else alert('no match found');			
			});
			
		}

	var showListing= function(listing)	
		{
			alert("show listing called");
			$('#content').append("<div class='listinsg itesm'><span class='show'>" + $(listing).find("title").text() +"</span><span class='time'>"+ $(listing).attr('start').slice(8, 12) +" : "+ $(listing).attr('stop').slice(8, 12)+"</span><span class='channel_listing'>"+ $(listing).attr('channel').slice(5, -3)+"</span></div>");
			$('.listing').click(function(){var movie = $(this).children('.show').html();
	  								alert(movie);
	  								ajax(movie);

	  								});
			
		}
		
	
	
	



	$('#imdb').click(function()
					{
						var movie=$("input[name=title]").val();
						tmdb(movie);
					});
					
	$('#woi').click(function()
					{	
						var title=$("input[name=title]").val().toUpperCase();
						if(title.length!=0)
						tvListing(title);
						else alert("enter a channel name dumbass");
					});

	$('#find').click(find_listing);
//	$('#tvdb').click(tvdb);
	
	
	/* NAVIGATION  */
	
	i=0;
	var highlighted;
	//console.log(highlighted);
		$(window).keydown(function(e)
			{	
				console.log(highlighted);
				switch(e.keyCode)
				{
				case tvKey.KEY_DOWN:
				case tvKey.KEY_RIGHT:
					if(highlighted) {
						//console.log('highlighted exists');
						highlighted.removeClass('highlight').blur();
						console.log(next=highlighted.next('.item:visible'));
						if(next.length > 0){
							highlighted = next.focus().addClass('highlight');
							}
						else{
							console.log(i+=1);
							if(i>2){
								i=0;
								row=$('.item-row:visible').eq(i);
								highlighted=row.find('.item').first().focus().addClass('highlight')}
							
							else{row=$('.item-row:visible').eq(i);
								highlighted=row.find('.item:visible').first().focus().addClass('highlight');}
							}	
						}
					else {
						console.log('gets called');
						console.log(row=$('.item-row:visible').first());
						highlighted=row.find('.item:visible').eq(i).focus().addClass('highlight');
						}				
				break;

				case tvKey.KEY_UP:
				case tvKey.KEY_LEFT:
					if(highlighted) {
						//console.log('highlighted exists');
						highlighted.removeClass('highlight').blur();
						console.log(prev=highlighted.prev('.item:visible'));
						if(prev.length > 0){
							highlighted = prev.focus().addClass('highlight');
							}
						else{
							console.log(i-=1);
							if(i<0){
								i=2;
								row=$('.item-row:visible').eq(i);
								highlighted=row.find('.item:visible').last().focus().addClass('highlight')}
							
							else{row=$('.item-row:visible').eq(i);
								highlighted=row.find('.item:visible').last().focus().addClass('highlight');}
							}	
						}
					else {
						console.log('gets called');
						console.log(row=$('.item-row:visible').first());
						highlighted=row.find('.item:visible').eq(i).focus().addClass('highlight');
						}				
				break;

				case tvKey.KEY_ENTER:
				case tvKey.KEY_PANEL_ENTER:
					alert("ENTER");
					if(highlighted){
						highlighted.trigger('click');
						}
				break;
				
				case tvKey.KEY_RED:
				
					alert('RED KEY');
					if(highlighted)
					{				
					highlighted.removeClass('highlight');
					}
					highlighted=$('#search input').focus().addClass('highlight');
								
				break;
				
				case tvKey.KEY_GREEN:
				
					alert('GREEN KEY');
					if(highlighted)
					{				
					highlighted.removeClass('highlight').blur();
					}
					highlighted=$('#imdb').focus().addClass('highlight').trigger('click');
								
				break;
				
				case tvKey.KEY_YELLOW:
				
					alert('YELLOW KEY');
					if(highlighted)
					{				
					highlighted.removeClass('highlight').blur();
					}
					highlighted=$('#woi').focus().addClass('highlight').trigger('click');
								
				break;
				
				case tvKey.KEY_BLUE:
				
					alert('BLUE KEY');
					if(highlighted)
					{				
					highlighted.removeClass('highlight').blur();
					}
					highlighted=$('#find').addClass('highlight').trigger('click');
								
				break;
				
				case tvKey.KEY_RETURN:
					alert('Return Key');
					$('#movie_info').hide();
					$('#content').fadeIn();

				}

		
			});
	
	
	

	
	});


	

	
	widgetAPI.sendReadyEvent();
	
};

Main.onUnload = function()
{

};

Main.enableKeys = function()
{
	//document.getElementById("anchor").focus();
};

/*Main.keyDown = function()
{
	$(document).ready(function(){
	i=0;
	var highlighted;
	alert(highlighted);
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);
		switch(keyCode)
	{
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			alert("RETURN");
			widgetAPI.sendReturnEvent();
			break;
		case tvKey.KEY_LEFT:
			alert("LEFT");
			break;
		case tvKey.KEY_RIGHT:
		
			alert("RIGHT");
			if(typeof highlighted!=="undefined")
				{
				//alert('highlighted exists');
				highlighted.removeClass('highlight').blur();
				alert(next=highlighted.next('.item'));
				if(next.length > 0){
					highlighted = next.focus().addClass('highlight');
					}
				else{
					alert(i+=1);
					if(i>2){
						i=0;
						row=$('.item-row').eq(i);
						highlighted=row.find('.item').first().focus().addClass('highlight')}
					
					else{
						alert('working well');
						row=$('.item-row').eq(i);
						highlighted=row.find('.item').first().focus().addClass('highlight');}
					}	
				}
			else {
				alert('no highlighted');
				alert(row=$('.item-row').first());
				highlighted=row.find('.item').eq(i).focus().addClass('highlight');
				}				
		break;
		
		case tvKey.KEY_UP:
			alert("UP");
			break;
		case tvKey.KEY_DOWN:
			alert("DOWN");
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			break;
		default:
			alert("Unhandled key");
			break;
	}
	});
};*/
	