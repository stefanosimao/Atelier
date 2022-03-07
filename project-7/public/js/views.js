//EJS Compiled Views - This file was automatically generated on Thu Dec 09 2021 12:28:21 GMT+0100 (Central European Standard Time)
ejs.views_include = function(locals) {
    console.log("views_include_setup",locals);
    return function(path, d) {
        console.log("ejs.views_include",path,d);
        return ejs["views_"+path.replace(/\//g,"_")]({...d,...locals}, null, ejs.views_include(locals));
    }
};
ejs.views_edit = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<nav class=\"home\">  <img src = \"images/place.svg\" alt=\"Place\" class=\"home\" id=\"place\"/>\n    <a href=\"/\" target=\"_blank\" class=\"home link\" >Homepage</a>\n    <a href=\"/songs/\" target=\"_blank\" class=\"home link\" >Song catalog</a>\n    <a href=\"/songs/upload\" target=\"_blank\" class=\"home link\" >Song Upload Form</a>                                \n</nav>\n<main class=\"upload\">\n    <header class=\"upload\" id=\"uptitle\"> Modify the song</header>\n    \n    <form class=\"upload\" id=\"upsec\" method=\"POST\" action=\"/songs/<%= song_info._id %>?_method=PUT\" encType=\"multipart/form-data\">\n    \n        <label class=\"upload label\" for=\"inputName\">Title </label>\n        <input class=\"input upload\" type=\"text\" placeholder=\"<%= song_info.title %>\" id=\"inputName\" name=\"title\" list=\"titles\"/>\n        <datalist id='titles'>\n            <% titles.forEach(o=>{ -%>\n                <option value=\"<%=o%>\"><%=o%></option>\n            <% }) -%>\n        </datalist>\n\n        <p class=\"upload label\" >Artist</p>\n        <input class=\"input upload\" type=\"text\" placeholder=\"<%= song_info.artist %>\" name=\"artist\" list=\"artists\"/>\n        <datalist id='artists'>\n            <% art.forEach(o=>{ -%>\n                <option value=\"<%=o%>\"><%=o%></option>\n            <% }) -%>\n        </datalist>\n\n        <p class=\"upload label\" >Album</p>\n        <input class=\"input upload\" type=\"text\" placeholder=\"<%= song_info.album %>\" name=\"album\" list=\"albums\"/>\n        <datalist id='albums'>\n            <% alb.forEach(o=>{ -%>\n                <option value=\"<%=o%>\"><%=o%></option>\n            <% }) -%>\n        </datalist>\n\n        <p class=\"upload\" id=\"label\">Genre</p>\n        <input type=\"text\" id=\"dropdown\" name=\"genre\" placeholder=\"<%= song_info.genre %>\" list=\"genres\">\n        <datalist id='genres'>\n            <% gen.forEach(o=>{ -%>\n                <option value=\"<%=o%>\"><%=o%></option>\n            <% }) -%>\n        </datalist>\n\n        <p class=\"upload label\" > Description</p>\n        <textarea class=\"upload\" id=\"description\" name=\"desc\" placeholder=\"<%= song_info.desc %>\"></textarea>\n        \n        <p class=\"upload label\" > Upload file</p>\n        <p><input class=\"upload input\" type=\"file\" name=\"file\"></p>\n\n        <p class=\"upload label\" > Favourite</p>\n        <p class=\"upload star\"><input class=\"upload\" type=\"checkbox\" title=\"favourite\" id=\"star\" name=\"favourite\" value=true  <% if (song_info.favourite == true) { %>checked = \"checked\"<% } %>> </p>\n\n        <p class=\"upload label\" >Quality (1 - 10)</p>\n        <input class=\"upload\" type=\"range\" min=\"1\" max=\"10\" id=\"qualityrange\" value=\"<%= song_info.quality %>\" name=\"quality\"/>\n\n        <p class=\"upload\" id=\"labelS\"></p>\n        <input class=\"upload\" id=\"submit\" type=\"submit\"  value=\"SUBMIT\" />\n\n        <p class=\"upload label\"></p>\n        <input class=\"upload\" id=\"cancel\" type=\"button\" value=\"X\" />\n    </form>\n    \n</main>\n\n<aside class=\"upload\">\n</aside>\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<nav class=\"home\">  <img src = \"images/place.svg\" alt=\"Place\" class=\"home\" id=\"place\"/>\n    <a href=\"/\" target=\"_blank\" class=\"home link\" >Homepage</a>\n    <a href=\"/songs/\" target=\"_blank\" class=\"home link\" >Song catalog</a>\n    <a href=\"/songs/upload\" target=\"_blank\" class=\"home link\" >Song Upload Form</a>                                \n</nav>\n<main class=\"upload\">\n    <header class=\"upload\" id=\"uptitle\"> Modify the song</header>\n    \n    <form class=\"upload\" id=\"upsec\" method=\"POST\" action=\"/songs/")
    ; __line = 9
    ; __append(escapeFn( song_info._id ))
    ; __append("?_method=PUT\" encType=\"multipart/form-data\">\n    \n        <label class=\"upload label\" for=\"inputName\">Title </label>\n        <input class=\"input upload\" type=\"text\" placeholder=\"")
    ; __line = 12
    ; __append(escapeFn( song_info.title ))
    ; __append("\" id=\"inputName\" name=\"title\" list=\"titles\"/>\n        <datalist id='titles'>\n            ")
    ; __line = 14
    ;  titles.forEach(o=>{ 
    ; __append("                <option value=\"")
    ; __line = 15
    ; __append(escapeFn(o))
    ; __append("\">")
    ; __append(escapeFn(o))
    ; __append("</option>\n            ")
    ; __line = 16
    ;  }) 
    ; __append("        </datalist>\n\n        <p class=\"upload label\" >Artist</p>\n        <input class=\"input upload\" type=\"text\" placeholder=\"")
    ; __line = 20
    ; __append(escapeFn( song_info.artist ))
    ; __append("\" name=\"artist\" list=\"artists\"/>\n        <datalist id='artists'>\n            ")
    ; __line = 22
    ;  art.forEach(o=>{ 
    ; __append("                <option value=\"")
    ; __line = 23
    ; __append(escapeFn(o))
    ; __append("\">")
    ; __append(escapeFn(o))
    ; __append("</option>\n            ")
    ; __line = 24
    ;  }) 
    ; __append("        </datalist>\n\n        <p class=\"upload label\" >Album</p>\n        <input class=\"input upload\" type=\"text\" placeholder=\"")
    ; __line = 28
    ; __append(escapeFn( song_info.album ))
    ; __append("\" name=\"album\" list=\"albums\"/>\n        <datalist id='albums'>\n            ")
    ; __line = 30
    ;  alb.forEach(o=>{ 
    ; __append("                <option value=\"")
    ; __line = 31
    ; __append(escapeFn(o))
    ; __append("\">")
    ; __append(escapeFn(o))
    ; __append("</option>\n            ")
    ; __line = 32
    ;  }) 
    ; __append("        </datalist>\n\n        <p class=\"upload\" id=\"label\">Genre</p>\n        <input type=\"text\" id=\"dropdown\" name=\"genre\" placeholder=\"")
    ; __line = 36
    ; __append(escapeFn( song_info.genre ))
    ; __append("\" list=\"genres\">\n        <datalist id='genres'>\n            ")
    ; __line = 38
    ;  gen.forEach(o=>{ 
    ; __append("                <option value=\"")
    ; __line = 39
    ; __append(escapeFn(o))
    ; __append("\">")
    ; __append(escapeFn(o))
    ; __append("</option>\n            ")
    ; __line = 40
    ;  }) 
    ; __append("        </datalist>\n\n        <p class=\"upload label\" > Description</p>\n        <textarea class=\"upload\" id=\"description\" name=\"desc\" placeholder=\"")
    ; __line = 44
    ; __append(escapeFn( song_info.desc ))
    ; __append("\"></textarea>\n        \n        <p class=\"upload label\" > Upload file</p>\n        <p><input class=\"upload input\" type=\"file\" name=\"file\"></p>\n\n        <p class=\"upload label\" > Favourite</p>\n        <p class=\"upload star\"><input class=\"upload\" type=\"checkbox\" title=\"favourite\" id=\"star\" name=\"favourite\" value=true  ")
    ; __line = 50
    ;  if (song_info.favourite == true) { 
    ; __append("checked = \"checked\"")
    ;  } 
    ; __append("> </p>\n\n        <p class=\"upload label\" >Quality (1 - 10)</p>\n        <input class=\"upload\" type=\"range\" min=\"1\" max=\"10\" id=\"qualityrange\" value=\"")
    ; __line = 53
    ; __append(escapeFn( song_info.quality ))
    ; __append("\" name=\"quality\"/>\n\n        <p class=\"upload\" id=\"labelS\"></p>\n        <input class=\"upload\" id=\"submit\" type=\"submit\"  value=\"SUBMIT\" />\n\n        <p class=\"upload label\"></p>\n        <input class=\"upload\" id=\"cancel\" type=\"button\" value=\"X\" />\n    </form>\n    \n</main>\n\n<aside class=\"upload\">\n</aside>\n")
    ; __line = 66
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_homepage = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "\n<nav class=\"home\">  <img src = \"images/place.svg\" alt=\"Place\" class=\"home\" id=\"place\"/>\n    <a href=\"/\" target=\"_blank\" class=\"home link\" id=\"current\">Homepage</a>\n    <a href=\"/songs/\" target=\"_blank\" class=\"home link\" >Song catalog</a>\n    <a href=\"/songs/upload\" target=\"_blank\" class=\"home link\" >Song Upload Form</a>                                \n</nav>\n<main class=\"home\">\n    <p class=\"home\" id=\"statstitle\"> Stats </p>\n    <article class=\"home\" id=\"stats\"> \n        <figure>\n                <img src=\"images/songs.svg\" alt=\"Songs\" style=\"width:75%\" class=\"home statsicon\">\n                <figcaption class=\"home figcap\" id=\"song_number\"><%= data[0]%> Songs</figcaption>\n        </figure>\n        <figure>\n                <img src=\"images/albums.svg\" alt=\"Albums\" style=\"width:75%\" class=\"home statsicon\">\n                <figcaption class=\"home figcap\" id=\"album_number\"><%= data[1]%> Albums</figcaption>\n        </figure> \n        <figure>\n                <img src=\"images/playlist.svg\" alt=\"Playlist\" style=\"width:75%\" class=\"home statsicon\">\n                <figcaption class=\"home figcap\" id=\"artist_number\"><%= data[3]%> Artists</figcaption>\n        </figure>   \n        <figure>\n                <img src=\"images/genres.svg\" alt=\"Genres\" style=\"width:85%\" class=\"home statsicon\">\n                <figcaption class=\"home figcap\" id=\"genre_number\"><%= data[2]%> Genres</figcaption>\n        </figure>                    \n    </article>\n    <p class=\"home\" id=\"fasttitle\"> Jump right into it </p>\n    <article class=\"home\" id=\"lists\">\n        <article class=\"home\" id=\"artists_list\"> \n            <p class=\"home\" id=\"arttitle\"> List of artists </p>\n            <% a_List.forEach((n)=>{ %>\n                <a href=\"songs?artist=<%= n %>\" target=\"_blank\" class=\"home fastlink\" ><%= n %></a>\n            <% }); %>\n        </article>\n        <article class=\"home\" id=\"genres_list\"> \n            <p class=\"home\" id=\"gentitle\"> List of genres </p>\n            <% gen_List.forEach((n)=>{ %>\n                <a href=\"songs?genre=<%= n %>\" target=\"_blank\" class=\"home fastlink\" ><%= n %></a>\n            <% }); %>\n        </article>\n    </article>\n</main>\n\n<aside class=\"home\" id=\"favs\">\n    <p class=\"home\" id=\"gentitle\"> Favourite songs </p>\n        <% fav_List.forEach((n)=>{ %>\n            <a href=\"songs?fav=<%= n._id %>\" class=\"home fastlink\" ><%= n.title %></a>\n        <% }); %>\n</aside>\n\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("\n<nav class=\"home\">  <img src = \"images/place.svg\" alt=\"Place\" class=\"home\" id=\"place\"/>\n    <a href=\"/\" target=\"_blank\" class=\"home link\" id=\"current\">Homepage</a>\n    <a href=\"/songs/\" target=\"_blank\" class=\"home link\" >Song catalog</a>\n    <a href=\"/songs/upload\" target=\"_blank\" class=\"home link\" >Song Upload Form</a>                                \n</nav>\n<main class=\"home\">\n    <p class=\"home\" id=\"statstitle\"> Stats </p>\n    <article class=\"home\" id=\"stats\"> \n        <figure>\n                <img src=\"images/songs.svg\" alt=\"Songs\" style=\"width:75%\" class=\"home statsicon\">\n                <figcaption class=\"home figcap\" id=\"song_number\">")
    ; __line = 12
    ; __append(escapeFn( data[0]))
    ; __append(" Songs</figcaption>\n        </figure>\n        <figure>\n                <img src=\"images/albums.svg\" alt=\"Albums\" style=\"width:75%\" class=\"home statsicon\">\n                <figcaption class=\"home figcap\" id=\"album_number\">")
    ; __line = 16
    ; __append(escapeFn( data[1]))
    ; __append(" Albums</figcaption>\n        </figure> \n        <figure>\n                <img src=\"images/playlist.svg\" alt=\"Playlist\" style=\"width:75%\" class=\"home statsicon\">\n                <figcaption class=\"home figcap\" id=\"artist_number\">")
    ; __line = 20
    ; __append(escapeFn( data[3]))
    ; __append(" Artists</figcaption>\n        </figure>   \n        <figure>\n                <img src=\"images/genres.svg\" alt=\"Genres\" style=\"width:85%\" class=\"home statsicon\">\n                <figcaption class=\"home figcap\" id=\"genre_number\">")
    ; __line = 24
    ; __append(escapeFn( data[2]))
    ; __append(" Genres</figcaption>\n        </figure>                    \n    </article>\n    <p class=\"home\" id=\"fasttitle\"> Jump right into it </p>\n    <article class=\"home\" id=\"lists\">\n        <article class=\"home\" id=\"artists_list\"> \n            <p class=\"home\" id=\"arttitle\"> List of artists </p>\n            ")
    ; __line = 31
    ;  a_List.forEach((n)=>{ 
    ; __append("\n                <a href=\"songs?artist=")
    ; __line = 32
    ; __append(escapeFn( n ))
    ; __append("\" target=\"_blank\" class=\"home fastlink\" >")
    ; __append(escapeFn( n ))
    ; __append("</a>\n            ")
    ; __line = 33
    ;  }); 
    ; __append("\n        </article>\n        <article class=\"home\" id=\"genres_list\"> \n            <p class=\"home\" id=\"gentitle\"> List of genres </p>\n            ")
    ; __line = 37
    ;  gen_List.forEach((n)=>{ 
    ; __append("\n                <a href=\"songs?genre=")
    ; __line = 38
    ; __append(escapeFn( n ))
    ; __append("\" target=\"_blank\" class=\"home fastlink\" >")
    ; __append(escapeFn( n ))
    ; __append("</a>\n            ")
    ; __line = 39
    ;  }); 
    ; __append("\n        </article>\n    </article>\n</main>\n\n<aside class=\"home\" id=\"favs\">\n    <p class=\"home\" id=\"gentitle\"> Favourite songs </p>\n        ")
    ; __line = 46
    ;  fav_List.forEach((n)=>{ 
    ; __append("\n            <a href=\"songs?fav=")
    ; __line = 47
    ; __append(escapeFn( n._id ))
    ; __append("\" class=\"home fastlink\" >")
    ; __append(escapeFn( n.title ))
    ; __append("</a>\n        ")
    ; __line = 48
    ;  }); 
    ; __append("\n</aside>\n\n")
    ; __line = 51
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_includes_footer = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "        <hr class=\"<%= type %>\">\n        <footer class=\"<%= type %>\"> \n            <span class=\"<%= type %> footer\">@StefanoGonçalvesSimao </span> \n            <span class=\"<%= type %> footer\">Tue 13 Nov 2021</span> \n            <span class=\"<%= type %> footer\"><a href=\"https://en.wikipedia.org/wiki/Disclaimer\" target=\"_blank\" class=\"<%= type %>\">Legal Disclaimer</a></span>  \n        </footer>\n    </body>\n    </html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("        <hr class=\"")
    ; __append(escapeFn( type ))
    ; __append("\">\n        <footer class=\"")
    ; __line = 2
    ; __append(escapeFn( type ))
    ; __append("\"> \n            <span class=\"")
    ; __line = 3
    ; __append(escapeFn( type ))
    ; __append(" footer\">@StefanoGonçalvesSimao </span> \n            <span class=\"")
    ; __line = 4
    ; __append(escapeFn( type ))
    ; __append(" footer\">Tue 13 Nov 2021</span> \n            <span class=\"")
    ; __line = 5
    ; __append(escapeFn( type ))
    ; __append(" footer\"><a href=\"https://en.wikipedia.org/wiki/Disclaimer\" target=\"_blank\" class=\"")
    ; __append(escapeFn( type ))
    ; __append("\">Legal Disclaimer</a></span>  \n        </footer>\n    </body>\n    </html>")
    ; __line = 8
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_includes_header = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<html>\n    <head>\n        <title> <%= title %> </title>\n        <meta name=\"author\" content=\"Stefano Gonçalves Simao\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <link href=\"/public/style.css\" rel=\"stylesheet\"/>\n        <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Quicksand\">\n    </head>\n    <body class=\"<%= type %>\">\n        <header class=\"<%= type %>\" id=\"bigtitle\"> Stefano's Music </header>\n        <hr class=\"<%= type %>\">\n        <section class=\"<%= type %>\">\n\n            <nav class=\"<%= type %>\">  <img src = \"<% if (title == 'Homepage') { %>images/place.svg<% }else if(title == 'Edit'){ %>../../images/place.svg<% }else{ %>../images/place.svg<% } %>\" alt=\"Place\" class=\"<%= type %>\" id=\"place\"/>\n                <a href=\"/\" target=\"_blank\" class=\"<%= type %> link\" <% if (title == 'Homepage') { %>id=\"current\"<% } %>>Homepage</a>\n                <a href=\"/songs/\" target=\"_blank\" class=\"<%= type %> link\" <% if (title == 'Songs') { %>id=\"current\"<% } %>>Song catalog</a>\n                <a href=\"/songs/upload\" target=\"_blank\" class=\"<%= type %> link\" <% if (title == 'Upload') { %>id=\"current\"<% } %>>Song Upload Form</a>                                \n            </nav>\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<html>\n    <head>\n        <title> ")
    ; __line = 3
    ; __append(escapeFn( title ))
    ; __append(" </title>\n        <meta name=\"author\" content=\"Stefano Gonçalves Simao\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <link href=\"/public/style.css\" rel=\"stylesheet\"/>\n        <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Quicksand\">\n    </head>\n    <body class=\"")
    ; __line = 9
    ; __append(escapeFn( type ))
    ; __append("\">\n        <header class=\"")
    ; __line = 10
    ; __append(escapeFn( type ))
    ; __append("\" id=\"bigtitle\"> Stefano's Music </header>\n        <hr class=\"")
    ; __line = 11
    ; __append(escapeFn( type ))
    ; __append("\">\n        <section class=\"")
    ; __line = 12
    ; __append(escapeFn( type ))
    ; __append("\">\n\n            <nav class=\"")
    ; __line = 14
    ; __append(escapeFn( type ))
    ; __append("\">  <img src = \"")
    ;  if (title == 'Homepage') { 
    ; __append("images/place.svg")
    ;  }else if(title == 'Edit'){ 
    ; __append("../../images/place.svg")
    ;  }else{ 
    ; __append("../images/place.svg")
    ;  } 
    ; __append("\" alt=\"Place\" class=\"")
    ; __append(escapeFn( type ))
    ; __append("\" id=\"place\"/>\n                <a href=\"/\" target=\"_blank\" class=\"")
    ; __line = 15
    ; __append(escapeFn( type ))
    ; __append(" link\" ")
    ;  if (title == 'Homepage') { 
    ; __append("id=\"current\"")
    ;  } 
    ; __append(">Homepage</a>\n                <a href=\"/songs/\" target=\"_blank\" class=\"")
    ; __line = 16
    ; __append(escapeFn( type ))
    ; __append(" link\" ")
    ;  if (title == 'Songs') { 
    ; __append("id=\"current\"")
    ;  } 
    ; __append(">Song catalog</a>\n                <a href=\"/songs/upload\" target=\"_blank\" class=\"")
    ; __line = 17
    ; __append(escapeFn( type ))
    ; __append(" link\" ")
    ;  if (title == 'Upload') { 
    ; __append("id=\"current\"")
    ;  } 
    ; __append(">Song Upload Form</a>                                \n            </nav>\n")
    ; __line = 19
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_player = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<%- include('includes/header', {title: \"Player\", type: \"player\"}); -%>\n<main class=\"player\" id=\"playerOne\">\n                        <header class=\"player\" >\n                            <p class=\"title titleSong\"><a class=\"title rest artist\" href=\"/songs?artist=<%= song_info.artist %>\" class=\"link\"><%= song_info.artist %></a></p>\n                            <p class=\"title titleSong\"><%= song_info.title %></p>\n                            <p class=\"title titleSong\"><a class=\"title rest album\" href=\"/songs?album=<%= song_info.album %>\" class=\"link\"><%= song_info.album %></a></p>\n                        </header>\n                        <section class=\"player seek play\" >\n                            <audio controls id=\"playerControls\" src=<%= song_info.src %>></audio>\n                        </section>  \n                        <section class=\"player actions\" >\n                            <p class=\"title titleSong\"><a class=\"title rest artist\" href=\"/songs/<%= song_info._id %>/edit\" class=\"link\">Edit</a></p>\n                            <form class=\"title titleSong\" method=\"POST\" action=\"/songs/<%= song_info._id %>?_method=DELETE\"><input class=\"titleD\" type=\"submit\" value=\"DELETE\" /></form>\n                        </section>  \n                    </main>\n                        <aside class=\"player\">  \n                            <p class=\"songs\" id=\"gentitle\"> Enjoy the music!</p>\n                    </aside>\n                </section>\n\n\n<%- include('includes/footer', {type: \"player\"}); -%>\n\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append( include('includes/header', {title: "Player", type: "player"}) )
    ; __append("<main class=\"player\" id=\"playerOne\">\n                        <header class=\"player\" >\n                            <p class=\"title titleSong\"><a class=\"title rest artist\" href=\"/songs?artist=")
    ; __line = 4
    ; __append(escapeFn( song_info.artist ))
    ; __append("\" class=\"link\">")
    ; __append(escapeFn( song_info.artist ))
    ; __append("</a></p>\n                            <p class=\"title titleSong\">")
    ; __line = 5
    ; __append(escapeFn( song_info.title ))
    ; __append("</p>\n                            <p class=\"title titleSong\"><a class=\"title rest album\" href=\"/songs?album=")
    ; __line = 6
    ; __append(escapeFn( song_info.album ))
    ; __append("\" class=\"link\">")
    ; __append(escapeFn( song_info.album ))
    ; __append("</a></p>\n                        </header>\n                        <section class=\"player seek play\" >\n                            <audio controls id=\"playerControls\" src=")
    ; __line = 9
    ; __append(escapeFn( song_info.src ))
    ; __append("></audio>\n                        </section>  \n                        <section class=\"player actions\" >\n                            <p class=\"title titleSong\"><a class=\"title rest artist\" href=\"/songs/")
    ; __line = 12
    ; __append(escapeFn( song_info._id ))
    ; __append("/edit\" class=\"link\">Edit</a></p>\n                            <form class=\"title titleSong\" method=\"POST\" action=\"/songs/")
    ; __line = 13
    ; __append(escapeFn( song_info._id ))
    ; __append("?_method=DELETE\"><input class=\"titleD\" type=\"submit\" value=\"DELETE\" /></form>\n                        </section>  \n                    </main>\n                        <aside class=\"player\">  \n                            <p class=\"songs\" id=\"gentitle\"> Enjoy the music!</p>\n                    </aside>\n                </section>\n\n\n")
    ; __line = 22
    ; __append( include('includes/footer', {type: "player"}) )
    ; __append("\n")
    ; __line = 24
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_playlist = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "\n    <body class=\"player\" id=\"player_body\" onload=\"init()\">\n        <!-- The content of the player should be dynamically generated.\n            Do not manually add any HTML here -->\n        <h1>Exercise 5 - Object-Oriented JavaScript - Playlist</h1>\n\n        \n        <script src=\"public/js/script.js\"></script>\n        <!-- Script where the init_player_with_playlist function is implemented -->\n        <script src=\"public/js/init.js\"></script>\n        <script src=\"public/js/data.js\"></script>\n\n        <script>\n            //This function will call the init_player function passing a test playlist\n            //You are welcome to change the playlist\n\n            function init() {\n                let songs = ['music/one.mp3', 'music/two.mp3', 'music/three.mp3', 'music/four.mp3', 'music/five.mp3', 'music/seven.mp3', 'music/six.mp3'];\n\n                let songs2 = [ 'music/five.mp3', 'music/two.mp3', 'music/four.mp3', 'music/one.mp3', 'music/seven.mp3', 'music/six.mp3', 'music/three.mp3'];\n\n                let dom = document.getElementById(\"player_body\");\n\n                init_player_with_playlist(dom, \"pl\", songs);\n\n                //init_player_with_playlist(dom, \"pl2\", songs2);\n\n                //init_player_with_playlist(dom, \"pl3\", songs2);\n\n            }\n        </script>\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("\n    <body class=\"player\" id=\"player_body\" onload=\"init()\">\n        <!-- The content of the player should be dynamically generated.\n            Do not manually add any HTML here -->\n        <h1>Exercise 5 - Object-Oriented JavaScript - Playlist</h1>\n\n        \n        <script src=\"public/js/script.js\"></script>\n        <!-- Script where the init_player_with_playlist function is implemented -->\n        <script src=\"public/js/init.js\"></script>\n        <script src=\"public/js/data.js\"></script>\n\n        <script>\n            //This function will call the init_player function passing a test playlist\n            //You are welcome to change the playlist\n\n            function init() {\n                let songs = ['music/one.mp3', 'music/two.mp3', 'music/three.mp3', 'music/four.mp3', 'music/five.mp3', 'music/seven.mp3', 'music/six.mp3'];\n\n                let songs2 = [ 'music/five.mp3', 'music/two.mp3', 'music/four.mp3', 'music/one.mp3', 'music/seven.mp3', 'music/six.mp3', 'music/three.mp3'];\n\n                let dom = document.getElementById(\"player_body\");\n\n                init_player_with_playlist(dom, \"pl\", songs);\n\n                //init_player_with_playlist(dom, \"pl2\", songs2);\n\n                //init_player_with_playlist(dom, \"pl3\", songs2);\n\n            }\n        </script>\n")
    ; __line = 32
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_song = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<%\nfunction format_seconds(s) {\n    if (typeof s != 'number' || Number.isNaN(s)) {\n        return '?:??';\n    }\n\n    if (s == 0 || s == 00 || s < 1 && s > 0 || s > -1 && s < 0) {\n        return '0:00';\n    }\n\n    if (s > 0) {\n        var minutes = Math.trunc(s / 60);\n        var seconds = Math.trunc(s % 60);\n        if (seconds <= 9) {\n            seconds = '0' + seconds;\n        }\n        return minutes + ':' + seconds;\n    }\n\n    if (s < 0) {\n        var minutes = Math.abs(Math.trunc(s / 60));\n        var seconds = Math.abs(Math.trunc(s % 60));\n        if (seconds <= 9) {\n            seconds = '0' + seconds;\n        }\n        return '-' + minutes + ':' + seconds;\n    }\n}\n%>\n<% song_List.forEach((n)=>{ %>\n    <% if (n.missing_file != true) { %>\n        <article class=\"song\" id=\"<%= n._id %>\">\n            <button type=\"button\" class=\"play_button\" >Play</button></a>\n            <button type=\"button\" class=\"add_button\" >Add</button></a>\n            <button type=\"button\" class=\"edit_button\" >Edit</button></a>\n            <button type=\"button\" class=\"delete_button\" >Delete</button></a>\n            <span class=\"filename\"><%= n.filename %></span>\n            <span class=\"duration\"><%= format_seconds(Math.ceil(n.duration)) %></span>\n            <span class=\"size\"><%= n.size %></span>\n            <span class=\"title\"><%= n.title %></span>\n            <span class=\"album\"><%= n.album %></span>\n            <span class=\"artist\"><%= n.artist %></span>\n            <span class=\"genre\"><%= n.genre %></span>\n            <a class=\"download_button\" href=../music/<%= n.filename %> download=<%= n.filename %> >\n            <button type=\"button\" class=\"download_button\" >Download</button></a>\n        </article>\n    <% } %>\n<% }); %>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; 
function format_seconds(s) {
    if (typeof s != 'number' || Number.isNaN(s)) {
        return '?:??';
    }

    if (s == 0 || s == 00 || s < 1 && s > 0 || s > -1 && s < 0) {
        return '0:00';
    }

    if (s > 0) {
        var minutes = Math.trunc(s / 60);
        var seconds = Math.trunc(s % 60);
        if (seconds <= 9) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    }

    if (s < 0) {
        var minutes = Math.abs(Math.trunc(s / 60));
        var seconds = Math.abs(Math.trunc(s % 60));
        if (seconds <= 9) {
            seconds = '0' + seconds;
        }
        return '-' + minutes + ':' + seconds;
    }
}

    ; __line = 29
    ; __append("\n")
    ; __line = 30
    ;  song_List.forEach((n)=>{ 
    ; __append("\n    ")
    ; __line = 31
    ;  if (n.missing_file != true) { 
    ; __append("\n        <article class=\"song\" id=\"")
    ; __line = 32
    ; __append(escapeFn( n._id ))
    ; __append("\">\n            <button type=\"button\" class=\"play_button\" >Play</button></a>\n            <button type=\"button\" class=\"add_button\" >Add</button></a>\n            <button type=\"button\" class=\"edit_button\" >Edit</button></a>\n            <button type=\"button\" class=\"delete_button\" >Delete</button></a>\n            <span class=\"filename\">")
    ; __line = 37
    ; __append(escapeFn( n.filename ))
    ; __append("</span>\n            <span class=\"duration\">")
    ; __line = 38
    ; __append(escapeFn( format_seconds(Math.ceil(n.duration)) ))
    ; __append("</span>\n            <span class=\"size\">")
    ; __line = 39
    ; __append(escapeFn( n.size ))
    ; __append("</span>\n            <span class=\"title\">")
    ; __line = 40
    ; __append(escapeFn( n.title ))
    ; __append("</span>\n            <span class=\"album\">")
    ; __line = 41
    ; __append(escapeFn( n.album ))
    ; __append("</span>\n            <span class=\"artist\">")
    ; __line = 42
    ; __append(escapeFn( n.artist ))
    ; __append("</span>\n            <span class=\"genre\">")
    ; __line = 43
    ; __append(escapeFn( n.genre ))
    ; __append("</span>\n            <a class=\"download_button\" href=../music/")
    ; __line = 44
    ; __append(escapeFn( n.filename ))
    ; __append(" download=")
    ; __append(escapeFn( n.filename ))
    ; __append(" >\n            <button type=\"button\" class=\"download_button\" >Download</button></a>\n        </article>\n    ")
    ; __line = 47
    ;  } 
    ; __append("\n")
    ; __line = 48
    ;  }); 
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_songs = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<%\nfunction format_seconds(s) {\n    if (typeof s != 'number' || Number.isNaN(s)) {\n        return '?:??';\n    }\n\n    if (s == 0 || s == 00 || s < 1 && s > 0 || s > -1 && s < 0) {\n        return '0:00';\n    }\n\n    if (s > 0) {\n        var minutes = Math.trunc(s / 60);\n        var seconds = Math.trunc(s % 60);\n        if (seconds <= 9) {\n            seconds = '0' + seconds;\n        }\n        return minutes + ':' + seconds;\n    }\n\n    if (s < 0) {\n        var minutes = Math.abs(Math.trunc(s / 60));\n        var seconds = Math.abs(Math.trunc(s % 60));\n        if (seconds <= 9) {\n            seconds = '0' + seconds;\n        }\n        return '-' + minutes + ':' + seconds;\n    }\n}\n%>\n<nav class=\"home\">  <img src = \"images/place.svg\" alt=\"Place\" class=\"home\" id=\"place\"/>\n    <a href=\"/\" target=\"_blank\" class=\"home link\" >Homepage</a>\n    <a href=\"/songs/\" target=\"_blank\" class=\"home link\" id=\"current\">Song catalog</a>\n    <a href=\"/songs/upload\" target=\"_blank\" class=\"home link\" >Song Upload Form</a>                                \n</nav>\n<main class=\"song_table\">     \n    <header>\n        <form  id='searchForm'onsubmit=\"return false;\" >\n            <input type=\"text\" name=\"search\" placeholder=\"Search for songs\" id='searchSong'>\n            <button type=\"button\">Search</button>\n        </form>\n        <a href=\"songs.html?sort=filename\">Filename</a>\n        <a href=\"songs.html?sort=duration\">Duration (MM:SS)</a>\n        <a href=\"songs.html?sort=size\">Size (MB)</a>\n        <a href=\"songs.html?sort=title\">Title</a>\n        <a href=\"songs.html?sort=albu\">Album</a>\n        <a href=\"songs.html?sort=artis\">Artist</a>\n        <a href=\"songs.html?sort=genr\">Genre</a>\n    </header>\n    <section id='onlySongs'>\n    <% song_List.forEach((n)=>{ %>\n        <% if (n.missing_file != true) { %>\n            <article class=\"song\" id=\"<%= n._id %>\">\n                <button type=\"button\" class=\"play_button\" >Play</button></a>\n                <button type=\"button\" class=\"add_button\" >Add</button></a>\n                <button type=\"button\" class=\"edit_button\" >Edit</button></a>\n                <button type=\"button\" class=\"delete_button\" >Delete</button></a>\n                <span class=\"filename\"><%= n.filename %></span>\n                <span class=\"duration\"><%= format_seconds(Math.ceil(n.duration)) %></span>\n                <span class=\"size\"><%= n.size %></span>\n                <span class=\"title\"><%= n.title %></span>\n                <span class=\"album\"><%= n.album %></span>\n                <span class=\"artist\"><%= n.artist %></span>\n                <span class=\"genre\"><%= n.genre %></span>\n                <a class=\"download_button\" href=../music/<%= n.filename %> download=<%= n.filename %> >\n                <button type=\"button\" class=\"download_button\" >Download</button></a>\n            </article>\n        <% } %>\n    <% }); %>\n    </section>\n</main>\n\n<aside class=\"songs\" id='sidebar';> \n    <p class=\"songs\" id=\"gentitle\"> <% if (side_Type == 'genre') { %>Genres<% }else if (side_Type == 'artist'){ %>Artists<% }else if (side_Type == 'album'){ %> Albums<% }else if (side_Type == 'enjoy'){ %> Enjoy the music!<% }%></p>\n    <% side_List.forEach((n)=>{ %>\n        <a href=\"../songs?<%= side_Type %>=<%= n %>\" target=\"_blank\" class=\"home fastlink\" ><%= n %></a>\n    <% }); %>\n</aside>\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; 
function format_seconds(s) {
    if (typeof s != 'number' || Number.isNaN(s)) {
        return '?:??';
    }

    if (s == 0 || s == 00 || s < 1 && s > 0 || s > -1 && s < 0) {
        return '0:00';
    }

    if (s > 0) {
        var minutes = Math.trunc(s / 60);
        var seconds = Math.trunc(s % 60);
        if (seconds <= 9) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    }

    if (s < 0) {
        var minutes = Math.abs(Math.trunc(s / 60));
        var seconds = Math.abs(Math.trunc(s % 60));
        if (seconds <= 9) {
            seconds = '0' + seconds;
        }
        return '-' + minutes + ':' + seconds;
    }
}

    ; __line = 29
    ; __append("\n<nav class=\"home\">  <img src = \"images/place.svg\" alt=\"Place\" class=\"home\" id=\"place\"/>\n    <a href=\"/\" target=\"_blank\" class=\"home link\" >Homepage</a>\n    <a href=\"/songs/\" target=\"_blank\" class=\"home link\" id=\"current\">Song catalog</a>\n    <a href=\"/songs/upload\" target=\"_blank\" class=\"home link\" >Song Upload Form</a>                                \n</nav>\n<main class=\"song_table\">     \n    <header>\n        <form  id='searchForm'onsubmit=\"return false;\" >\n            <input type=\"text\" name=\"search\" placeholder=\"Search for songs\" id='searchSong'>\n            <button type=\"button\">Search</button>\n        </form>\n        <a href=\"songs.html?sort=filename\">Filename</a>\n        <a href=\"songs.html?sort=duration\">Duration (MM:SS)</a>\n        <a href=\"songs.html?sort=size\">Size (MB)</a>\n        <a href=\"songs.html?sort=title\">Title</a>\n        <a href=\"songs.html?sort=albu\">Album</a>\n        <a href=\"songs.html?sort=artis\">Artist</a>\n        <a href=\"songs.html?sort=genr\">Genre</a>\n    </header>\n    <section id='onlySongs'>\n    ")
    ; __line = 50
    ;  song_List.forEach((n)=>{ 
    ; __append("\n        ")
    ; __line = 51
    ;  if (n.missing_file != true) { 
    ; __append("\n            <article class=\"song\" id=\"")
    ; __line = 52
    ; __append(escapeFn( n._id ))
    ; __append("\">\n                <button type=\"button\" class=\"play_button\" >Play</button></a>\n                <button type=\"button\" class=\"add_button\" >Add</button></a>\n                <button type=\"button\" class=\"edit_button\" >Edit</button></a>\n                <button type=\"button\" class=\"delete_button\" >Delete</button></a>\n                <span class=\"filename\">")
    ; __line = 57
    ; __append(escapeFn( n.filename ))
    ; __append("</span>\n                <span class=\"duration\">")
    ; __line = 58
    ; __append(escapeFn( format_seconds(Math.ceil(n.duration)) ))
    ; __append("</span>\n                <span class=\"size\">")
    ; __line = 59
    ; __append(escapeFn( n.size ))
    ; __append("</span>\n                <span class=\"title\">")
    ; __line = 60
    ; __append(escapeFn( n.title ))
    ; __append("</span>\n                <span class=\"album\">")
    ; __line = 61
    ; __append(escapeFn( n.album ))
    ; __append("</span>\n                <span class=\"artist\">")
    ; __line = 62
    ; __append(escapeFn( n.artist ))
    ; __append("</span>\n                <span class=\"genre\">")
    ; __line = 63
    ; __append(escapeFn( n.genre ))
    ; __append("</span>\n                <a class=\"download_button\" href=../music/")
    ; __line = 64
    ; __append(escapeFn( n.filename ))
    ; __append(" download=")
    ; __append(escapeFn( n.filename ))
    ; __append(" >\n                <button type=\"button\" class=\"download_button\" >Download</button></a>\n            </article>\n        ")
    ; __line = 67
    ;  } 
    ; __append("\n    ")
    ; __line = 68
    ;  }); 
    ; __append("\n    </section>\n</main>\n\n<aside class=\"songs\" id='sidebar';> \n    <p class=\"songs\" id=\"gentitle\"> ")
    ; __line = 73
    ;  if (side_Type == 'genre') { 
    ; __append("Genres")
    ;  }else if (side_Type == 'artist'){ 
    ; __append("Artists")
    ;  }else if (side_Type == 'album'){ 
    ; __append(" Albums")
    ;  }else if (side_Type == 'enjoy'){ 
    ; __append(" Enjoy the music!")
    ;  }
    ; __append("</p>\n    ")
    ; __line = 74
    ;  side_List.forEach((n)=>{ 
    ; __append("\n        <a href=\"../songs?")
    ; __line = 75
    ; __append(escapeFn( side_Type ))
    ; __append("=")
    ; __append(escapeFn( n ))
    ; __append("\" target=\"_blank\" class=\"home fastlink\" >")
    ; __append(escapeFn( n ))
    ; __append("</a>\n    ")
    ; __line = 76
    ;  }); 
    ; __append("\n</aside>\n")
    ; __line = 78
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_upload = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<nav class=\"home\">  <img src = \"images/place.svg\" alt=\"Place\" class=\"home\" id=\"place\"/>\n    <a href=\"/\" target=\"_blank\" class=\"home link\" >Homepage</a>\n    <a href=\"/songs/\" target=\"_blank\" class=\"home link\" >Song catalog</a>\n    <a href=\"/songs/upload\" target=\"_blank\" class=\"home link\" id=\"current\">Song Upload Form</a>                                \n</nav>\n<main class=\"upload\">\n    <header class=\"upload\" id=\"uptitle\"> Upload a song</header>\n    \n    <form class=\"upload\" id=\"upsec\" method=\"POST\" action=\"/songs\" encType=\"multipart/form-data\">\n    \n        <label class=\"upload label\" for=\"inputName\">Title </label>\n        <input class=\"input upload\" type=\"text\" id=\"inputName\" name=\"title\" list=\"titles\" placeholder=\"Title\"/>\n        <datalist id='titles'>\n            <% titles.forEach(o=>{ -%>\n                <option value=\"<%=o%>\"><%=o%></option>\n            <% }) -%>\n        </datalist>\n\n        <p class=\"upload label\" >Artist</p>\n        <input class=\"input upload\" type=\"text\" name=\"artist\" list=\"artists\" placeholder=\"Artist\"/>\n        <datalist id='artists'>\n            <% art.forEach(o=>{ -%>\n                <option value=\"<%=o%>\"><%=o%></option>\n            <% }) -%>\n        </datalist>\n\n        <p class=\"upload label\" >Album</p>\n        <input class=\"input upload\" type=\"text\" name=\"album\" list=\"albums\" placeholder=\"Album\"/>\n        <datalist id='albums'>\n            <% alb.forEach(o=>{ -%>\n                <option value=\"<%=o%>\"><%=o%></option>\n            <% }) -%>\n        </datalist>\n        \n        <p class=\"upload\" id=\"label\">Genre</p>\n        <input type=\"text\" id=\"dropdown\" name=\"genre\" list=\"genres\" placeholder=\"Genre\">\n        <datalist id='genres'>\n            <% gen.forEach(o=>{ -%>\n                <option value=\"<%=o%>\"><%=o%></option>\n            <% }) -%>\n        </datalist>\n\n        <p class=\"upload label\" > Description</p>\n        <textarea class=\"upload\" id=\"description\" name=\"desc\"></textarea>\n        \n        <p class=\"upload label\" > Upload file</p>\n        <p><input class=\"upload input\" type=\"file\" name=\"file\"></p>\n\n        <p class=\"upload label\" > Favourite</p>\n        <p class=\"upload star\"><input class=\"upload\" type=\"checkbox\" title=\"favourite\" id=\"star\" name=\"favourite\" value=true></p>\n\n        <p class=\"upload label\" >Quality (1 - 10)</p>\n        <input class=\"upload\" type=\"range\" min=\"1\" max=\"10\" id=\"qualityrange\" name=\"quality\"/>\n\n        <p class=\"upload label\" id=\"labelS\"></p>\n        <input class=\"upload\" id=\"submit\" type=\"submit\" method=\"POST\" value=\"SUBMIT\" />\n    </form>\n    \n</main>\n\n<aside class=\"upload\">\n</aside>\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<nav class=\"home\">  <img src = \"images/place.svg\" alt=\"Place\" class=\"home\" id=\"place\"/>\n    <a href=\"/\" target=\"_blank\" class=\"home link\" >Homepage</a>\n    <a href=\"/songs/\" target=\"_blank\" class=\"home link\" >Song catalog</a>\n    <a href=\"/songs/upload\" target=\"_blank\" class=\"home link\" id=\"current\">Song Upload Form</a>                                \n</nav>\n<main class=\"upload\">\n    <header class=\"upload\" id=\"uptitle\"> Upload a song</header>\n    \n    <form class=\"upload\" id=\"upsec\" method=\"POST\" action=\"/songs\" encType=\"multipart/form-data\">\n    \n        <label class=\"upload label\" for=\"inputName\">Title </label>\n        <input class=\"input upload\" type=\"text\" id=\"inputName\" name=\"title\" list=\"titles\" placeholder=\"Title\"/>\n        <datalist id='titles'>\n            ")
    ; __line = 14
    ;  titles.forEach(o=>{ 
    ; __append("                <option value=\"")
    ; __line = 15
    ; __append(escapeFn(o))
    ; __append("\">")
    ; __append(escapeFn(o))
    ; __append("</option>\n            ")
    ; __line = 16
    ;  }) 
    ; __append("        </datalist>\n\n        <p class=\"upload label\" >Artist</p>\n        <input class=\"input upload\" type=\"text\" name=\"artist\" list=\"artists\" placeholder=\"Artist\"/>\n        <datalist id='artists'>\n            ")
    ; __line = 22
    ;  art.forEach(o=>{ 
    ; __append("                <option value=\"")
    ; __line = 23
    ; __append(escapeFn(o))
    ; __append("\">")
    ; __append(escapeFn(o))
    ; __append("</option>\n            ")
    ; __line = 24
    ;  }) 
    ; __append("        </datalist>\n\n        <p class=\"upload label\" >Album</p>\n        <input class=\"input upload\" type=\"text\" name=\"album\" list=\"albums\" placeholder=\"Album\"/>\n        <datalist id='albums'>\n            ")
    ; __line = 30
    ;  alb.forEach(o=>{ 
    ; __append("                <option value=\"")
    ; __line = 31
    ; __append(escapeFn(o))
    ; __append("\">")
    ; __append(escapeFn(o))
    ; __append("</option>\n            ")
    ; __line = 32
    ;  }) 
    ; __append("        </datalist>\n        \n        <p class=\"upload\" id=\"label\">Genre</p>\n        <input type=\"text\" id=\"dropdown\" name=\"genre\" list=\"genres\" placeholder=\"Genre\">\n        <datalist id='genres'>\n            ")
    ; __line = 38
    ;  gen.forEach(o=>{ 
    ; __append("                <option value=\"")
    ; __line = 39
    ; __append(escapeFn(o))
    ; __append("\">")
    ; __append(escapeFn(o))
    ; __append("</option>\n            ")
    ; __line = 40
    ;  }) 
    ; __append("        </datalist>\n\n        <p class=\"upload label\" > Description</p>\n        <textarea class=\"upload\" id=\"description\" name=\"desc\"></textarea>\n        \n        <p class=\"upload label\" > Upload file</p>\n        <p><input class=\"upload input\" type=\"file\" name=\"file\"></p>\n\n        <p class=\"upload label\" > Favourite</p>\n        <p class=\"upload star\"><input class=\"upload\" type=\"checkbox\" title=\"favourite\" id=\"star\" name=\"favourite\" value=true></p>\n\n        <p class=\"upload label\" >Quality (1 - 10)</p>\n        <input class=\"upload\" type=\"range\" min=\"1\" max=\"10\" id=\"qualityrange\" name=\"quality\"/>\n\n        <p class=\"upload label\" id=\"labelS\"></p>\n        <input class=\"upload\" id=\"submit\" type=\"submit\" method=\"POST\" value=\"SUBMIT\" />\n    </form>\n    \n</main>\n\n<aside class=\"upload\">\n</aside>\n")
    ; __line = 63
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}