<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
	    Schema::create('inventories', function (Blueprint $table) {
            $table->id();
		    $table->morphs('inventoriable');
		    $table->string('name', 255);
		    $table->integer('quantity')->default(1);
		    $table->dateTime('acquired_at')->nullable();
		    $table->timestamps();
        });

	    Schema::create('inventory_groups', function (Blueprint $table) {
		    $table->id();
			$table->string('name', 100);
		    $table->string('description', 255);
		    $table->timestamps();
	    });

	    Schema::create('inventory_group_items', function (Blueprint $table) {
		    $table->id();
		    $table->unsignedBigInteger('inventory_group_id');
		    $table->unsignedBigInteger('inventory_id');
	    });

	    Schema::create('livestock', function (Blueprint $table) {
		    $table->id();
		    $table->string('type', 100);
		    $table->string('breed', 100)->nullable();
			$table->dateTime('date_of_birth')->nullable();
		    $table->timestamps();
	    });

	    Schema::create('equipment', function (Blueprint $table) {
		    $table->id();
		    $table->string('type', 100);
		    $table->integer('condition');
		    $table->string('description')->nullable();
		    $table->timestamps();
	    });

	    Schema::create('images', function (Blueprint $table) {
		    $table->id();
		    $table->morphs('imageable');
			$table->string('url');
		    $table->string('slug', 255);
		    $table->string('title', 100);
			$table->string('description', 255)->nullable();
			$table->string('filesize')->nullable();
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
	    Schema::dropIfExists('inventories');
	    Schema::dropIfExists('inventory_groups');
	    Schema::dropIfExists('inventory_group_items');
	    Schema::dropIfExists('livestock');
	    Schema::dropIfExists('equipment');
	    Schema::dropIfExists('images');
    }
};
