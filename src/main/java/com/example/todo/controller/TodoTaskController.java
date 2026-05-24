package com.example.todo.controller;

import com.example.todo.dto.TodoTaskRequest;
import com.example.todo.entity.TodoTask;
import com.example.todo.service.TodoTaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoTaskController {

    private final TodoTaskService todoTaskService;

    public TodoTaskController(TodoTaskService todoTaskService) {
        this.todoTaskService = todoTaskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TodoTask create(@Valid @RequestBody TodoTaskRequest request) {
        return todoTaskService.createTask(request);
    }

    @GetMapping
    public List<TodoTask> findAll() {
        return todoTaskService.findAllTasks();
    }

    @GetMapping("/{id}")
    public TodoTask findById(@PathVariable Long id) {
        return todoTaskService.findTaskById(id);
    }

    @PutMapping("/{id}")
    public TodoTask update(@PathVariable Long id, @Valid @RequestBody TodoTaskRequest request) {
        return todoTaskService.updateTask(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        todoTaskService.deleteTask(id);
    }
}
