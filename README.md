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
