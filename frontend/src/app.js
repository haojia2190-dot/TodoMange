const { createApp } = Vue;

const API_URL = 'http://localhost:8080/api/todos';
const emptyForm = () => ({
  title: '',
  description: '',
  completed: false,
});

createApp({
  data() {
    return {
      todos: [],
      loading: false,
      saving: false,
      errorMessage: '',
      successMessage: '',
      editingId: null,
      filter: 'all',
      form: emptyForm(),
    };
  },
  computed: {
    editingTodo() {
      return this.todos.find((todo) => todo.id === this.editingId);
    },
    isEditing() {
      return this.editingId !== null;
    },
    filteredTodos() {
      if (this.filter === 'active') {
        return this.todos.filter((todo) => !todo.completed);
      }

      if (this.filter === 'completed') {
        return this.todos.filter((todo) => todo.completed);
      }

      return this.todos;
    },
    summary() {
      const total = this.todos.length;
      const completed = this.todos.filter((todo) => todo.completed).length;
      return {
        total,
        completed,
        active: total - completed,
      };
    },
  },
  mounted() {
    this.loadTodos();
  },
  methods: {
    resetMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    resetForm() {
      this.form = emptyForm();
      this.editingId = null;
    },
    async request(url, options = {}) {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (response.status === 204) {
        return null;
      }

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.message || '请求失败，请稍后重试');
      }

      return body;
    },
    async loadTodos() {
      this.loading = true;
      this.resetMessages();

      try {
        this.todos = await this.request(API_URL);
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },
    async saveTodo() {
      this.resetMessages();

      const title = this.form.title.trim();
      const description = this.form.description.trim();

      if (!title) {
        this.errorMessage = '请输入任务标题';
        return;
      }

      this.saving = true;

      try {
        const payload = {
          title,
          description,
          completed: this.form.completed,
        };
        const url = this.isEditing ? `${API_URL}/${this.editingId}` : API_URL;
        const method = this.isEditing ? 'PUT' : 'POST';
        const savedTodo = await this.request(url, {
          method,
          body: JSON.stringify(payload),
        });

        if (this.isEditing) {
          this.todos = this.todos.map((todo) => (todo.id === savedTodo.id ? savedTodo : todo));
          this.successMessage = '任务已更新';
        } else {
          this.todos = [savedTodo, ...this.todos];
          this.successMessage = '任务已创建';
        }

        this.resetForm();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.saving = false;
      }
    },
    editTodo(todo) {
      this.resetMessages();
      this.editingId = todo.id;
      this.form = {
        title: todo.title,
        description: todo.description || '',
        completed: todo.completed,
      };
    },
    async toggleTodo(todo) {
      this.resetMessages();

      try {
        const updated = await this.request(`${API_URL}/${todo.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: todo.title,
            description: todo.description || '',
            completed: !todo.completed,
          }),
        });
        this.todos = this.todos.map((item) => (item.id === updated.id ? updated : item));
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async deleteTodo(todo) {
      this.resetMessages();

      const confirmed = window.confirm(`确定删除“${todo.title}”？`);
      if (!confirmed) {
        return;
      }

      try {
        await this.request(`${API_URL}/${todo.id}`, { method: 'DELETE' });
        this.todos = this.todos.filter((item) => item.id !== todo.id);

        if (this.editingId === todo.id) {
          this.resetForm();
        }

        this.successMessage = '任务已删除';
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    formatDate(value) {
      if (!value) {
        return '-';
      }

      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(value));
    },
  },
  template: `
    <main class="page-shell">
      <section class="hero-card">
        <div>
          <p class="eyebrow">Spring Boot API · Vue</p>
          <h1>Todo 任务管理</h1>
          <p class="hero-copy">基于后端 <code>/api/todos</code> 接口生成的任务创建、查询、更新与删除页面。</p>
        </div>
        <button class="ghost-button" :disabled="loading" @click="loadTodos">
          {{ loading ? '刷新中...' : '刷新列表' }}
        </button>
      </section>

      <section class="stats-grid" aria-label="任务统计">
        <article class="stat-card">
          <span>全部任务</span>
          <strong>{{ summary.total }}</strong>
        </article>
        <article class="stat-card">
          <span>待完成</span>
          <strong>{{ summary.active }}</strong>
        </article>
        <article class="stat-card">
          <span>已完成</span>
          <strong>{{ summary.completed }}</strong>
        </article>
      </section>

      <section class="content-grid">
        <form class="panel task-form" @submit.prevent="saveTodo">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">{{ isEditing ? '编辑任务' : '新建任务' }}</p>
              <h2>{{ isEditing ? '正在编辑 #' + editingTodo?.id : '添加一个 Todo' }}</h2>
            </div>
            <button v-if="isEditing" class="text-button" type="button" @click="resetForm">取消编辑</button>
          </div>

          <label>
            <span>标题</span>
            <input v-model="form.title" maxlength="100" placeholder="例如：学习 Spring Boot" />
          </label>

          <label>
            <span>描述</span>
            <textarea v-model="form.description" maxlength="500" rows="5" placeholder="补充任务详情（可选）"></textarea>
          </label>

          <label class="checkbox-line">
            <input v-model="form.completed" type="checkbox" />
            <span>标记为已完成</span>
          </label>

          <button class="primary-button" type="submit" :disabled="saving">
            {{ saving ? '保存中...' : isEditing ? '保存修改' : '创建任务' }}
          </button>
        </form>

        <section class="panel task-list-panel">
          <div class="panel-heading list-heading">
            <div>
              <p class="eyebrow">任务列表</p>
              <h2>共 {{ filteredTodos.length }} 条</h2>
            </div>
            <div class="filters" role="group" aria-label="任务筛选">
              <button :class="{ active: filter === 'all' }" type="button" @click="filter = 'all'">全部</button>
              <button :class="{ active: filter === 'active' }" type="button" @click="filter = 'active'">待完成</button>
              <button :class="{ active: filter === 'completed' }" type="button" @click="filter = 'completed'">已完成</button>
            </div>
          </div>

          <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="message success">{{ successMessage }}</p>

          <div v-if="loading" class="empty-state">正在加载任务...</div>
          <div v-else-if="filteredTodos.length === 0" class="empty-state">暂无任务，先创建一个吧。</div>
          <ul v-else class="task-list">
            <li v-for="todo in filteredTodos" :key="todo.id" class="task-item" :class="{ done: todo.completed }">
              <div class="task-main">
                <button class="status-toggle" :aria-label="todo.completed ? '标记为待完成' : '标记为已完成'" @click="toggleTodo(todo)">
                  {{ todo.completed ? '✓' : '' }}
                </button>
                <div>
                  <h3>{{ todo.title }}</h3>
                  <p v-if="todo.description">{{ todo.description }}</p>
                  <p v-else class="muted">暂无描述</p>
                  <div class="meta">
                    <span>ID: {{ todo.id }}</span>
                    <span>创建: {{ formatDate(todo.createdAt) }}</span>
                    <span>更新: {{ formatDate(todo.updatedAt) }}</span>
                  </div>
                </div>
              </div>
              <div class="item-actions">
                <button type="button" @click="editTodo(todo)">编辑</button>
                <button class="danger" type="button" @click="deleteTodo(todo)">删除</button>
              </div>
            </li>
          </ul>
        </section>
      </section>
    </main>
  `,
}).mount('#app');
