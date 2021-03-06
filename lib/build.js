var fs = require('fs');
var md = require("node-markdown").Markdown;
var tmpl = require("artTemplate");
var config = require("./config").config;
var path = require('path');
var moment = require('moment');
var skinPath = '../skin/default/';
var slotPath = '../skin/default/slot/';
var mdArticlePath = '../md/article/';
var articlePath = '../article/';
var articleTemplate = skinPath + 'article.html';
var pagePath = '../page/'
var mdPagePath = '../md/page/';
var pageTemplate = skinPath + 'page.html';
var rssTemplate = skinPath + 'rss.html';
var indexTemplate = skinPath + 'index.html';
var charset = 'utf8';
var tmpldata = {config:config,article:[]};

build(mdPagePath, pagePath, pageTemplate);
build(mdArticlePath, articlePath, articleTemplate);
buildIndex();
buildRss();
console.log('Done!');

function buildIndex(){
    var files = fs.readdirSync(mdArticlePath),
    	pageIndex = 0,
    	pageBlogCount = 0,
    	pubDate = {};

    //遍历一遍，取得时间
    files.forEach(function(file){
    	dotLastIndex = file.lastIndexOf('.');
		if (dotLastIndex >= 0) {
			fileType = file.substr(dotLastIndex + 1);
			if (fileType === 'md') {
				content = fs.readFileSync(mdArticlePath+file, charset);
				pubDate[file] = content.match(/_(\d{4}-\d{2}-\d{2} \d{2}:\d{2})_/)[1];
			}
		}
    });

    //按时间排序
	files.sort(function(obj1,obj2){
		return pubDate[obj1]<pubDate[obj2]?1:-1;
	})

	files.forEach(function(file){
		dotLastIndex = file.lastIndexOf('.');
		if (dotLastIndex >= 0) {
			fileType = file.substr(dotLastIndex + 1);
			if (fileType === 'md') {
					// 替换模板内容
					content = fs.readFileSync(mdArticlePath+file, charset);
					content = md(content);
					var morearr = content.split('<p>$$solo_more$$</p>');
					content = morearr[0];
					if(morearr.length > 1){
						content += '<div class="articlemore"><a href="./article/'+file.replace(/\.md$/,'.html')+'">继续阅读</a></div>';
					}
					content = content.replace(/(['"])\.\.\//g,'$1');
					content = content.replace(/^<h1>(.*)<\/h1>/,'<h1><a href="./article/'+file.replace(/\.md$/,'.html')+'">$1</a></h1>');

					//每页第一篇
					if(pageBlogCount === 0){
						tmpldata.article[pageIndex] = [];
					}

					tmpldata.article[pageIndex].push(content);
					pageBlogCount ++;

					if(pageBlogCount === config.indexBlogCount){
						pageBlogCount = 0;
						pageIndex ++;
					}
			}
		}
	});
	//console.log(fs.readFileSync(indexTemplate,charset));
	//模板引擎
	tmpldata.article.forEach(function(articleInPage,index){
		var filename = 'index'+(index?'_page'+(index+1):'')+'.html';
		console.log('Build file: '+filename);
		var content = tmpl(fs.readFileSync(indexTemplate,charset))({config:config,article:articleInPage,pagecount:tmpldata.article.length});
		fs.writeFileSync('../'+filename, content);
	})	
}


function buildRss(){
    var files = fs.readdirSync(mdArticlePath),
    	pubDate = {},
        articleArr = [],
        renderObj = {};
        
    renderObj.blogName = config.blogName;
    renderObj.blogUrl = config.blogUrl;
    renderObj.blogDescription = config.blogDescription;
    renderObj.updateDate = moment().format('ddd, DD MMM YYYY HH:mm:ss ZZ');

    //遍历一遍，取得时间
    files.forEach(function(file){
    	dotLastIndex = file.lastIndexOf('.');
		if (dotLastIndex >= 0) {
			fileType = file.substr(dotLastIndex + 1);
			if (fileType === 'md') {
				content = fs.readFileSync(mdArticlePath+file, charset);
				pubDate[file] = content.match(/_(\d{4}-\d{2}-\d{2} \d{2}:\d{2})_/)[1];
			}
		}
    });

    //按时间排序
	files.sort(function(obj1,obj2){
		return pubDate[obj1]<pubDate[obj2]?1:-1;
	})

	files.forEach(function(file){
		dotLastIndex = file.lastIndexOf('.');
		if (dotLastIndex >= 0) {
			fileType = file.substr(dotLastIndex + 1);
			if (fileType === 'md') {
				// 替换模板内容
				var content = fs.readFileSync(mdArticlePath+file, charset);
				content = md(content);
				content = content.replace('<p>$$solo_more$$</p>','');
				content = content.replace(/(['"])\.\.\//g,'$1');
                
                var title = content.replace(/^<h1>(.*)<\/h1>[\w\W]*$/,'$1');
                var pubDate = content.match(/<em>(\d{4}-\d{2}-\d{2} \d{2}:\d{2})<\/em>/)[1];
                
    			content = content.replace(/^<h1>(.*)<\/h1>/,'');
                content = content.replace(/<p><em>(.*)<\/em><\/p>/,'');
                
                articleArr.push({
                    url:config.blogUrl + '/article/' + file.substr(0, dotLastIndex) + '.html',
                    author:config.authorName,
                    pubDate:moment(pubDate).format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
                    title:title,
                    content:content
                });

				
			}
		}
	});
    
    renderObj.article = articleArr;
    
	//模板引擎
	console.log('Build file: rss.xml');
	var content = tmpl(fs.readFileSync(rssTemplate,charset))(renderObj);
	fs.writeFileSync('../rss.xml', content);	
}

function build(from, to, template) {

	//console.log(fs.exists(to));
	//检查是否存在，不存在则创建
	if (path.exists(to)) {
		fs.mkdirSync(to);
	}

	var files = fs.readdirSync(from);
	var file, dotLastIndex, fileType, fileName;

// 对所有以 .md 为后缀的文件，进行转换
	for (var i = 0; i < files.length; i++) {
		file = files[i];
		dotLastIndex = file.lastIndexOf('.');
		if (dotLastIndex >= 0) {
			fileType = file.substr(dotLastIndex + 1);
			if (fileType === 'md') {
				fileName = file.substr(0, dotLastIndex);
				buildFile(file, fileName, from, to, template);
			}
		}
	}
}

// 转换 markdown 文件为html文件
function buildFile(file, fileName, from, to, template) {
	console.log('Build file: ' + file);
	var text = fs.readFileSync(from + file, charset);
	var html = md(text);
	var content;


	//替换more标签
	html = html.replace('<p>$$solo_more$$</p>','');

	// 替换模板内容
	content = fs.readFileSync(template, charset).replace('${article}', html);


	// 替换slot
	content = includeSlot(content);


	//模板引擎
	content = tmpl(content)(tmpldata);

	fs.writeFileSync(to + fileName + '.html', content);
}

function includeSlot(content) {
	var slots = fs.readdirSync(slotPath);
	var slot;
	for (var i = 0; i < slots.length; i++) {
		slot = slots[i];
		var slot_text = fs.readFileSync(slotPath + slot, charset);
		content = content.replace('${slot}'.replace('slot', slot), slot_text);
	}
	return content;
}

