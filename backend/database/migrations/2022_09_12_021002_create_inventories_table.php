<?php

use App\Enums\HardinessZone;
use App\Enums\KitchenUnit;
use App\Enums\PantryStorageType;
use App\Enums\PlantLifeCycle;
use App\Enums\PlantLightRequirement;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('locations', function (Blueprint $table) {
			$table->ulid('id')->primary();
			$table->string('tenant_id')->index();
			$table->boolean('primary')->default(false);
			$table->string('name', 100);
			$table->string('description', 255)->nullable();
			$table->string('address1', 100);
			$table->string('address2', 100)->nullable();
			$table->string('city', 50);
			$table->string('state', 2);
			$table->string('zip', 10);
			$table->string('country', 3);
			$table->timestamps();
		});

		Schema::create('varieties', function (Blueprint $table) {
			$table->ulid('id')->primary();
			$table->enum('group', ['plant', 'animal', 'edible']);
			$table->string('group_type', 50);
			$table->string('variety_name', 50);
			$table->string('description', 1000);
			$table->timestamps();

			$table->index('variety_name');
		});

		Schema::create('livestock', function (Blueprint $table) {
			$table->ulid('id')->primary();
			$table->string('tenant_id')->index();
			$table->string('name', 255);
			$table->string('description', 1000)->nullable();
			$table->enum('sex', ['male', 'female'])->nullable();
			$table->dateTime('date_of_birth')->nullable();
			$table->dateTime('date_of_death')->nullable();
			$table->ulid('variety_id')->nullable();
			$table->ulid('quantity')->default(1);
			$table->dateTime('acquired_at')->nullable();
			$table->timestamps();

			$table->index('name');
			$table->index('variety_id');

			$table->foreign('variety_id')->references('id')->on('varieties')->nullOnDelete();
			$table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
		});

		Schema::create('livestock_parents', function (Blueprint $table) {
            $table->ulid('id')->primary();
			$table->ulid('livestock_id');
			$table->ulid('parent_id');

			$table->index('livestock_id');
			$table->index('parent_id');
			$table->foreign('livestock_id')->references('id')->on('livestock')->onDelete('cascade');
			$table->foreign('parent_id')->references('id')->on('livestock')->onDelete('cascade');
		});

		Schema::create('seeds', function (Blueprint $table) {
			$table->ulid('id')->primary();
			$table->string('tenant_id')->index();
			$table->ulid('variety_id')->nullable();
			$table->unsignedInteger('quantity')->default(1);
			$table->enum('life_cycle', collect(PlantLifeCycle::cases())->map(function ($case) {
				return $case->value;
			})->toArray())->default(PlantLifeCycle::Annual->value);
			$table->unsignedSmallInteger('days_to_germination')->nullable();
			$table->unsignedSmallInteger('days_to_maturity')->nullable();
			$table->unsignedFloat('planting_depth')->nullable();
			$table->unsignedSmallInteger('plant_spacing')->nullable();
			$table->enum('light_requirement', collect(PlantLightRequirement::cases())->map(function ($case) {
				return $case->value;
			})->toArray())->nullable();
			$table->enum('zone_lower', collect(HardinessZone::cases())->map(function ($case) {
				return $case->value;
			})->toArray())->nullable();
			$table->enum('zone_upper', collect(HardinessZone::cases())->map(function ($case) {
				return $case->value;
			})->toArray())->nullable();
			$table->string('url', 2000)->nullable();
			$table->dateTime('acquired_at')->nullable();
			$table->timestamps();

			$table->index('variety_id');
			$table->foreign('variety_id')->references('id')->on('varieties')->nullOnDelete();
			$table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
		});

		Schema::create('equipment', function (Blueprint $table) {
			$table->ulid('id')->primary();
			$table->string('tenant_id')->index();
			$table->string('name', 255);
			$table->string('type', 50);
			$table->unsignedTinyInteger('condition')->nullable();
			$table->unsignedTinyInteger('rating')->nullable();
			$table->string('description', 1000)->nullable();
			$table->string('url', 2000)->nullable();
			$table->unsignedInteger('quantity')->default(1);
			$table->dateTime('acquired_at')->nullable();
			$table->timestamps();

			$table->index('name');
			$table->index('type');

			$table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
		});

		Schema::create('pantry_items', function (Blueprint $table) {
			$table->ulid('id')->primary();
			$table->string('tenant_id')->index();
			$table->string('name', 255);
			$table->string('description', 1000)->nullable();
			$table->enum('storage_type', collect(PantryStorageType::cases())->map(function ($case) {
				return $case->value;
			})->toArray())->nullable();
			$table->ulid('variety_id')->nullable();
			$table->enum('unit', collect(KitchenUnit::cases())->map(function ($case) {
				return $case->value;
			})->toArray())->nullable();
			$table->float('unit_amount')->nullable();
			$table->unsignedInteger('quantity')->default(1);
			$table->unsignedInteger('shelf_life_months')->nullable();
			$table->dateTime('expiration_date')->nullable();
			$table->timestamps();

			$table->index('name');
			$table->index('variety_id');
			$table->foreign('variety_id')->references('id')->on('varieties')->nullOnDelete();
			$table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
		});

		Schema::create('services', function (Blueprint $table) {
			$table->ulid('id')->primary();
			$table->string('tenant_id')->index();
			$table->string('type', 20)->default('other');
			$table->string('title', 100);
			$table->string('description', 1000);
			$table->timestamps();

			$table->index('type');
			$table->index('title');
			$table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
		});

		Schema::create('service_logs', function (Blueprint $table) {
			$table->ulid('id')->primary();
			$table->string('tenant_id')->index();
			$table->ulidMorphs('serviceable');
			$table->ulid('service_id')->nullable();
			$table->string('notes', 2000);
			$table->dateTime('service_date');
			$table->timestamps();

			$table->index('service_id');
			$table->foreign('service_id')->references('id')->on('services')->nullOnDelete();
			$table->index('serviceable_id');
			$table->index('serviceable_type');
			$table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
		});

		Schema::create('notes', function (Blueprint $table) {
			$table->ulid('id')->primary();
			$table->string('tenant_id')->index();
			$table->ulidMorphs('notable');
			$table->ulid('creator_id')->nullable();
			$table->text('note');
			$table->timestamps();

			$table->index('creator_id');
			$table->index('notable_id');
			$table->index('notable_type');
			$table->foreign('creator_id')->references('id')->on('users')->nullOnDelete();
			$table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('notes');
		Schema::dropIfExists('livestock');
		Schema::dropIfExists('equipment');
		Schema::dropIfExists('seeds');
		Schema::dropIfExists('locations');
		Schema::dropIfExists('service_logs');
		Schema::dropIfExists('services');
		Schema::dropIfExists('varieties');
	}
};
