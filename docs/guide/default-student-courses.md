# 默认我学的课

将其改为我学的课

![](/images/default-student-courses/Pasted%20image%2020251230155050.png)

## 教程

### 提示词

```
在课程列表中查看课程，默认进入的是我教的课，而不是我学的课，这是为什么？
怎样让它默认进入我学的课？提示：文字显示在资源中，dex中没有文字，
可以搜索course_study_list定位我学的课
```

### 反馈

在 CourseListViewModel 的构造函数中，默认 Tab 值被硬编码为 1，对应的是"我教的课"。

## 修改

这里使用的是另一个修改方案，供参考。定位类

```
com/chaoxing/mobile/course/viewmodel/CourseListViewModel
```

找到其中返回 int 的方法

![](/images/default-student-courses/Pasted%20image%2020251230155202.png)

于是进入类

```
com.chaoxing.mobile.course.ui.MyCourseFragment
```

搜索 RadioButton，让它走下面这个分支

![](/images/default-student-courses/Pasted%20image%2020251230155339.png)

原理未知，没有用 AI 前试出来的，希望以后可以在设置中修改吧。
