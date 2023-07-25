import { create } from 'zustand'

export const useProjectStore = create(set => ({
    // Project
    project: null,
    setProject: project => set({ project: project }),

    // Selected item
    selectedItem: { id: null, name: null, description: null, status: null },
    modalVisible: false,
    setSelectedItem: ({
        id,
        title,
        description,
        status,
        assignee,
        creator,
        due_date,
        created_at,
        updated_at,
    }) =>
        set({
            selectedItem: {
                id,
                title,
                description,
                status,
                assignee,
                creator,
                due_date,
                created_at,
                updated_at,
            },
        }),
    setModalVisibility: visible => set({ modalVisible: visible }),
}))
