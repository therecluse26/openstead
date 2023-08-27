<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Query\Expression;

return new class extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('users', function (Blueprint $table) {
			$table->json('roles')->after('password')->default(new Expression('(JSON_ARRAY("user"))'));
			$table->json('permissions')->nullable()->after('roles');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('users', function (Blueprint $table) {
			if(Schema::hasColumn('users', 'roles'))
			{
				$table->dropColumn('roles');
			}
			
			if(Schema::hasColumn('users', 'permissions'))
			{
				$table->dropColumn('permissions');
			}
		});	
	}
};
