






function make_timeline_panel_div(blog){
	
	var title = blog.git_file.name.substring(0, blog.git_file.name.length - 3);
	var time_info = blog.commits[0].commit.author.date + " posted";
	if(blog.commits.length != 1){
 		 time_info = blog.commits[0].commit.author.date + " updated";
	 }
	var body = "";
 	var h4_titile = '<h4 class="timeline-title">' + title + '</h4>';
	var p_text_muted = '<p><small class="text-muted"><i class="fa fa-clock-o"></i>' + time_info + '</small></p>';
	
	var div_heading = $('<div class="timeline-heading"/>')
	                      .append(h4_titile)
						  .append(p_text_muted);
	
	var div_body =  $('<div class="timeline-body"/>')
	                     .append('<p>' + body + '</p>');
	var div =  $('<div/>').addClass("timeline-panel")
	              .append(div_heading)
				  .append(div_body);
	return div;
	
}

function make_li(blog){
 		 var time_info = blog.commits[0].commit.author.date + " posted";
		 //create badge
		 var ei = $('<i class="fa fa-file-text-o"></i>');
		 var badge = $('<div class="timeline-badge info"></div>')
					   .append(ei)
		 if(blog.commits.length != 1){
			 ei.removeClass().addClass("fa fa-repeat");
			 badge.removeClass("info").addClass("warning");
		 }
   		 return $('<li/>')
		   .addClass("timeline-inverted")
		   .append(badge)
		   .append(make_timeline_panel_div(blog));
}

function make_div(md_blogs){
	var all_li = '';
	var div =  $('<div/>').addClass("panel-body");
	var ul = $('<ul/>').addClass("timeline");
	div.append(ul);
	for(let blog of md_blogs){
		 ul.append(make_li(blog));   	 
	 }
 	 return div;
}





 
class GitHubMarkDownBlog {
	
	constructor(){
	    this.client_secure = { client_id : 'c45417c5d6249959a91d', client_secret : '3630a057d4ebbbdbfc84f855376f3f46f58b9710'};
		this.repo = new GitHub().getRepo("trumanz", "blog");
		this.x = {
			client_secure : { client_id : 'c45417c5d6249959a91d', client_secret : '3630a057d4ebbbdbfc84f855376f3f46f58b9710'},
			repo : new GitHub().getRepo("trumanz", "blog"),
		};
		
	}
	search_code_callback(complete_callback){
			return function(error, md_files, request){
				console.log(md_files);
				var rc = { count : md_files.length, x : [] };
				for(let md of md_files){
					console.log(md["path"]);
					var commits_search =  { client_id : 'c45417c5d6249959a91d', client_secret : '3630a057d4ebbbdbfc84f855376f3f46f58b9710'};
				    commits_search.path = md["path"];	  
                    new GitHub().getRepo("trumanz", "blog").listCommits(commits_search,function(error, commits, request){
						//console.log(commits);
						this.rc.count = this.rc.count - 1;
						this.rc.x.push(commits);
						if(this.rc.count == 0){
							this.complete_callback(rc);
						}
						//console.log(this.count.value);
					}.bind({rc: rc, complete_callback: this.complete_callback, path:  md["path"] }));						
				}
			}.bind({complete_callback: complete_callback, x : this.x});
	};
	
	listMdFiles(complete_callback){
		console.log(this);
  		var md_file_search = (JSON.parse(JSON.stringify(this.client_secure)));
		md_file_search.q = 'filename:md repo:' + "trumanz/blog"; 
        new GitHub().search().forCode(md_file_search ,function(error, md_files, request){
			console.log(md_files.length);
			var search_commits = function(deferred){
				    var commits_search =  { client_id : 'c45417c5d6249959a91d', client_secret : '3630a057d4ebbbdbfc84f855376f3f46f58b9710'};
				    commits_search.path = this.git_file["path"];	  
                    new GitHub().getRepo("trumanz", "blog").listCommits(commits_search,function(error, commits, request){
						var x = { commits : commits, git_file : this.git_file }
					    console.log(x);
						deferred.resolve(x);
					}.bind({git_file:this.git_file}));
			};
			var all = [];
			for(let md of md_files){
				var y = search_commits.bind({git_file: md});
				all.push($.Deferred(y));
			}
			console.log(all);
		$.when.apply(null, all).done(function(){
			var ordered_rc = [].slice.call(arguments).sort(function(a, b) {
				     var x = new Date(a.commits[0].commit.committer.date);
					 var y = new Date(b.commits[0].commit.committer.date);
					 return y - x; 
			});
			complete_callback(ordered_rc);
		})
			
		});				
	} 
	
 
	
	
	listCommitsPromise(path){
		var x ={
			repo: this.repo,
			path: path,
			client_secure: this.client_secure
		};
		return new Promise(function(resolve, reject){			
				  var commits_search = JSON.parse(JSON.stringify(this.client_secure));
				  commits_search.path = this.path;	  
				  this.repo.listCommits(commits_search,function(error, commits, request){
					  if(error) return reject(error);
					  resolve(commits);
				  });
		}.bind(x));
	}
	
	
		
   
}



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

 

