import { getTodoGroupedByColumn } from "@/app/lib/getTodoGroupedByColumns";
import uploadImage from "@/app/lib/uploadImage";
import { ID, databases, storage } from "@/appwrite";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;

  newTaskInput: string;
  setNewTaskInput: (input: string) => void;

  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  setNewtaskType: (columnId: TypedColumn) => void;
  newTaskType: TypedColumn;

  image: File | null;
  setImage: (image: File | null) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getTodoGroupedByColumn();
    set({ board });
  },
  setBoardState: (board) => set({ board }),

  newTaskInput: "",
  setNewTaskInput: (input) => set({ newTaskInput: input }),

  updateTodoInDB: async (todo, columnId) => {
    try {
      console.log("Updating todo:", todo);
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
        todo.$id,
        {
          title: todo.title,
          status: columnId,
        }
      );

      console.log("Todo updated successfully.");
    } catch (error: any) {
      console.error("Error updating todo:", error);
      if (error.response) {
        console.error("Appwrite API Response:", error.response.data);
      }
    }
  },

  deleteTask: async (taskIndex, todo, id) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
      todo.$id
    );
  },

  searchString: "",
  setSearchString: (searchString) => set({ searchString }),

  newTaskType: "todo",
  setNewtaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

  image: null,
  setImage: (image) => set({ image }),

  addTask: async (todo, columnId, image?) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODO_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));
