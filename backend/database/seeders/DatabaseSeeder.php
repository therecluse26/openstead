<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use PHPUnit\Util\Test;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
	    $this->call([
		    BaseDataSeeder::class,
	    ]);

		if(app()->environment('test', 'testing') || env('SEED_TEST_DATA')){
			$this->call([
				TestDataSeeder::class,
			]);
		}
    }
}
