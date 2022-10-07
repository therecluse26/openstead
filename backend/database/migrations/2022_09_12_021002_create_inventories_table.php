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

		Schema::create('livestock', function (Blueprint $table) {
			$table->id();
			$table->string('name', 255);
			$table->string('type', 100);
			$table->string('breed', 100)->nullable();
			$table->dateTime('date_of_birth')->nullable();
			$table->unsignedBigInteger('location_id')->nullable();
			$table->integer('quantity')->default(1);
			$table->dateTime('acquired_at')->nullable();
			$table->timestamps();
		});

		Schema::create('livestock_breeds', function (Blueprint $table) {
			$table->id();
			$table->string('type', 100);
			$table->string('name', 100);
			$table->string('description', 255);
			$table->timestamps();
		});

		Schema::create('livestock_groups', function (Blueprint $table) {
			$table->id();
			$table->string('type', 100);
			$table->string('name', 100);
			$table->string('description', 255);
			$table->timestamps();
		});

		Schema::create('livestock_group_members', function (Blueprint $table) {
			$table->id();
			$table->unsignedBigInteger('livestock_group_id');
			$table->unsignedBigInteger('livestock_id');
		});

		Schema::create('equipment', function (Blueprint $table) {
			$table->id();
			$table->string('name', 255);
			$table->string('type', 100);
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
		Schema::dropIfExists('livestock_groups');
		Schema::dropIfExists('livestock_group_members');
		Schema::dropIfExists('livestock');
		Schema::dropIfExists('equipment');
		Schema::dropIfExists('images');
	}
};
