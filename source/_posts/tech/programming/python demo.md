---
title: Python Demo
date: 2025-07-30 15:30:00
tags: 
  - Python
  - 编程
categories: 
  - 技术
---

这是一个 Python 基础语法演示，包含复数运算、字符串格式化等内容。

```python
from calendar import day_name  
  
print((1+4j) ** 2)  
print((1+4j)*(1-4j))  
#此处的1+4j是复数，虚数单位用j表示  
a = type(1+4j)  
b = type(a)  
print(a)  
print(b)  
#用type函数查看变量a和b的类型，并输出  
print("100整除2得：%d" % (100%2))  
#用 %d 来充当整数的占位符，用%f充当浮点数占位符，用%s充当字符串占位符  
  
name = "小王"  
age = 19  
print("这个青年名叫 "+ name + "他的年龄是 "+ str(age))  
  
pai = 3.1415926535  
print("圆周率保留五位小数是：{:.5f}".format(pai))  
# {}大括号是占位符，:.5f表示不限制长度，保留五位浮点数，后面用格式化函数format补充占  
year = 2025  
month = 7  
day = 30  
print(year%month)  
print(f"今天的日期是{year}年，{month}月，{day}日")  
print(type(year))#此处的三个变量都是整数类型  
#  f""  用来快速格式化后面大括号内的内容，例如上面这个就是将三个整数格式化为了字符串（我用计算证明了）  
author_name = input("请输入author_name：" )  
print(f"your name is{author_name}")
```