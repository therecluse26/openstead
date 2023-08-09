<?php

use App\Http\Controllers\Generic\EditableFieldController;
use App\Http\Controllers\Generic\NoteController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Inventory\ServiceLogController;
use App\Http\Controllers\Media\ImageController;
use App\Http\Controllers\Projects\ProjectController;
use App\Http\Controllers\Projects\ProjectItemController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\Users\UserController;
use App\Services\RouteBuilderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('/images/{imageId}', [ImageController::class, 'showImage'])->name('image.show');


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
	return $request->user();
});



Route::middleware(['auth:sanctum'])->group(function () {

	Route::put('/editable-field/{modelName}/{modelId}', [EditableFieldController::class, 'update']);
	Route::post('/images/base64', [ImageController::class, 'uploadBase64']);

	Route::prefix('/projects')
	->group(static function () {
		Route::get('/', [ProjectController::class, 'index']);
		Route::post('/', [ProjectController::class, 'store']);
		Route::put('/{id}', [ProjectController::class, 'update']);
		Route::post('/{id}/items', [ProjectController::class, 'createItem']);
		Route::put('/{id}/items', [ProjectController::class, 'updateItems']);
		Route::get('/{project_id}/items/{item_id}', [ProjectItemController::class, 'show']);
		Route::get('/{id}', [ProjectController::class, 'show']);
		Route::get('/{id}/statuses', [ProjectController::class, 'getStatuses']);
		Route::get('/{id}/users', [ProjectController::class, 'getUsers']);
		Route::delete('/{id}', [ProjectController::class, 'destroy']);
		Route::delete('/{project_id}/items/{item_id}', [ProjectItemController::class, 'destroy']);
	});

	Route::prefix('/inventory')
		->group(function () {
			Route::get('/filters', [InventoryController::class, 'getFilters']);
			Route::get('/base/types', [InventoryController::class, 'getTypes']);

			Route::prefix('/equipment')->group(base_path('routes/inventory/equipment-routes.php'));
			Route::prefix('/livestock')->group(base_path('routes/inventory/livestock-routes.php'));
			Route::prefix('/pantry')->group(base_path('routes/inventory/pantry-routes.php'));
			Route::prefix('/seeds')->group(base_path('routes/inventory/seed-routes.php'));
		});

	Route::prefix('/notes')
		->group(function () {
			Route::delete('/{id}', [NoteController::class, 'destroy']);
			Route::get('/{modelName}/{modelId}', [NoteController::class, 'index']);
			Route::post('/', [NoteController::class, 'store']);
		});

	// Services/Service Logs
	Route::prefix('/services')
		->group(function () {
			Route::get('/', [ServiceLogController::class, 'getServices']);
			Route::post('/', [ServiceController::class, 'store']);
			RouteBuilderService::buildTypeFilterRoute(ServiceLogController::class);
			Route::prefix('/logs')
				->group(function () {
					Route::delete('/{id}', [ServiceLogController::class, 'destroy']);
					Route::get('/{modelName}/{modelId}', [ServiceLogController::class, 'index']);
					Route::post('/', [ServiceLogController::class, 'store']);
				});

		});

	Route::get('/users', [UserController::class, 'index']);

});

Route::fallback(function () {
    return response()->json([
		'message' => "Invalid route"
	], 404);
});