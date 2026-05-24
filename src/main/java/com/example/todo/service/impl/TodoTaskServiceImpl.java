package com.example.todo.service.impl;

import com.example.todo.dto.TodoTaskRequest;
import com.example.todo.entity.TodoTask;
import com.example.todo.repository.TodoTaskRepository;
import com.example.todo.service.TodoTaskService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoTaskServiceImpl implements TodoTaskService {

    private final TodoTaskRepository todoTaskRepository;

    public TodoTaskServiceImpl(TodoTaskRepository todoTaskRepository) {
        this.todoTaskRepository = todoTaskRepository;
    }

    @Override
    public TodoTask createTask(TodoTaskRequest request) {
        TodoTask task = new TodoTask();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCompleted(Boolean.TRUE.equals(request.getCompleted()));
        return todoTaskRepository.save(task);
    }

    @Override
    public List<TodoTask> findAllTasks() {
        return todoTaskRepository.findAll();
    }

    @Override
    public TodoTask findTaskById(Long id) {
        return todoTaskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在: " + id));
    }

    @Override
    public TodoTask updateTask(Long id, TodoTaskRequest request) {
        TodoTask existing = findTaskById(id);
        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setCompleted(Boolean.TRUE.equals(request.getCompleted()));
        return todoTaskRepository.save(existing);
    }

    @Override
    public void deleteTask(Long id) {
        TodoTask existing = findTaskById(id);
        todoTaskRepository.delete(existing);
    }
}
