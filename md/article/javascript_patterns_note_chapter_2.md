# 《Javascript Patterns》读书笔记 第二章 概要（1）
_2011-12-24 18:34_

这一章概要地介绍了一些最佳实践、模式还有编码习惯。

### 一、编写可维护的代码

发现bug时最好能立马修复，延迟可能导致你需要更多的时间去重新理解问题，还有可以解决问题的代码。

代码经常会被阅读，因为以下原因：

1. Bugs
2. 新功能要添加
3. 程序需要在新环境下运行
4. 代码的功能被改变
5. 代码完全被重写

可维护的代码表示代码具有以下特性：

1. 可读的
2. 一致的
3. 可预测的
4. 看起来像同一个人编写的
5. 有文档的

$$solo_more$$

### 二、尽量减少全局变量

JavaScript用函数来管理作用域，函数内定义的变量是局部的。全局变量是定义在任何函数之外的或者是未定义直接使用的变量。

每个JavaScript有一个全局对象（global object），当this用在任何函数之外时可以访问到它。每个全局变量成为全局对象的一个属性，游戏器中全局对象是window。

全局变量的问题在于它被所有的代码共享，当两部分的代码定义相同的全局变量时，会产生冲突。

引入一个第三方的代码也是很常见的，比如：

1. 第三方库
2. 来自广告伙伴的脚本
3. 来自流量跟踪和分析的代码
4. 各种widget等

当一个第三方脚本定义了全局变量result后，你自己定义的函数定义全局变量result时就会覆盖前面的全局变量。

所以和其他的脚本共同工作时，减少全局变量的使用是非常重要的。使用var定义变量是一个最重要的方法。

提示：另一个减少全局变量使用的原因是考虑到可移植性，当你的代码要运行在不同的环境中时，定义全局变量是很危险的，因为可以覆盖来自宿主的全局变量。

用var创建的全局变量和未使用var创建的隐性全局变量有一点细微的差别：

用var创建的全局变量不能被delete删除，而未使用var创建的隐性全局变量可以用delete删除。

在ES5“严格模式”下，给未定义的变量赋值将报错。

### 三、访问全局对象

在浏览器中，全局对象可以在任何代码中通过window访问。但在另一些环境中，这个全局对象可能叫不同的名字，所以最好不要硬编码，而是通过下面的代码访问（在任何代码中都可以）：

	var global = (function(){
	    return this;
	}());

(注：最外层的括号完全可以不要的，括回也可以放到最后一对空括号之前)

### 四、单var语句

在函数开头只使用一个var语句有如下好处：

1. 变量集中到开头
2. 阻止当一个变量在声明前使用时产生逻辑错误（hoisting，见后文）（注：这个是指JavaScript预编译机制导致的变量可见性问题，即一个变量在同一作用域内先读，后定义，则读的时候会是undefined，而不管它的作用域链中同名变量情况是如何）
3. 强迫记得声明变量，减少隐性全局变量
4. 减少代码量

声明变量时赋初值是个好习惯，可能避免逻辑错误，并增加代码可读性，可以一眼看出是什么类型的变量。

你也可以在定义的时候做真正的计算。（注：例子中是指一系列逗号分开的定义中，后面的变量可以使用前面的变量）

JavaScript允许在函数内部随意、多次使用var定义变量，就跟在顶部定义一样的效果，这个行为叫hoisting（注：不知该如何翻译好）。如：

	myname="global";
	function func(){
	    alert(myname);    //"undefined"
	    var myname="local";
	    alert(myname);    //"local"
	}
	func();

跟下面的代码一样，好像定义被提前了一样：

	myname="global";
	function func(){
	    var myname;
	    alert(myname);    //"undefined"
	    myname="local";
	    alert(myname);    //"local"
	}
	func();

> 提示：在理解的时候，可以将函数和变量定义理解为“提前”，但ECMAScript中并未有这种说法。在实现的时候，其实是分两步的，第一步先扫描函数和变量定义，创建上下文环境（context），第二步才执行代码。

> 第二章内容好多，先发一部分，之后继续。

> 2012年8月20日更新：短期内可能不会更新了，本书正在翻译中，[翻译稿](https://github.com/TooooBug/javascript.patterns)可以在GitHub上找到。