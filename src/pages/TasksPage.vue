<template>
  <q-page class="q-pa-md">
    <!-- Добавление задачи -->
    <q-form @submit.prevent="handleAdd" class="row items-center q-gutter-sm q-mb-md">
      <q-input
        v-model="newTask"
        placeholder="Новая задача"
        outlined
        dense
        input-class="text-body1"
        class="col"
        color="grey-8"
      />
      <q-btn
        label="Добавить"
        type="submit"
        color="grey-9"
        no-caps
        unelevated
        dense
        class="col-auto add-btn"
      />
    </q-form>
    <!-- ФИЛЬТРЫ В ОДНОЙ СТРОКЕ -->
    <div class="row q-col-gutter-sm q-mb-md">
      <!-- Поиск -->
      <div class="col-xs-12 col-sm-3">
        <q-input
          v-model="search"
          placeholder="Поиск задач..."
          outlined
          dense
          debounce="300"
          color="grey-8"
          clearable
          prefix="🔍"
        />
      </div>
      <!-- A–Я -->
      <div class="col-xs-12 col-sm-3">
        <q-select
          v-model="sortAlpha"
          label="A → Я"
          dense
          outlined
          emit-value
          map-options
          :options="[
            { label: 'Нет', value: 'none' },
            { label: 'A → Я', value: 'az' },
            { label: 'Я → A', value: 'za' }
          ]"
        />
      </div>

      <!-- По дате -->
      <div class="col-xs-12 col-sm-3">
        <q-select
          v-model="sortDate"
          label="По дате"
          dense
          outlined
          emit-value
          map-options
          :options="[
            { label: 'Нет', value: 'none' },
            { label: 'Новые сверху', value: 'new' },
            { label: 'Старые сверху', value: 'old' }
          ]"
        />
      </div>

      <!-- Статус -->
      <div class="col-xs-12 col-sm-3">
        <q-select
          v-model="filterStatus"
          label="Статус"
          dense
          outlined
          emit-value
          map-options
          :options="[
            { label: 'Все', value: 'all' },
            { label: 'Активные', value: 'active' },
            { label: 'Завершённые', value: 'done' }
          ]"
        />
      </div>
      <div class="row items-center q-mb-md">
        <!-- СЧЁТЧИК -->
        <div class="col text-caption text-grey-7">
          Всего: {{ totalTasks }} • Завершено: {{ doneTasks }}
        </div>

        <!-- КНОПКА СБРОСА -->
        <div class="col-auto">
          <q-btn
            label="Сбросить фильтры"
            dense
            flat
            icon="restart_alt"
            color="grey-7"
            @click="resetFilters"
          />
        </div>
      </div>
    </div>

    <!-- Список задач -->
    <div class="q-gutter-md">
      <template v-if="isLoading">
        <div class="task-grid-item" v-for="n in 6" :key="'skeleton-' + n">
          <q-card class="q-pa-md task-card">
            <q-skeleton type="QCheckbox" />
            <q-skeleton type="text" class="q-mt-sm" />
          </q-card>
        </div>
      </template>

      <transition-group
        v-else
        name="fade"
        tag="div"
        class="task-grid"
        appear
      >
        <div
          class="task-grid-item"
          v-for="task in filteredTasks"
          :key="task.id"
        >
          <q-card
            :class="[task.done ? 'bg-grey-3 text-grey-8' : 'bg-white text-black', 'task-card']"
            class="q-pa-sm"
          >
            <div class="column justify-between items-center full-height">
              <div class="row items-center no-wrap">
                <q-checkbox
                  v-model="task.done"
                  @update:model-value="val => store.toggleTask(task.id, val)"
                  size="sm"
                  class="q-mr-sm"
                />
                <span
                  class="task-title cursor-pointer"
                  @click="openEditDialog(task)"
                  :class="{ 'text-strike': task.done }"
                >
                  {{ task.title }}
                </span>
              </div>
              <div class="row justify-end">
                <q-btn flat icon="delete" color="negative" size="md" @click="store.deleteTask(task.id)" />
              </div>
            </div>
          </q-card>
        </div>
      </transition-group>
    </div>

    <!-- Диалог редактирования -->
    <q-dialog v-model="isEditDialogOpen">
      <q-card style="min-width: 500px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Редактировать задачу</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="editedTitle"
            label="Новое название"
            autofocus
            outlined
            dense
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="grey" @click="closeEditDialog" />
          <q-btn flat label="Сохранить" color="primary" @click="saveEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTasksStore } from 'src/stores/tasks';
import type { Task } from 'src/stores/tasks';

const store = useTasksStore();
const newTask = ref('');
const search = ref('');
const editingTask = ref<Task | null>(null);
const editedTitle = ref('');
const isLoading = computed(() => store.isLoading);
const filterStatus = ref<'all' | 'active' | 'done'>('all');
const sortAlpha = ref<'none' | 'az' | 'za'>('none');
const sortDate = ref<'none' | 'new' | 'old'>('none');
const totalTasks = computed(() => store.tasks.length);
const doneTasks = computed(() => store.tasks.filter(t => t.done).length);

const isEditDialogOpen = computed({
  get: () => !!editingTask.value,
  set: (val: boolean) => {
    if (!val) closeEditDialog();
  }
});

const openEditDialog = (task: Task) => {
  editingTask.value = { ...task };
  editedTitle.value = task.title;
};

const closeEditDialog = () => {
  editingTask.value = null;
  editedTitle.value = '';
};

const saveEdit = async () => {
  if (!editingTask.value) return;
  await store.updateTaskTitle(editingTask.value.id, editedTitle.value);
  closeEditDialog();
};

const handleAdd = async () => {
  if (!newTask.value.trim()) return;
  await store.addTask(newTask.value.trim());
  newTask.value = '';
};

const filteredTasks = computed(() => {
  const term = search.value.trim().toLowerCase();

  let result = store.tasks.filter(task => {
    const matchesStatus =
      filterStatus.value === 'all' ||
      (filterStatus.value === 'active' && !task.done) ||
      (filterStatus.value === 'done' && task.done);

    const matchesSearch = task.title.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  // Сортировка по алфавиту
  if (sortAlpha.value === 'az') {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortAlpha.value === 'za') {
    result = [...result].sort((a, b) => b.title.localeCompare(a.title));
  }

  // Сортировка по дате (по ID — если нет createdAt)
  if (sortDate.value === 'new') {
    result = [...result].sort((a, b) => (b.id > a.id ? 1 : -1));
  } else if (sortDate.value === 'old') {
    result = [...result].sort((a, b) => (a.id > b.id ? 1 : -1));
  }

  return result;
});

const resetFilters = () => {
  filterStatus.value = 'all';
  sortAlpha.value = 'none';
  sortDate.value = 'none';
  search.value = '';
};

onMounted(() => {
  store.loadTasks();
});
</script>

<style scoped>
  .add-btn {
    min-width: 100px;
    font-size: 17px;
  }

  .text-strike {
    text-decoration: line-through;
    color: #888;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  .task-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px; /* отступы между карточками */
  }

  .task-grid-item {
    width: 100%;
  }

  .task-card {
    height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }

  .task-title {
    max-height: 72px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    word-break: break-word;
  }
</style>
