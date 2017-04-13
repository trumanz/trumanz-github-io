

function genereate_blogs(github_repo, div_content, ul_menu){
	
	fluid_div = '<div class ="container-fluid">';
	fluid_div = fluid_div +  '<div class="row">'
	fluid_div = fluid_div +  '<div class="col-sm-3 col-md-2 sidebar" id="nav-menu">'
	fluid_div = fluid_div +  '<ul class="nav nav-sidebar" ></ul>'
	fluid_div = fluid_div +  '</div>'
	fluid_div = fluid_div +  '<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main" >'
	fluid_div = fluid_div +  '<div id="blog_content"></div>'
	fluid_div = fluid_div +  '</div>'
	fluid_div = fluid_div +  '</div>'
    fluid_div = fluid_div +  '</div>'
	
	//div.append(fluid_div);
	
	var oauth = "client_id=c45417c5d6249959a91d&client_secret=3630a057d4ebbbdbfc84f855376f3f46f58b9710";
	const oauth_obj = { client_id : 'c45417c5d6249959a91d', client_secret : '3630a057d4ebbbdbfc84f855376f3f46f58b9710'};
	
	var md_file_search = (JSON.parse(JSON.stringify(oauth_obj)));
	md_file_search.q = 'filename:md repo:' + github_repo;
	
	//search all md file
	new GitHub().search().forCode(md_file_search , function(error, md_files, request){
		//console.log(error);
		console.log(md_files);
 		//crate the sidebar
		for(const item of  md_files )
		{
			console.log(item);
			var name = item["name"];
			var path = item["path"];
			
			if(path == "README.md") continue;
			
			name = name.substring(0, name.length - 3);
 			ul_menu.append('<li><a href="' +  item["url"]  + '">' + name + '</a></li>');
			
			var commits_search =  (JSON.parse(JSON.stringify(oauth_obj)));
 			commits_search.path = path;
 			
			new GitHub().getRepo("trumanz", "blog").listCommits(commits_search,function(error, commits, request){
				   console.log(this.name);
				   console.log(commits);
				   var last_update_date = commits[0].commit.committer.date
				   console.log(last_update_date);
				   var header = '<h2><a href="#">' + this.name + '</a></h2>';
				   var post_time = '<p><span class="glyphicon glyphicon-time"></span> Posted on ' + last_update_date +  '</p>';
				   div_content.append('<div class="blog_news"'+ 'last_update="'  + last_update_date +  '">' +  header  + post_time + '</div>');
 				   var orderedDivs = $('.blog_news').sort(function(a, b) {
						var x = new Date(a.getAttribute("last_update"));
						var y = new Date(b.getAttribute("last_update"));
						return y-x;
					});
					div_content.empty().append(orderedDivs);
			}.bind({name :name}));	

		}
		
		
		
		//when the menu of sidebar clicked
		ul_menu.find("li").click(function(event){
			event.preventDefault();
			var href = $(this).find("a").attr("href");
			$("#nav-menu ul li").toggleClass("active", false);
			$(this).toggleClass("active", true);
			//get the file matedata
			makeCorsRequest(href + "&" + oauth, 
				function(data){
					file = JSON.parse(data);
					file_raw_url = file["download_url"];
					//download the raw data
					makeCorsRequest(file_raw_url + "?" + oauth, 
						function(data){
							var converter = new showdown.Converter();
							x = converter.makeHtml(data);
							div_content.empty();
							div_content.append(x);
						} );
				});	
		});
				
	});//makeCorsRequest, get all md
  
}//function genereate_blogs

 

