interface MenuItem {
    label: string
    icon: string
    to?: string
    permission?: string
    items?: MenuItem[]
}

interface MenuSection {
    items: MenuItem[]
}

const menu: MenuSection[] = [
    {
        items: [
            {
                label: 'Dashboard',
                icon: 'ti ti-dashboard',
                to: '/',
            },
            {
                label: 'Inventory',
                icon: 'ti ti-building-warehouse',
                items: [
                    {
                        label: 'Equipment',
                        icon: 'ti ti-tractor',
                        to: '/inventory/equipment',
                    },
                    {
                        label: 'Livestock',
                        icon: 'ti ti-pig',
                        to: '/inventory/livestock',
                    },
                    {
                        label: 'Pantry',
                        icon: 'ti ti-fridge',
                        to: '/inventory/pantry',
                    },
                    {
                        label: 'Seeds',
                        icon: 'ti ti-seeding',
                        to: '/inventory/seeds',
                    },
                ],
            },
            {
                label: 'Projects',
                icon: 'ti ti-traffic-cone',
                to: '/projects',
            },

            {
                label: 'Users',
                icon: 'ti ti-users',
                to: '/users',
                permission: 'user:list',
            },
        ],
    },
]

export default menu
