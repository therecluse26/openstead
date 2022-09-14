const menu = [
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                to: '/',
            },
        ],
    },

    {
        label: 'Menu Hierarchy',
        icon: 'pi pi-fw pi-search',
        items: [
            {
                label: 'Submenu 1',
                icon: 'pi pi-fw pi-bookmark',
                items: [
                    {
                        label: 'Submenu 1.1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1.1',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Submenu 1.1.2',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Submenu 1.1.3',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                        ],
                    },
                    {
                        label: 'Submenu 1.2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.2.1',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                            {
                                label: 'Submenu 1.2.2',
                                icon: 'pi pi-fw pi-bookmark',
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

export default menu
