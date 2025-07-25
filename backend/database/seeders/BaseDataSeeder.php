<?php

namespace Database\Seeders;

use App\Services\Tenancy\TenantService;
use Illuminate\Database\Seeder;

class BaseDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $service = new TenantService();
        $service->createTenant([
            'name' => 'Main',
            'plan' => 'free',
        ]);
    }
}
