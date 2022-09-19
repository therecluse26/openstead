const menu = [
    {
        label: 'Home',
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
                        label: 'All Inventory',
                        icon: 'ti ti-building-warehouse',
                        to: '/inventory',
                    },
                ],
            },
        ],
    },
]

export default menu
