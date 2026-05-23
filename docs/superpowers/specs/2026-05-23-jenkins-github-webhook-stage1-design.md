# Jenkins GitHub Webhook Stage 1 Design

## 结论

阶段 1 先完成最小闭环验证：从 GitHub private repository push 代码后，通过 GitHub webhook 调用 ngrok 公网地址，再转发到 Jenkins，最后 Jenkins 拉取仓库并执行最小 `Jenkinsfile`。

这个阶段不引入 React、Vite、Playwright、Docker 镜像构建和部署。先把触发链路跑通，后续 CI/CD 阶段出错时才能明确问题发生在代码、测试、构建、Docker 还是部署环节。

## 背景

当前仓库是 `Prectie/demo-project`，本地路径是 `/mnt/d/GitHubRepository/demo-project`。仓库是 private repository，Jenkins 需要使用 GitHub credential 拉取代码。

Jenkins 已部署在用户自己的虚拟机上，并且通过 ngrok 暴露公网入口：

```text
https://dexterity-reconcile-cresting.ngrok-free.dev
```

GitHub webhook 应请求 Jenkins 的固定 webhook endpoint：

```text
https://dexterity-reconcile-cresting.ngrok-free.dev/github-webhook/
```

Jenkins 使用系统用户 `jenkins` 运行。该用户已经加入 `docker` group，并且可以执行 `docker ps`。这说明后续阶段可以让 Jenkins 执行 Docker 构建和容器部署命令。

## 阶段 1 目标

完成并验证这条链路：

```text
git push
-> GitHub push event
-> GitHub webhook
-> ngrok
-> Jenkins /github-webhook/
-> Jenkins Pipeline job
-> checkout private GitHub repository
-> run Jenkinsfile
-> build SUCCESS
```

阶段 1 的成功标准是：

```text
1. 用户 push 一次提交到 GitHub。
2. Jenkins job 自动开始构建，不需要手动点击 Build Now。
3. Jenkins Console Output 中能看到 whoami、git --version、docker --version、docker ps 的输出。
4. Jenkins 构建结果为 SUCCESS。
```

## 不在阶段 1 范围内

阶段 1 不做这些事情：

```text
1. 不创建 React + Vite 应用。
2. 不配置 Playwright UI test。
3. 不写 Dockerfile。
4. 不构建 Docker image。
5. 不部署 test/prod container。
6. 不做人工审批、健康检查和监控。
```

这些内容放到阶段 2 及之后实现。

## Jenkins Job 设计

使用 Jenkins Pipeline job，job 名建议为：

```text
demo-project-pipeline
```

Jenkins job 配置如下：

```text
Definition: Pipeline script from SCM
SCM: Git
Repository URL: https://github.com/Prectie/demo-project.git
Credentials: github-prectie-demo-project-read
Branch Specifier: */main
Script Path: Jenkinsfile
Build Triggers: GitHub hook trigger for GITScm polling
```

`github-prectie-demo-project-read` 是 Jenkins 中保存的 GitHub credential。它使用 GitHub Personal Access Token 作为 password，并至少具备 `Prectie/demo-project` 仓库的 `Contents: Read-only` 权限。

## GitHub Webhook 设计

GitHub repository webhook 配置如下：

```text
Payload URL: https://dexterity-reconcile-cresting.ngrok-free.dev/github-webhook/
Content type: application/json
Secret: 阶段 1 可暂不配置；后续安全加固时再配置
SSL verification: Enable SSL verification
Events: Just the push event
Active: checked
```

阶段 1 只监听 push event。这样每次用户 push 到 GitHub 后，GitHub 会通知 Jenkins 检查并构建该仓库。

## 最小 Jenkinsfile 设计

阶段 1 的 `Jenkinsfile` 只负责验证 Jenkins 执行环境：

```groovy
pipeline {
  agent any

  stages {
    stage('Webhook Trigger Check') {
      steps {
        sh '''
          echo "GitHub webhook triggered Jenkins successfully"
          whoami
          git --version
          docker --version
          docker ps
        '''
      }
    }
  }
}
```

这些命令的意义：

```text
whoami             确认 Jenkins job 实际由哪个 Linux 用户执行，通常应为 jenkins。
git --version      确认 Jenkins 节点能使用 Git。
docker --version   确认 Jenkins 节点能找到 Docker CLI。
docker ps          确认 Jenkins 用户有权限连接 Docker daemon。
```

## 安全边界

ngrok 会把 Jenkins 暴露到公网。阶段 1 要满足这些基本安全条件：

```text
1. Jenkins 不允许匿名用户拥有管理权限。
2. Jenkins 管理员账号使用强密码。
3. GitHub token 不写入仓库，只保存在 Jenkins Credentials。
4. ngrok tunnel 只在学习和调试时开启。
```

当前阶段可以暂不配置 webhook secret，因为目标是先跑通链路。后续稳定后应补充 webhook secret，避免 Jenkins endpoint 被无关请求触发。

## 后续阶段

阶段 1 通过后，再进入阶段 2：

```text
1. 创建 React + Vite 示例网页。
2. 添加 ESLint、单元测试和 Playwright UI test。
3. 添加 Dockerfile 和 nginx 静态资源部署。
4. Jenkins 执行 lint/test/build/docker build。
5. 部署 test container 到 18080 端口。
6. 运行 smoke test 和 health check。
7. 添加 manual approval。
8. 部署 prod container 到 18081 端口。
9. 输出制品、镜像 tag、部署地址和验证结果。
```
