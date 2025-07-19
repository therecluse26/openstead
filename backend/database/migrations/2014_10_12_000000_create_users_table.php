<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Query\Expression;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('users', function (Blueprint $table) {
			$table->ulid('id')->primary();
			$table->string('name');
			$table->string('email')->unique();
			$table->timestamp('email_verified_at')->nullable();
			$table->string('password');
			$table->string('avatar_url')->nullable();
			$table->string('current_tenant_id');
			$table->rememberToken();
			$table->timestamps();
			$table->softDeletes();

			$table->index('name');
			$table->index('email');
			$table->index('current_tenant_id');
		});

		Schema::create('tenant_users', function (Blueprint $table) {
			if (DB::getDriverName() === 'mysql') {
				$table->id();
				$table->string('tenant_id');
				$table->ulid('user_id');
				$table->json('roles')->default(new Expression('(JSON_ARRAY("viewer"))'));
				$table->json('permissions')->nullable();
				$table->timestamps();
				$table->softDeletes();

				$table->index('tenant_id');
				$table->index('user_id');

				// Foreign key to tenant
				$table->foreign('tenant_id')->references('id')->on('tenants')->onUpdate('cascade')->onDelete('cascade');
				$table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
				return;
			}

			$table->id();
			$table->string('tenant_id');
			$table->ulid('user_id');
			$table->json('roles')->default(DB::raw("'[\"viewer\"]'"));
			$table->json('permissions')->nullable();
			$table->timestamps();
			$table->softDeletes();

			$table->index('tenant_id');
			$table->index('user_id');
			$table->index('primary');

			// Foreign key to tenant
			$table->foreign('tenant_id')->references('id')->on('tenants')->onUpdate('cascade')->onDelete('cascade');
			$table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('tenant_users');
		Schema::dropIfExists('users');
	}
};
