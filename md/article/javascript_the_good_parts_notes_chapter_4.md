# 《JavaScript语言精粹》读书笔记 第四章 函数
_2011-04-27 16:53_

### 4.1函数对象

在Javascript中函数就是对象。

	Function.prototype===Object

函数创建时有两个隐藏属性：上下文、实现函数行为的代码

### 4.2函数字面量

通过函数字面量创建的函数对象包含一个连到外部上下文的连接–闭包。

$$solo_more$$

### 4.3调用

四种调用模式：方法调用模式、函数调用模式、构造器调用模式、apply调用模式

不同的模式在初始化this上有差异

调用运算符：任何产生函数值（注：似乎应为”函数” ）的表达式后一对圆括号

实参（arguments）与形参（parameters）个数不匹配时不会报错，多的会忽略，少的为undefined。

方法调用模式：一个函数被保存为对象的一个属性时，称为方法，this被绑定到该对象。通过this可取得所属对象上下文的方法称为公共方法。

函数调用模式：一个函数非对象属性，this绑定到全局对象。不会绑定到外部函数的this！

构造器调用模式：JS是原型继承，同时提供了基于类类似的对象构建语法！（即new运算符。 ）

apply调用模式：apply接收两个参数，第一个被绑定给this第二个是参数数组。如

	var status = Quo.prototype.get_status.apply(statusObject);

相当于

	statusObject.get_status();

虽然它没有get_status方法。

### 4.4参数

arguments数组会包含所有实参，包括形参中没有对应的实参。

arguments是一个类数组（array-like），有length属性，缺少所有的数组方法。

### 4.5返回

函数被调用时从第一个语句开始执行，遇到关闭函数体的”}”时结束，控制权交还给调用该函数的语句。return使函数提前返回，不再执行余下语句。

函数总会返回值，如果没有指定，返回undefined。

如果函数以new方式调用，且返回值不是对象，则返回this（新对象 ）。

### 4.6异常

	try{
	    function();
	}catch(e){
	    //e
	}
function通过

	throw {name:"error",message:"error"};

抛出exception对象，被catch接住（e）。

一个try只能一个catch。

### 4.7给类型增加方法

JS允许给基本类型增加方法。

增加的方法立刻被赋予到所有对象实例上。

### 4.8递归

尾递归指在函数最后执行递归调用的递归。

JS未做尾递归优化（变成循环），尝试递归可能因为堆栈溢出而运行失败。

### 4.9作用域

作用域控制变量和参数的可见性和生命周期，减少名称冲突，提供自动内存管理。

JS不支持块级作用域。

有函数作用域，在函数中任何位置定义的变量在函数中的任何位置可见。（注：可见指有这个字面量，不一定有值。如果先用，再定义，则用的值为undefined。 ）

### 4.10闭包

	var myObject = function(){
	    var value=0;
	    return {
	        getValue:function(){
	        return value;
	    };
	}
	 
	var anotherObject = myObject(); //这里的anotherObject实际上等于getValue函数所在的对象
	anotherObject.getValue(); //0

getValue访问它被创建时所处的上下文环境，闭包。

重点是return回来是一个对象！可以不用new.

例子：

	var testfunc = function ( nodes ) {
		var i ;
		for ( i = 0 ; i < nodes . length ; i ++ ) {

			//这种方案中的匿名函数因会被外部调用而被保留，而此时i为nodes.length
			/*nodes[i].onclick = function(){
				alert(i);
				alert(this.onclick);
				return false;
			}*/

			//这种方案中，将参数i所在函数当场执行，变成形参e，返回事件处理函数，该函数得到e，即循环当时的i值
			nodes [ i ] . onclick = function ( e ) {
				return function ( ) { //注：原书中这里和下一行的形参有误
					alert ( e ) ;
					alert ( this . onclick ) ;
					return false ;
				} ;
			} ( i ) ;
		}
	}

	testfunc ( document . getElementsByTagName ( “a” ) ) ;

### 4.11回调

异步，防止界面假死（客户端阻塞）

### 4.12模块

模块：提供接口却隐藏状态与实现的函数或对象。

	String.method(‘deentityify’,function(){
		var entity = {
			quot : ‘”‘,
			lt : ‘<’,
			gt : ‘>’
		}

		return function(){
			return this.replace(/&([^&;]+);/g,function(a,b){
				var r = entity[b];
				return typeof r === ‘string’ ? r : a;
			}
		}
	}())

entity仅对内部可见

模块模式的一般形式是：一个定义了私有变量和函数的函数；利用闭包创建可以访问私有变量和函数的特权函数；最后返回这个特权函数，或者把它们保存到一个可访问到的地方。

### 4.13级联

如果让没有返回值的方法返回this而不是undefined，就可以启用级联。（如jQuery的连缀 ）

### 4.14套用

	var add1=add.curry(1);
	add1(6)

### 4.15记忆

设计技巧。