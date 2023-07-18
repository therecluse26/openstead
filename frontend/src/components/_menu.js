const menu = [
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
                icon: 'ti ti-bulldozer',
                to: '/projects',
            },
        ],
    },
]

export default menu
