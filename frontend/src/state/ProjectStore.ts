import { create } from 'zustand'
import { Project, ProjectItem, ProjectUser } from '@/types/Project'

interface ProjectState {
    project: Project | null
    projectUsers: ProjectUser[]
    selectedItem: ProjectItem
    modalVisible: boolean
    setProject: (project: Project) => void
    setProjectUsers: (projectUsers: ProjectUser[]) => void
    setSelectedItem: (item: ProjectItem) => void
    setModalVisibility: (visible: boolean) => void
}

export const useProjectStore = create<ProjectState>(set => ({
    // Project
    project: null,
    setProject: (project: Project) => set({ project: project }),

    // Project Users
    projectUsers: [],
    setProjectUsers: (projectUsers: ProjectUser[]) =>
        set({ projectUsers: projectUsers }),

    // Selected item
    selectedItem: {
        id: null,
        title: null,
        description: null,
        status: null,
        assignee: null,
        creator: null,
        due_date: null,
        created_at: null,
        updated_at: null,
    },
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
    setModalVisibility: (visible: boolean) => set({ modalVisible: visible }),
}))
