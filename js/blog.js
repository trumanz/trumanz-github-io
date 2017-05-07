
var listMdFiles = function(complete_callback){
	console.log(this);
	var client_secure = { client_id : 'c45417c5d6249959a91d', client_secret : '3630a057d4ebbbdbfc84f855376f3f46f58b9710'};
	var md_file_search = (JSON.parse(JSON.stringify(client_secure)));
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
		for(i in md_files){
			var y = search_commits.bind({git_file: md_files[i]});
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

function show_blog(){

	console.log("clicked");
	console.log(this.blog);
	//TODO get and redner with github API
	makeCorsRequest("https://raw.githubusercontent.com/trumanz/blog/master/" + this.blog.git_file.path, function(data){
		console.log(data);
		var converter = new showdown.Converter();
		var x = converter.makeHtml(data);
		$("#page-wrapper").empty();
		$("#page-wrapper").append(x);

	})
}

function make_timeline_panel_div(blog){

	var title = blog.git_file.name.substring(0, blog.git_file.name.length - 3);
	var time_info = blog.commits[0].commit.author.date + " posted";
	if(blog.commits.length != 1){
		time_info = blog.commits[0].commit.author.date + " updated";
	}
	var body = "";
	var h4_titile = $('<a href="#"><h4 class="timeline-title">' + title + '</h4></a>');
	h4_titile.click(show_blog.bind({blog:blog}));
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


function make_blog_div(md_blogs){
	var all_li = '';
	var blog_body =  $('<div/>').addClass("panel-body");
	var ul = $('<ul class="timeline"/>');
	for(i in md_blogs){ ul.append(make_li(md_blogs[i]));
	}
	blog_body.append(ul);
	var blog_div = $('<div  class="panel panel-default"> </div>')
	var blog_heading = $('<div class="panel-heading"><i class="fa fa-clock-o fa-fw"></i> Blog News</div>');
	blog_div.append(blog_heading);
	blog_div.append(blog_body);

	return blog_div;
}

function make_siderbar_menu(md_blogs){

	var catalog = {};
	for(i in md_blogs){
		var  blog = md_blogs[i];
		console.log(blog.git_file.path);
		var x = blog.git_file.path.split("/");
		console.log(x);
		if(x.length != 2){
			console.log("now support and only support 2 level");
			continue;
		}
		console.log(x[0]);
		if(!(x[0] in catalog)) {
			catalog[x[0]] = [];
		}
		catalog[x[0]].push(blog);
	}
	console.log(catalog);
	var second_levels_ul = $(' <ul class="nav nav-second-level"/>');
	for(menu in catalog){
		console.log(menu);
		var second_level_li = $('<li> <a href="#">' + menu +  '<span class="fa arrow"></span></a> </li>');
		var list =  catalog[menu];
		var third_levels_ul = $('<ul class="nav nav-third-level"/>');
		for(i in list){
			var x = list[i];
			var blog_a = $('<a href="#">' + x.git_file.name + '</a>');
			blog_a.click(show_blog.bind({blog:x}));
			third_levels_ul.append($('<li></li>').append(blog_a));
		}
		second_level_li.append(third_levels_ul);
		second_levels_ul.append(second_level_li);
	}


	return second_levels_ul;


}
