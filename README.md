# Todo 任务管理系统（Spring Boot + MySQL）

一个简单的 Todo CRUD 后端项目，支持创建、查看、更新、删除任务。

## 技术栈

- Java 17
- Spring Boot 3
- Spring Data JPA
- MySQL
- Maven

## 快速启动

1. 创建 MySQL 数据库：

```sql
CREATE DATABASE todo_db DEFAULT CHARACTER SET utf8mb4;
```

2. 修改 `src/main/resources/application.yml` 中数据库账号密码。
3. 启动项目：

```bash
mvn spring-boot:run
```



## 前端页面（Vue）

项目已在 `frontend/` 目录提供基于 Vue 3 的 Todo 管理页面，覆盖后端接口的创建、查询、更新、删除能力。

启动前端页面：

```bash
cd frontend
python3 -m http.server 5173
```

访问 `http://localhost:5173`。页面默认请求 `http://localhost:8080/api/todos`，因此请先启动 Spring Boot 后端。

## 项目结构（分层）

- controller：对外提供 REST 接口
- service：定义业务接口
- service.impl：实现具体业务逻辑
- repository：数据访问层
- entity/dto：实体与请求参数对象

## API

- `POST /api/todos` 创建任务
- `GET /api/todos` 查询全部任务
- `GET /api/todos/{id}` 查询单个任务
- `PUT /api/todos/{id}` 更新任务
- `DELETE /api/todos/{id}` 删除任务

### 创建任务示例

```json
{
  "title": "学习 Spring Boot",
  "description": "完成 Todo 项目",
  "completed": false
}
```
