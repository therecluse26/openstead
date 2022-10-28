<?php

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
			$table->id();
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
			$table->id();
			$table->enum('kingdom', ['plant', 'animal']);
			$table->string('group_type', 50);
			$table->string('variety_name', 50);
			$table->string('description', 1000);
			$table->timestamps();

			$table->index('variety_name');
		});

		Schema::create('livestock', function (Blueprint $table) {
			$table->id();
			$table->string('name', 255);
			$table->enum('sex', ['male', 'female'])->nullable();
			$table->dateTime('date_of_birth')->nullable();
			$table->unsignedBigInteger('variety_id');
			$table->integer('quantity')->default(1);
			$table->dateTime('acquired_at')->nullable();
			$table->timestamps();

			$table->index('name');
			$table->index('variety_id');
		});

		Schema::create('livestock_parents', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('livestock_id');
			$table->unsignedBigInteger('parent_id');
			$table->enum('relationship', ['mother', 'father']);
		});

		Schema::create('seeds', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('variety_id');
			$table->integer('quantity')->default(1);
			$table->dateTime('acquired_at')->nullable();
			$table->timestamps();

			$table->index('variety_id');
		});

		Schema::create('equipment', function (Blueprint $table) {
			$table->id();
			$table->string('name', 255);
			$table->string('type', 50);
			$table->integer('condition');
			$table->string('description')->nullable();
			$table->string('url', 2000)->nullable();
			$table->integer('quantity')->default(1);
			$table->dateTime('acquired_at')->nullable();
			$table->timestamps();

			$table->index(['name', 'type']);

		});

		Schema::create('services', function (Blueprint $table) {
			$table->id();
			$table->string('type', 20)->default('other');
			$table->string('title', 100);
			$table->string('description', 1000);
			$table->timestamps();

			$table->index('type');
			$table->index('title');
		});

		Schema::create('service_logs', function (Blueprint $table) {
			$table->id();
			$table->morphs('serviceable');
			$table->unsignedBigInteger('service_id');
			$table->string('notes', 2000);
			$table->dateTime('service_date');
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('livestock');
		Schema::dropIfExists('equipment');
		Schema::dropIfExists('seeds');
		Schema::dropIfExists('locations');
		Schema::dropIfExists('service_logs');
		Schema::dropIfExists('services');
		Schema::dropIfExists('varieties');
	}
};
