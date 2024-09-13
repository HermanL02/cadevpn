   # 使用Node.js官方镜像作为基础镜像
   FROM node:latest

   # 设置工作目录
   WORKDIR /usr/src/app

   # 复制package.json和package-lock.json文件
   COPY package*.json ./

   # 安装项目依赖
   RUN npm install

   # 复制所有源代码到工作目录
   COPY . .

   # 应用程序监听的端口
   EXPOSE 3001

   # 启动应用程序
   CMD ["node", "index.js"]