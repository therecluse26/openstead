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
			$table->enum('kingdom', ['plant', 'animal', 'fungi', 'protist', 'monera']);
			$table->string('group_type', 50);
			$table->string('variety_name', 50);
			$table->string('description', 1000);
			$table->timestamps();
		});

		Schema::create('livestock', function (Blueprint $table) {
			$table->id();
			$table->string('name', 255);
			$table->string('type', 50);
			$table->dateTime('date_of_birth')->nullable();
			$table->unsignedBigInteger('variety_id')->nullable();
			$table->unsignedBigInteger('location_id')->nullable();
			$table->integer('quantity')->default(1);
			$table->dateTime('acquired_at')->nullable();
			$table->timestamps();
		});

		Schema::create('seeds', function (Blueprint $table) {
			$table->id();
			$table->string('type', 50);
			$table->unsignedBigInteger('variety_id')->nullable();
			$table->unsignedBigInteger('location_id')->nullable();
			$table->integer('quantity')->default(1);
			$table->dateTime('acquired_at')->nullable();
			$table->timestamps();
		});

		Schema::create('equipment', function (Blueprint $table) {
			$table->id();
			$table->string('name', 255);
			$table->string('type', 50);
			$table->integer('condition');
			$table->string('description')->nullable();
			$table->string('url', 2000)->nullable();
			$table->unsignedBigInteger('location_id')->nullable();
			$table->integer('quantity')->default(1);
			$table->dateTime('acquired_at')->nullable();
			$table->timestamps();
		});

		Schema::create('images', function (Blueprint $table) {
			$table->id();
			$table->morphs('imageable');
			$table->string('url');
			$table->string('slug', 255)->nullable();
			$table->string('title', 100)->nullable();
			$table->string('description', 255)->nullable();
			$table->unsignedInteger('filesize')->nullable();
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
		Schema::dropIfExists('images');
		Schema::dropIfExists('locations');
		Schema::dropIfExists('varieties');
	}
};
