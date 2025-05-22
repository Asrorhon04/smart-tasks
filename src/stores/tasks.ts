import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db, auth } from 'src/firebase';
import { ref as dbRef, onValue, push, remove, update } from 'firebase/database';

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  const isLoading = ref(false);

  function loadTasks() {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Нет пользователя: loadTasks прерван');
      return;
    }
    console.log('✅ [loadTasks] Загружаем задачи для:', user.uid);
    isLoading.value = true;

    const tasksRef = dbRef(db, `tasks/${user.uid}`);
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      tasks.value = data
        ? Object.entries(data as Record<string, Omit<Task, 'id'>>).map(([id, value]) => ({
            id,
            ...value,
          }))
        : [];
      isLoading.value = false;
    });
  }

  async function addTask(title: string) {
    const user = auth.currentUser;
    if (!user) {
      console.warn('Нет пользователя: addTask не выполнен');
      return;
    }
    console.log('✅ [addTask] Добавляем задачу:', title);
    const taskRef = dbRef(db, `tasks/${user.uid}`);
    await push(taskRef, {
      title,
      done: false,
    });
  }

  async function toggleTask(id: string, value: boolean) {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = dbRef(db, `tasks/${user.uid}/${id}`);
    await update(taskRef, { done: value });
  }

  async function deleteTask(id: string) {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = dbRef(db, `tasks/${user.uid}/${id}`);
    await remove(taskRef);
  }

  async function updateTaskTitle(id: string, title: string) {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = dbRef(db, `tasks/${user.uid}/${id}`);
    await update(taskRef, { title });
  }

  return {
    tasks,
    isLoading,
    loadTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTaskTitle,
  };
});
