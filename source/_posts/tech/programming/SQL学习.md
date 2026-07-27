---
title: SQL学习笔记
date: 2025-08-12
categories:
  - 技术
tags:
  - SQL
---
# 8月12日
## 基础查询语法
SELECT * FROM world

(输出整个world表格)

SELECT name , gdp FROM world WHERE population >5000000

(输出表格world中的name和gdp两列，筛选条件是population数量大于五百万)

SELECT name FROM world
WHERE name LIKE 'C%ia'

(输出表格world中的name一列，筛选条件是名称由C开头，ia结尾)

**%是万能占位符，可以代表一个或多个字符，比如“%d”就是代表所有结尾是字母d的单词
同时，"__"下划线也是万能占位符，表示一个字符，比如“%o__o%”代表所有包含o什么什么o这四个字母的单词**

多重筛选
美國、印度和中國(USA, India, China)是人口又大，同時面積又大的國家。排除這些國家。

顯示以人口或面積為大國的國家，但不能同時兩者。顯示國家名稱，人口和面積
SELECT name, population ,area
FROM world
WHERE area >3000000 AND population <250000000  
OR area<3000000 AND population>250000000

因为AND的优先级高于OR，所以会先运算AND再运算OR，正好可以筛选出来只符合两个条件中一个的国家

### ROUND函数：
ROUND(1000.22222,2)
输出为： 1000.22 在mysql中是四舍五入到两位小数，但是别的数据库系统可能是直接截取到两位小数
*如果想保留一千为单位的整数，例如本来是123300，编程123000，你可以使用*
ROUND（float，-3）
如果3表示保留三位小数（千分位），那么-3是不是就代表千位呢？（我真聪明）
或者可以用数学的办法
ROUND（gdp/population/1000,0)* 1000 AS THOGPP
gdp/population ：计算人均gdp
ROUND（gdp/population/1000,0)人均GDP除以一千保留整数

ROUND（gdp/population/1000,0)* 1000 人均GDP保留千位数
最后随便命了个名，起名为千G每人 ：THOusand Gdp Per Person ~~抽象~~

**SQL报错又找不到问题的时候，想一想有没有少用括号或者用中文的字符**

## 8月14日
SELECT yr,subject,winner
FROM  nobel
WHERE (yr between 1980 AND 1989 )AND (subject = 'literature')
- 上面sql指令的意思是，罗列出1980年至1989年诺贝尔文学奖的年份，学科和获奖人
**between并没有左闭右开之类，直接说什么就是什么。爽**

WHERE subject NOT IN （‘literature’，‘peace’）
WHERE  NOT subject  IN （‘literature’，‘peace’）
上面两行代码具有相同的效力，但是意思不完全相同
第一行是说，subject 不在 文学奖或和平奖里
第二行是说，否定了subject 在文学奖或者和平奖里

### 非ascll编码
- 好烦。看不懂维基百科上的介绍
- 太好了直接复制粘贴就可以
### 字符串中带单引号
EUGENE O'NEILL   这是一个诺贝尔奖获得者的名字，里面带一个单引号
表示方式一： name = ‘EUGENE O'’NEILL‘  （把字符串中的单引号变成两个单引号）
表示方式二： name =“EUGENE O'NEILL”  （外边用双引号括起来）

## 排序
ORDER BY xx    以xx为条件排序，
ORDER BY year DESC   以年份为条件降序排序（显示最新的）
ORDER BY year DESC ，winner    以年份为条件降序排序，同年份的用获奖者名字排序   ORDER BY -year ，winner  和上面那句一样的效果

### 布尔值

subject in （‘literature’，‘chemistry’）算是一种布尔值，放到select语句中会生成一列0或者1，判断这个诺贝尔奖获奖者的学科是不是属于化学或者物理。可以用这个来排序
ORDER BY 
       CASE WHEN subject IN （‘literature’，‘chemistry’）THEN 1
       ELSE 0
因为0比1打，sql默认升序排序，所以这个排序会把化学和物理的奖项排到输出列表的最后。

## 筛选这一块
- 题目要求筛选出：物理学和化学没有颁诺贝尔奖的年份
SELECT yr FROM nobel
 WHERE subject NOT IN(SELECT subject 
                        FROM nobel
                       WHERE subject IN ('Chemistry','Physics'))

乍一想挺对，想了很久也没发现问题，最后发现括号里选出来的是subject的列，后面根本就没法再让year选了
正确答案是：
SELECT yr FROM nobel
 WHERE yr NOT IN(SELECT yr 
                   FROM nobel
                 WHERE subject IN ('Chemistry','Physics'))

## 表格中的两个属性相等，直接写就行
SELECT name,  capital
FROM world 
WHERE LEFT(name,1)=LEFT(capital,1)
AND NOT name = capital

- 这串代码的含义是选出所有国家名字首字母和首都首字母相同的，但是排除首都和国家名字一样的
直接name=capital就是代表着国家名字的字符串和首都的字符串一样
- 其中的LEFT函数可以读取字符串的左起几个字母
比如LEFT（‘name',2）的意思是输出‘name’这个字符串的前两个字母

### LIMIT
题目：以大洲的名字排序，再以国家名字在每个洲内排序，最后每个洲只保留第一个国家
SELECT name
FROM world
ORDER BY continent



### 保留整数
CAST （float AS INT）把一个浮点数直接砍成整数
CAST(ROUND(float,3) AS INT) 把一个浮点数四舍五入保留三位小数之后砍成整数