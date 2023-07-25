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
            $table->softDeletes();
            $table->timestamps();

            $table->index('name');
        });
        Schema::create('projects', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name', 80);
            $table->string('slug', 100)->unique();
            $table->string('description', 255)->nullable();
            $table->boolean('active')->default(true);
            $table->ulid('project_workflow_id')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('project_workflow_id');
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

        Schema::create('project_workflows', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->json('order');
            $table->boolean('default')->default(false);
            $table->softDeletes();
            $table->timestamps();

            $table->index('default');
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
            $table->string('description', 15000)->nullable();            
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

        $backlogId = Str::ulid();
        $todoId = Str::ulid();
        $inProgressId = Str::ulid();
        $doneId = Str::ulid();

        // Seed project status table
        DB::table('project_item_statuses')->insert([
            ['id' => $backlogId, 'name' => 'Backlog', 'description' => 'The backlog contains a prioritized list of all the work that the team needs to do.'],
            ['id' => $todoId, 'name' => 'To Do', 'description' => 'The to do column contains a prioritized list of all the work that the team needs to do.'],
            ['id' => $inProgressId, 'name' => 'In Progress', 'description' => 'The in progress column contains a prioritized list of all the work that the team needs to do.'],
            ['id' => $doneId, 'name' => 'Done', 'description' => 'The done column contains a prioritized list of all the work that the team needs to do.'],
        ]);

        // Seed project workflow table
        DB::table('project_workflows')->insert([
            [            
                'id' => Str::ulid(),
                'order' => json_encode(
                    [
                        ['id'=> $backlogId, 'order' => 1, 'initial' => true], 
                        ['id'=> $todoId, 'order' => 2], 
                        ['id'=> $inProgressId, 'order' => 3], 
                        ['id'=> $doneId, 'order' => 4, 'complete' => true]
                    ]
                ), 'default' => true
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
        Schema::dropIfExists('project_users');
        Schema::dropIfExists('project_item_statuses');
        Schema::dropIfExists('project_workflows');
        Schema::dropIfExists('project_columns');
        Schema::dropIfExists('project_items');

    }
};
