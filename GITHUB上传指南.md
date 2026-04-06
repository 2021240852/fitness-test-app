# GitHub 仓库上传指南

## 方法一：使用 GitHub 网页上传（最简单，无需命令行）

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com
2. 登录您的账号（没有就注册一个）
3. 点击右上角 **+** → **New repository**
4. 填写信息：
   - Repository name: `fitness-test-app`（或您喜欢的名字）
   - Description: `八年级国家体质健康测试小程序`
   - 选择 **Public**（公开）或 **Private**（私有）
   - 勾选 **Add a README file**
   - 点击 **Create repository**

### 步骤 2：下载并解压项目

1. 下载 `fitness-test-github.zip`
2. 解压到电脑上的某个文件夹

### 步骤 3：上传文件

1. 在新创建的 GitHub 仓库页面，点击 **Add file** → **Upload files**
2. 将解压后的所有文件和文件夹拖到上传区域
   - 包括：android/、resources/、src/、dist/ 等所有文件
3. 等待上传完成
4. 点击 **Commit changes**

### 步骤 4：启用自动构建

上传完成后，GitHub Actions 会自动运行，构建 APK：

1. 点击仓库顶部的 **Actions** 标签
2. 您会看到 "Build Android APK" 工作流正在运行
3. 等待约 5-10 分钟
4. 构建完成后，点击工作流名称
5. 在页面底部 **Artifacts** 区域下载 APK 文件

---

## 方法二：使用 Git 命令行上传

### 步骤 1：安装 Git

- Windows: https://git-scm.com/download/win
- Mac: `brew install git`
- Linux: `sudo apt install git`

### 步骤 2：配置 Git

```bash
git config --global user.name "您的名字"
git config --global user.email "您的邮箱@example.com"
```

### 步骤 3：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库名称，点击 **Create repository**
3. **不要**勾选 "Initialize this repository with a README"

### 步骤 4：本地初始化并上传

```bash
# 进入项目文件夹
cd fitness-test-app

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 体质健康测试小程序"

# 关联远程仓库（将下面的URL替换为您的仓库地址）
git remote add origin https://github.com/您的用户名/仓库名.git

# 推送到 GitHub
git push -u origin main
```

---

## 方法三：使用 GitHub Desktop（图形界面）

### 步骤 1：下载 GitHub Desktop

访问 https://desktop.github.com 下载安装

### 步骤 2：添加本地仓库

1. 打开 GitHub Desktop
2. 点击 **File** → **Add local repository**
3. 选择解压后的项目文件夹
4. 点击 **Add repository**

### 步骤 3：发布到 GitHub

1. 点击 **Publish repository**
2. 填写仓库名称
3. 点击 **Publish repository**

---

## 获取 APK 文件

上传代码后，GitHub Actions 会自动构建 APK：

1. 打开您的 GitHub 仓库
2. 点击 **Actions** 标签
3. 点击最新的工作流运行记录
4. 滚动到页面底部 **Artifacts** 区域
5. 点击下载：
   - `app-debug` - 调试版本（推荐测试用）
   - `app-release` - 发布版本（需要签名）

### 安装到手机

1. 下载 APK 文件到电脑
2. 用 USB 线或微信/QQ 传到手机
3. 在手机上点击 APK 文件安装
4. 如果提示"未知来源"，请在设置中允许安装

---

## 仓库地址示例

上传成功后，您的仓库地址会是：
```
https://github.com/您的用户名/fitness-test-app
```

---

## 常见问题

### Q: 上传时提示文件太大？
A: GitHub 单个文件限制 100MB，如果超出请删除 `node_modules` 文件夹后再上传

### Q: Actions 构建失败？
A: 检查 `.github/workflows/build-android.yml` 文件是否存在

### Q: 如何更新代码？
A: 修改文件后重新上传，或提交新的 commit

---

## 需要帮助？

- GitHub 官方文档：https://docs.github.com/cn
- Git 教程：https://www.liaoxuefeng.com/wiki/896043488029600
