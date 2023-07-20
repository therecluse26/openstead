<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    { 
Schema::dropIfExists('projects');
        Schema::create('project_item_statuses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 50);
            $table->string('description', 255)->nullable();
            $table->string('color', 7)->default('#CCCCCC');
            $table->softDeletes();
            $table->timestamps();

            $table->index('name');
        });
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 80);
            $table->string('slug', 100)->unique();
            $table->string('description', 255)->nullable();
            $table->boolean('active')->default(true);
            $table->uuid('project_workflow_id')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('project_workflow_id');
        });

        Schema::create('project_users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->unsignedBigInteger('user_id');
            $table->string('role', 50);
            $table->boolean('is_owner')->default(false);
            $table->timestamps();

            $table->index('project_id');
            $table->index('user_id');
        });

        Schema::create('project_workflows', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->json('order');
            $table->boolean('default')->default(false);
            $table->softDeletes();
            $table->timestamps();

            $table->index('default');
        });

        Schema::create('project_columns', function (Blueprint $table) {
            $table->id();
            $table->uuid('project_id');
            $table->string('title', 150);
            $table->uuid('project_item_status_id');
            $table->unsignedInteger('order');
            $table->softDeletes();
            $table->timestamps();

            $table->index('project_id');
            $table->index('project_item_status_id');
        });

        Schema::create('project_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('title', 150);
            $table->string('description', 15000)->nullable();
            $table->uuid('project_item_status_id');
            $table->dateTime('due_date')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->unsignedBigInteger('completed_by')->nullable();
            $table->unsignedBigInteger('creator_id');
            $table->unsignedBigInteger('assignee_id')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('project_id');
            $table->index('project_item_status_id');
            $table->index('creator_id');
            $table->index('assignee_id');
        });

        // Seed project status table
        DB::table('project_item_statuses')->insert([
            ['id' => '5abe9c2c-c4e4-4a01-b82c-e164d3431fb8', 'name' => 'Backlog', 'description' => 'The backlog contains a prioritized list of all the work that the team needs to do.'],
            ['id' => '1887b4e1-c69d-452b-8e3d-cce8b380a9fa', 'name' => 'To Do', 'description' => 'The to do column contains a prioritized list of all the work that the team needs to do.'],
            ['id' => 'ccccb6b5-00f2-4f7e-bba3-1c4a0749af07', 'name' => 'In Progress', 'description' => 'The in progress column contains a prioritized list of all the work that the team needs to do.'],
            ['id' => 'a8fd32a7-fc63-410d-87df-e3dd0fad8392', 'name' => 'Done', 'description' => 'The done column contains a prioritized list of all the work that the team needs to do.'],
        ]);

        // Seed project workflow table
        DB::table('project_workflows')->insert([
            [            
                'id' => 'd14ecc18-0880-4fb5-84c2-d1d7897bfb09',
                'order' => json_encode(
                    [
                        ['id'=> '5abe9c2c-c4e4-4a01-b82c-e164d3431fb8', 'order' => 1, 'initial' => true], 
                        ['id'=> '1887b4e1-c69d-452b-8e3d-cce8b380a9fa', 'order' => 2], 
                        ['id'=> 'ccccb6b5-00f2-4f7e-bba3-1c4a0749af07', 'order' => 3], 
                        ['id'=> 'a8fd32a7-fc63-410d-87df-e3dd0fad8392', 'order' => 4, 'complete' => true]
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
