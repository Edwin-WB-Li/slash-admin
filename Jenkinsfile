pipeline {
	agent any
	environment {
		NPM_REGISTRY = 'https://registry.npmmirror.com' // 国内镜像加速
    APP_NAME = 'react-admin' // 项目名称
	}
  tools {
    nodejs 'node 20' // 确保与全局配置名称一致
  }
	stages {
		// 阶段1：拉取代码
		stage('Git Check') {
			steps {
				checkout scm // 从GitHub拉取代码
			}
		}
		// 阶段2：安装依赖
		stage('Install Dependencies') {
			steps {
				script {
          sh 'node -v'
          sh 'which npm'      // 检查 npm 是否存在
          sh "npm ci --registry=${NPM_REGISTRY}"
          // sh 'npm ci'
				}
			}
		}
    // 阶段3：格式化 & 代码检查
		stage('Format Code & Lint Code') {
      steps {
        sh 'npm run lint:format'
        // sh 'npm run lint:fix'
      }
		}
		// 阶段4：构建打包项目，并压缩文件
		stage('Build Aplication') {
			steps {
				sh 'npm run build'
        sh "rm -f ${APP_NAME}.zip"  // 新增：清理旧文件
        sh "zip -r ${APP_NAME}.zip . -x 'node_modules/*'"
        // 归档产物（ZIP文件和原始目录）
        archiveArtifacts artifacts: '*.zip', allowEmptyArchive: false
			}
		}
		// 阶段5：运行单元测试
		// stage('Jest Check') {
		// 	steps {
		// 		sh 'npm run test'
		// 		// junit '**/test-results.xml' // 收集测试报告（需配置Jest或JUnit输出）[2](@ref)
    //     // junit 'test-results/junit.xml' // 收集测试报告
    //     // 归档产物（ZIP文件和原始目录）
    //     archiveArtifacts artifacts: 'coverage/lcov-report/index.html', allowEmptyArchive: false
		// 	}
		// }
		// 阶段5：Nginx 部署
		stage('Deploy TO Nginx') {
      steps {
        script {
          def execCommand = """
            # 启用详细日志和错误退出
            set -ex
            # 加载 nvm 环境变量（关键步骤）
            source /root/.nvm/nvm.sh
            # 进入项目目录
            cd /var/www/${APP_NAME} || { echo '目录切换失败'; exit 1; }
            # 解压构建产物
            unzip -o ${APP_NAME}.zip || { echo '解压失败'; exit 1; }
            # 删除 ZIP 文件
            rm -f ${APP_NAME}.zip
            chmod -R 755 .
            # 检查 Nginx 配置 并重启
            nginx -t && systemctl reload nginx
          """
          // source /root/.nvm/nvm.sh
          // npm config set prefix "/root/.nvm/versions/node/v20.10.0"

          // 插件将构建产物部署到远程服务器
          sshPublisher(
            publishers: [
              sshPublisherDesc(
                configName: 'my ssh server',
                transfers: [
                  sshTransfer(
                    // 指定要传输的文件
                    sourceFiles: '*.zip',
                    // 移除文件路径前缀
                    // removePrefix: 'dist',
                    // 远程服务器上的目标目录
                    remoteDirectory: "/${APP_NAME}",
                    // 执行的命令
                    execCommand: execCommand
                  )
                ],
                verbose: true
              )
            ]
          )
        }
      }
		}
	}
	post {
    always {
      script {
        // 发送构建结果通知
        emailext(
          subject: '$DEFAULT_SUBJECT',
          body: '$DEFAULT_CONTENT',
          mimeType: 'text/html',
          to: 'a15277019572@aliyun.com',
          attachmentsPattern: '*.zip, coverage/lcov-report/index.html', // 指定附件路径
          recipientProviders: [
            [$class: 'CulpritsRecipientProvider'],  // 通知代码提交者
            [$class: 'RequesterRecipientProvider']  // 通知触发构建的用户
          ],
          attachLog: true  // 附加构建日志
        )
      }
      // 清理工作空间（可选）
      cleanWs()
    }
	}
}