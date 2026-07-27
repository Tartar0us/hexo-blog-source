---
title: python基础
date: 2026-01-19
categories:
  - 实习
tags:
  - 实习
  - Python
  - AI
  - 行业观察
---
### 一、核心必学（入门就能写智能体基础逻辑）

这是 Python 的 “基本功”，也是 AI 智能体开发的底线，必须掌握：

1. **基础语法**：变量 / 数据类型（重点：字符串、列表、字典）、条件判断（`if-elif-else`，避免多 if+else 的逻辑错误）、循环（`for`遍历 /`while`会话循环）；
2. **函数**：定义 / 调用、默认参数、关键字参数、返回值（拆分智能体工具函数，如`get_weather()`）；
3. **异常处理**：`try-except`捕获 API 调用 / 文件读取错误（保证智能体不崩溃）；
4. **文件 / 数据处理**：读写 JSON/Markdown 文件（智能体配置、知识库存储）、`json`模块使用。

### 二、进阶提升（让智能体代码更规范、高效）

掌握后能应对复杂智能体开发，符合工程化要求：

1. **面向对象（OOP）**：`class`定义智能体类、`__init__`初始化属性（如模型名、对话历史）；
2. **模块与包**：`import`导入第三方库（LangChain/OpenAI）、自定义模块拆分代码；
3. **异步编程**：`async/await`并发调用多工具（如同时查天气 + 查日历）；
4. **类型注解**：`List/Dict/Optional`标注参数 / 返回值（提升代码可读性，适配 LangChain 等库）；
5. **常用技巧**：列表推导式（快速处理对话记录）、装饰器（日志 / 性能统计）。

### 三、场景实战（AI 智能体专属用法）

结合实际开发场景的 “落地技能”，不用死记，边练边会：

1. **第三方库使用**：调用大模型 API（`openai`库）、智能体框架（`langchain`）；
2. **网络请求**：`requests`模块调用外部工具 API（天气、搜索引擎）；
3. **数据持久化**：本地文件存储（Obsidian 笔记联动）、简单缓存处理；
4. **基础调试**：`print`调试、查看报错信息（快速定位智能体逻辑问题）。

### 总结

1. 学习优先级：先啃「核心必学」，能写出简单的智能体对话逻辑；再补「进阶提升」，优化代码结构；最后结合「场景实战」，对接真实的 AI 库和工具；
2. 核心原则：不用掌握 Python 所有知识点，聚焦 “能解决 AI 智能体问题” 的最小集，比如先搞定`if-elif-else`的正确用法，再学函数和异常处理，边写边学效率最高；
3. 关键避坑：条件判断优先用`if-elif-else`（互斥判断），避免多`if`+`else`的逻辑错误，这是新手最容易踩的坑。

简单说：先会用 “变量 + 条件 + 函数 + 异常处理” 写一个能对话、调用工具的简单智能体，再用面向对象 / 异步优化代码，就是 AI 智能体开发的完整 Python 知识体系。


## 海龟编译器
 - crtl +/ 可以注释掉选中的代码，有利于在测试新代码块时候防止前面的代码干扰
-

### python数据结构
 ### **列表list**，定义的时候等号右边是中括号就是列表，第一个元素的标号是0，第二个是元素标号是1，最后一个元素标号是-1，。倒数第二个是-2
 ### **元组Tuple**。1.定义之后不可以改变 2.有序 3.元素用小括号包裹 4.允许重复元素出现，比如（1，1，2）是合法的
 ### **集合** Set 1.用大括号定义，定义之后可以改动 2.无序 3.不允许出现重复元素。与字典的区别是智友值没有键
 ### **字典** dict 1.大括号包裹的键值对，比如{“name”：“小明”，“age“ ：18}
 想输出字典中的键对应的值可以用以下方法，假设字典的名字是dict1
 1.dict1[”键名“]
 2.dict1.get（”键名“，”未知“）# get是字典的一个方法，然后如果这个字典中没找到对应的键名和，则返回”未知“，防止了报错的情况的出现
 **字典嵌套取值**
 
```def process_tool_call(tool_call_dict):
   # 输入示例（LLM返回的工具调用数据）
tool_call = {
    "name": "search",  # 工具名称
    "parameters": {"query": "2026年AI Agent最新进展", "top_k": 5},  # 工具参数
    "timeout": 10,  # 超时时间（可选，可能不存在）
    "type": "function"
}

# 函数要求：
# 1. 提取工具名称，若不存在返回默认值"unknown"；
# 2. 提取参数中的query，若不存在返回默认值""；
# 3. 提取timeout，若不存在返回默认值5；
# 4. 返回一个元组：(工具名称, query, timeout)
def process_tool_call(tool_call_dict):
    s=tool_call.get("name","unknown")
    a=tool_call["parameters"].get("query","")
    b=tool_call.get("name","unknown")
    tim3=tool_call.get("timeout","unknown")
    # 请写你的代码
    return s,a,tim3
    return 
    pass

# 测试调用
print(process_tool_call(tool_call))  # 预期输出：('search', '2026年AI Agent最新进展', 10)
print(process_tool_call({"name": "calc", "parameters": {}}))  # 预期输出：('calc', '', 5)
```
这里的parameters是tool_call字典中的一个键，同时他也是一个字典，这就是**嵌套字典**
嵌套字典查询时应该按照如上格式，a=tool_call["parameters"].get("query"," ")
如果没有查询到相应的键，自动返回默认值”“
为了保障不报错，还可以使用嵌套get
tool_call.get("parameters",{}).get("query", "")

取余数和取模是两种不同的运算
比如-7取余3，答案是-1
但是-7取模3，答案是2

AI agent prompt AI智能体提示词
prompt

### python 调用API