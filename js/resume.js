
var make_resume_header_div = function(resume_data){
  var header = $('<div class="row"/>');

  var photo = $('<div class="col-md-3 col-3"/>')
                .append('<img class="col-md-12 col-12" src="../images/Truman.Zhou.jpg" title="This is me!" alt="My Profile">');
  header.append(photo);
  var title_name = $('<div class="col-md-3 col-3"/>');
  var name = $('<div class = "row"/>').append('<h2>'+ resume_data["name"]+'</h2>');
  var title = $('<div class = "row"/>').append('<h3>' + resume_data["title"]+ '</h3>');
  title_name.append(name).append(title);
  header.append(title_name)
  var info = $('<div class="col-md-6 col-6"/>');
  var ul = $('<ul><ul/>');
  var address = $('<li><i class ="fa fa-home"/></li>').append(" Shanghai, China");
  var email = $('<li><i class ="fa fa-envelope"/></li>').append('<a href="mailto:truman.ck.zhou@gmail.com"> truman.ck.zhou@gmail.com</a>');
  var github = $('<li><i class ="fa fa-github-alt"/></li>').append('<a href="https://github.com/trumanz"> https://github.com/trumanz</a>');
  var travisci = $('<li><i class ="fa fa-rocket"/></li>').append('<a href="https://travis-ci.org/trumanz"> https://travis-ci.org/trumanz</a>');
  var sites = $('<li/>');
  sites.append('<a href="#"> <i class="fa fa-github-alt">  </a>');
  sites.append('<a href="#"> <i class="fa fa-linkedin-square">  </a>');
  ul.append(address)
    .append(email)
    .append(github)
    .append(travisci)
    .append(sites);
  info.append(ul);
  header.append(info);
  return header;
}

var make_introduce_div = function(resume_data){
  var div = $('<div/>').append("<h4>" + resume_data["introduce"] + "</h4>");
  return div;
}
var make_resume_body = function(title, body_div){
  var div = $('<div class="row"/>');
  var left = $('<div class="col-md-2 col-2"/>').append("<h2>" + title + "</h2>");
  var right = $('<div class="col-md-10 col-10"/>').append(body_div);
  div.append(left).append(right);
  return div;
}

var make_skills_div = function(resume_data){
     var div = $('<div class="row"/>');
     for( i in resume_data["skills"]) {
         var skill = resume_data["skills"][i];
         var sk_div = $('<div/>').append("<h4>" + skill + "</h4>");
         div.append(sk_div);
     }
     return div;
}


var  make_resume_div = function(){
  var resume_div = $('<div class="container"/>');
  $.get("../data/me.json", function(resume_data, status){
    console.log(resume_data);
        var header = make_resume_header_div(resume_data);
       this.resume_div.append(header);
       var introduce = make_resume_body("Hello!",make_introduce_div(resume_data) );
       this.resume_div.append(introduce);
       var skills = make_resume_body("Skills",make_skills_div(resume_data) );
       this.resume_div.append(skills);
  }.bind({resume_div: resume_div}))
  return resume_div;
}

var load_basic_resume_to_div = function(div){
   $.get("../data/me.json", function(resume_data, status){
    console.log(resume_data);
        var header = make_resume_header_div(resume_data);
        this.resume_div.empty();
       this.resume_div.append(header);
  }.bind({resume_div: div}))
 }
