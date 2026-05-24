package com.example.todo.service;

import com.example.todo.dto.TodoTaskRequest;
import com.example.todo.entity.TodoTask;

import java.util.List;

public interface TodoTaskService {
    TodoTask createTask(TodoTaskRequest request);

    List<TodoTask> findAllTasks();

    TodoTask findTaskById(Long id);

    TodoTask updateTask(Long id, TodoTaskRequest request);

    void deleteTask(Long id);
}
