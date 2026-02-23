<script setup>
import { retrieveLaunchParams, notification, popup, on } from "@vbotma/sdk";
import { setupTheme } from "./setupTheme";
import { ref, onMounted, watch, onUnmounted } from "vue";

console.log(retrieveLaunchParams());
const newTask = ref("");
const tasks = ref([]);
const themeListener = ref(null);

const addTask = () => {
  if (newTask.value.trim() === "") return;

  tasks.value.unshift({
    // Thêm vào đầu danh sách để dễ thấy
    id: Date.now(),
    content: newTask.value,
    done: false,
  });

  if (notification.isSupported()) {
    notification.send({
      title: "Thành công",
      message: "Đã thêm công việc mới!",
    });
  }

  newTask.value = "";
};

const removeTask = async (index) => {
  if (popup.isSupported()) {
    try {
      const button_id = await popup.show({
        title: "Xác nhận",
        message: "Bạn có chắc chắn muốn xoá task này không?",
        buttons: [
          { id: "confirm-btn", type: "destructive", text: "Xoá" },
          { id: "cancel-btn", type: "cancel", text: "Huỷ" },
        ],
      });

      if (button_id == "confirm-btn") {
        tasks.value.splice(index, 1);
        notification.send({
          title: "Đã xoá",
          message: "Task đã được loại bỏ",
        });
      }
    } catch (error) {
      console.error("Lỗi popup", error);
    }
  }
};

onMounted(() => {
  const savedTasks = localStorage.getItem("vue-todo-list");
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }

  themeListener.value = on("theme_changed", () => {
    setupTheme();
  });
});

watch(
  tasks,
  (newVal) => {
    localStorage.setItem("vue-todo-list", JSON.stringify(newVal));
  },
  { deep: true },
);

onUnmounted(() => {
  if (themeListener.value) themeListener.value();
});
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>✨ My Tasks</h1>
      <p class="subtitle">
        {{ tasks.filter((t) => !t.done).length }} việc cần hoàn thành
      </p>
    </header>

    <div class="input-section">
      <input
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Việc gì cần làm hôm nay?..."
        type="text"
      />
      <button @click="addTask" :disabled="!newTask.trim()">
        <span class="icon">＋</span>
      </button>
    </div>

    <div class="list-container">
      <TransitionGroup name="list" tag="ul" v-if="tasks.length > 0">
        <li
          v-for="(task, index) in tasks"
          :key="task.id"
          :class="{ 'is-done': task.done }"
          class="task-item"
        >
          <div class="task-content">
            <input
              type="checkbox"
              :id="'task-' + task.id"
              v-model="task.done"
            />
            <label :for="'task-' + task.id" class="task-text">
              {{ task.content }}
            </label>
          </div>
          <button class="delete-btn" @click="removeTask(index)" title="Xoá">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
            </svg>
          </button>
        </li>
      </TransitionGroup>

      <div v-else class="empty-state">
        <div class="empty-icon">🏖️</div>
        <p>Thảnh thơi quá! Hãy thêm việc cần làm nhé.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container chính */
.app-container {
  margin: 0 auto;
  color: var(--text-color);
  transition: all 0.3s ease;
  height: 100%;
}

/* Header */
.header {
  text-align: left;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.subtitle {
  opacity: 0.6;
  font-size: 0.9rem;
}

/* Input Section */
.input-section {
  display: flex;
  gap: 12px;
  background: var(--secondary-bg-color);
  padding: 8px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.input-section input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 16px;
  color: var(--text-color);
  font-size: 1rem;
  outline: none;
}

.input-section button {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--accent-color);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.input-section button:hover:not(:disabled) {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.input-section button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Task List */
.list-container {
  position: relative;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--secondary-bg-color);
  padding: 16px;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  border-color: var(--accent-color);
}

.task-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

/* Custom Checkbox */
input[type="checkbox"] {
  width: 22px;
  height: 22px;
  accent-color: var(--accent-color);
  cursor: pointer;
}

.task-text {
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  word-break: break-word;
}

.is-done .task-text {
  text-decoration: line-through;
  opacity: 0.5;
}

/* Delete Button */
.delete-btn {
  background: transparent;
  border: none;
  color: #ff4d4f;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: rgba(255, 77, 79, 0.1);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 0;
  opacity: 0.5;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
