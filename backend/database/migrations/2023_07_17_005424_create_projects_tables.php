<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    { 
Schema::dropIfExists('projects');
        Schema::create('project_item_statuses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name', 50);
            $table->string('description', 255)->nullable();
            $table->string('color', 7)->default('#CCCCCC');
            $table->boolean('default')->default(false);
            $table->tinyInteger('default_order')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('name');
        });

        $backlogId = Str::ulid();
        $todoId = Str::ulid();
        $inProgressId = Str::ulid();
        $doneId = Str::ulid();

        // Seed project status table
        DB::table('project_item_statuses')->insert([
            ['id' => $backlogId, 'default' => true, 'default_order' => 1, 'name' => 'Backlog', 'description' => 'The backlog contains a prioritized list of all the work that the team needs to do.'],
            ['id' => $todoId, 'default' => true, 'default_order' => 2, 'name' => 'To Do', 'description' => 'The to do column contains a prioritized list of all the work that the team needs to do.'],
            ['id' => $inProgressId, 'default' => true, 'default_order' => 3, 'name' => 'In Progress', 'description' => 'The in progress column contains a prioritized list of all the work that the team needs to do.'],
            ['id' => $doneId, 'default' => true, 'default_order' => 4, 'name' => 'Done', 'description' => 'The done column contains a prioritized list of all the work that the team needs to do.'],
        ]);

        Schema::create('projects', function (Blueprint $table) use ($backlogId, $todoId, $inProgressId, $doneId) {
            $table->ulid('id')->primary();
            $table->string('name', 80);
            $table->text('description')->nullable();
            $table->json('workflow_statuses');
            $table->boolean('active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('project_users', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('project_id');
            $table->ulid('user_id');
            $table->string('role', 50);
            $table->boolean('is_owner')->default(false);
            $table->timestamps();

            $table->index('project_id');
            $table->index('user_id');
        });

        Schema::create('project_columns', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('project_id');
            $table->string('title', 150);
            $table->ulid('project_item_status_id');
            $table->unsignedInteger('order');
            $table->softDeletes();
            $table->timestamps();

            $table->index('project_id');
            $table->index('project_item_status_id');
        });

        Schema::create('project_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('project_id');
            $table->string('title', 150);
            $table->text('description')->nullable();            
            $table->ulid('project_item_status_id');
            $table->dateTime('due_date')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->ulid('completed_by_id')->nullable();
            $table->ulid('creator_id');
            $table->ulid('assignee_id')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('project_id');
            $table->index('project_item_status_id');
            $table->index('creator_id');
            $table->index('assignee_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
        Schema::dropIfExists('project_users');
        Schema::dropIfExists('project_item_statuses');
        Schema::dropIfExists('project_columns');
        Schema::dropIfExists('project_items');
    }
};
